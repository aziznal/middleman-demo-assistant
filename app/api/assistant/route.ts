import openai from "@/lib/openai-client";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { NextRequest, NextResponse } from "next/server";

import { cookies } from "next/headers";

import { assistantRequestSchema } from "./_schema";

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
    // tools: [
    //   {
    //     type: "function",
    //     function: {
    //       name: "create_new_service",
    //       description: "Creates a new service for the user",
    //       parameters: {
    //         type: "object",
    //         properties: {
    //           title: {
    //             type: "string",
    //             description: "The title of the service",
    //           },
    //           description: {
    //             type: "string",
    //             description:
    //               "The description of the service, meant to entice users to use it",
    //           },
    //           workingHours: {
    //             type: "string",
    //             description:
    //               "a basic description of the working hours of the service",
    //           },
    //         },
    //       },
    //     },
    //   },
    // ],
  });

  console.log(run);

  // loop for 10 seconds, checking if run has completed
  const start = Date.now();
  while (Date.now() - start < 10000) {
    const newRun = await openai.beta.threads.runs.retrieve(threadId, run.id);
    console.log("checking newRun");
    console.log(newRun);
    if (newRun.status === "completed") {
      break;
    }
  }

  const newMessages = await openai.beta.threads.messages.list(threadId, {
    order: "asc",
  });

  return NextResponse.json({
    messages: newMessages.data,
  });
}
