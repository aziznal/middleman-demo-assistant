import openai from "@/lib/openai-client";
import { NextRequest, NextResponse } from "next/server";

// WARNING: unprotected route. Not safe for production.

export async function GET(
  _request: NextRequest,
  ctx: { params: { threadId: string } }
) {
  const { data } = await openai.beta.threads.messages.list(
    ctx.params.threadId,
    {
      order: "asc",
    }
  );

  console.log(data);

  return NextResponse.json({
    messages: data,
  });
}
