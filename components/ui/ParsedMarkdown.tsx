import ReactMarkdown from "react-markdown";
import { PropsWithChildren } from "react";
import remarkGfm from "remark-gfm";

/*
 * This component takes in a raw string of markdown and parses it into HTML
 *
 * @see https://www.npmjs.com/package/react-markdown
 *
 * The `components` property is a map used to make the parsed markdown use our
 * own styled react components since by default it uses HTML tags like h1, h2, etc..
 * which don't have any styling for
 */
export const ParsedMarkdown = ({ children }: { children: string }) => {
  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm]}
      components={{
        h1: ({ ...props }: PropsWithChildren) => (
          <h1 className="text-4xl font-bold my-4" {...props} />
        ),
        h2: ({ ...props }: PropsWithChildren) => (
          <h2 className="text-3xl font-bold my-3" {...props} />
        ),
        h3: ({ ...props }: PropsWithChildren) => (
          <h3 className="text-2xl font-bold my-2" {...props} />
        ),
        h4: ({ ...props }: PropsWithChildren) => (
          <h4 className="text-xl font-bold my-1" {...props} />
        ),
        ul: ({ children }: PropsWithChildren) => (
          <ul className="ml-2 list-inside list-disc leading-7">{children}</ul>
        ),
        ol: ({ children }: PropsWithChildren) => (
          <ol className="ml-2 list-inside list-decimal leading-7">
            {children}
          </ol>
        ),
        hr: () => <hr className="my-4 w-full border-t border-t-border-color" />,

        pre: ({ children }: PropsWithChildren) => (
          <pre className="my-2 rounded-lg bg-secondary-dark px-4 py-3 text-sm text-white">
            {children}
          </pre>
        ),
      }}
    >
      {children}
    </ReactMarkdown>
  );
};
