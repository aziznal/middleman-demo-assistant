"use client";

import { ParsedMarkdown } from "@/components/ui/ParsedMarkdown";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import useAssistant from "@/lib/hooks/useAssistant";
import { useEffect, useRef } from "react";

const Page = () => {
  const { messages, submit, reload, isSubmitting, error } = useAssistant();

  const inputRef = useRef<HTMLInputElement>(null);
  const messageViewRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log(messages);
  }, [messages]);

  useEffect(() => {
    if (isSubmitting) return;

    messageViewRef.current?.scrollTo({
      behavior: "smooth",
      top: messageViewRef.current.scrollHeight + 1000,
    });

    // focus on input when loading finishes
    inputRef.current?.focus();
  }, [isSubmitting]);

  const handleSubmit = () => {
    if (inputRef?.current?.value) {
      submit(inputRef.current.value);
      inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-col mx-auto w-[800px]">
      <div className="min-h-[500px] flex flex-col gap-5" ref={messageViewRef}>
        {messages.map((message) => (
          <div key={message.id}>
            <>
              {message.role === "user" && (
                <span className="text-blue-600 font-bold">You: </span>
              )}

              {message.role === "assistant" && (
                <span className="text-green-600 font-bold">Assistant: </span>
              )}
            </>

            {message.role === "assistant" &&
              message.content.map((content) => {
                if (content.type === "text") {
                  return (
                    <div key={content.text.value} className="prose">
                      <ParsedMarkdown>{content.text.value}</ParsedMarkdown>
                    </div>
                  );
                }

                return "";
              })}

            {message.role === "user" &&
              message.content.map((content) => {
                if (content.type === "text") {
                  return <p key={content.text.value}>{content.text.value}</p>;
                }

                return "";
              })}
          </div>
        ))}

        {isSubmitting && <div className="text-gray-400">Loading...</div>}
      </div>

      <div className="flex gap-2 mt-6 pb-72">
        <Input
          ref={inputRef}
          onSubmit={handleSubmit}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              handleSubmit();
            }
          }}
          disabled={isSubmitting}
        />

        <Button onClick={handleSubmit} disabled={isSubmitting}>
          Submit
        </Button>

        <Button onClick={reload} disabled={isSubmitting}>
          Reload
        </Button>
      </div>

      <div className="mt-4 text-red-400">{error}</div>
    </div>
  );
};

export default Page;
