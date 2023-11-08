import openai from "@/lib/openai-client";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";

import { assistantRequestSchema } from "./_schema";
import dbClient from "@/db/client";

import * as schema from "@/db/schema";
import { and, eq, ilike } from "drizzle-orm";

export async function POST(req: NextRequest) {
  const parsedReqBody = assistantRequestSchema.safeParse(await req.json());

  if (!parsedReqBody.success) {
    console.log(JSON.stringify(parsedReqBody.error.format()));

    return new NextResponse(
      `Bad request body. ${JSON.stringify(parsedReqBody.error.format())}`,
      {
        status: 400,
      }
    );
  }

  const supabase = createRouteHandlerClient({ cookies });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", {
      status: 401,
    });
  }

  // if threadId was provided, use it, otherwise create a new thread
  const threadId =
    parsedReqBody.data.threadId || (await openai.beta.threads.create({})).id;

  await openai.beta.threads.messages.create(threadId, {
    role: "user",
    content: parsedReqBody.data.message.content,
  });

  const run = await openai.beta.threads.runs.create(threadId, {
    assistant_id: "asst_K9WGp6X40VjxX8FG9VgaR3mU",
    tools: [
      // Function to create a new service
      {
        type: "function",
        function: {
          name: "create_new_service",
          description: "Creates a new service for the user",
          parameters: {
            type: "object",
            properties: {
              title: {
                type: "string",
                description: "The title of the service",
              },
              description: {
                type: "string",
                description:
                  "The description of the service, meant to entice users to use it",
              },
              workingHours: {
                type: "string",
                description:
                  "a basic description of the working hours of the service",
              },
            },
            required: ["title", "description", "workingHours"],
          },
        },
      },

      // Function to list all current user's services
      {
        type: "function",
        function: {
          name: "overview_current_user_services",
          description: "Lists all services created by the current user",
          parameters: {
            type: "object",
            properties: {},
          },
        },
      },

      // Function to list all current user's services
      {
        type: "function",
        function: {
          name: "update_existing_service",
          description:
            "Updates a service created by the current user. User is prompted to provide the name of the service to update, where the names are listed by the overview_current_user_services function. This returns the id of the service to the user allowing it to be used in further operations. Assistant will continue to use the name and not the id of the service.",
          parameters: {
            type: "object",
            properties: {
              currentTitle: {
                type: "string",
                description:
                  "The current title of the service (case insensitive)",
              },
              title: {
                type: "string",
                description: "The updated title of the service",
              },
              description: {
                type: "string",
                description: "The updated description of the service",
              },
              workingHours: {
                type: "string",
                description:
                  "an updated description of the working hours of the service",
              },
            },
          },
        },
      },
    ],
  });

  // loop for 15 seconds, checking if run has completed
  const start = Date.now();
  while (Date.now() - start < 15000) {
    const newRun = await openai.beta.threads.runs.retrieve(threadId, run.id);
    console.log("checking newRun");
    console.log(newRun.status);
    if (newRun.status === "completed") {
      break;
    }

    if (newRun.status === "requires_action") {
      const callId = newRun.required_action?.submit_tool_outputs.tool_calls.map(
        (call) => call.id
      )[0];

      // create service function handler
      const functionName =
        newRun.required_action?.submit_tool_outputs.tool_calls[0].function.name;

      if (functionName === "overview_current_user_services") {
        const userWithServices = await dbClient.query.users.findMany({
          with: {
            services: true,
          },
          where: eq(schema.users.id, user.id),
        });

        await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
          tool_outputs: [
            {
              tool_call_id: callId,
              output: JSON.stringify(userWithServices),
            },
          ],
        });
      }

      if (functionName === "create_new_service") {
        const args = JSON.parse(
          newRun.required_action?.submit_tool_outputs.tool_calls[0].function
            .arguments || "{}"
        );

        // create a new service for the user in the database
        await dbClient.insert(schema.services).values({
          title: args.title,
          description: args.description,
          workingHours: args.workingHours,
          userId: user.id,
          rating: 0,
        });

        await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
          tool_outputs: [
            {
              tool_call_id: callId,
              output:
                "Service successfully created. Browse at url: http://localhost:3000/browse-services",
            },
          ],
        });
      }

      if (functionName === "update_existing_service") {
        const args = JSON.parse(
          newRun.required_action?.submit_tool_outputs.tool_calls[0].function
            .arguments || "{}"
        );

        console.log(`update service function args: ${JSON.stringify(args)}`);

        const userService = await dbClient.query.services.findFirst({
          where: and(
            eq(schema.services.userId, user.id),
            // loosely match the title
            ilike(schema.services.title, `%${args.currentTitle}%`)
          ),
        });

        console.log(`userService: ${JSON.stringify(userService)}`);

        if (!userService) {
          await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
            tool_outputs: [
              {
                tool_call_id: callId,
                output: "Service not found or user does not own service",
              },
            ],
          });
        } else {
          await dbClient
            .update(schema.services)
            .set({
              title: args.title,
              description: args.description,
              workingHours: args.workingHours,
            })
            .where(eq(schema.services.id, userService.id));

          await openai.beta.threads.runs.submitToolOutputs(threadId, run.id, {
            tool_outputs: [
              {
                tool_call_id: callId,
                output: "Service successfully updated",
              },
            ],
          });
        }
      }
    }
  }

  const newMessages = await openai.beta.threads.messages.list(threadId, {
    order: "asc",
  });

  return NextResponse.json({
    messages: newMessages.data,
  });
}
