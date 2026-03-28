"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

const components: Components = {
  table: ({ children, ...props }) => (
    <div className="overflow-x-auto my-3 rounded-lg border border-gray-200">
      <table className="min-w-full text-sm" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="bg-gray-50 border-b border-gray-200" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody className="divide-y divide-gray-100" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr className="hover:bg-gray-50/50 transition-colors" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th
      className="px-3 py-2 text-start font-semibold text-gray-700 text-xs whitespace-nowrap"
      {...props}
    >
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-3 py-2 text-gray-600 text-xs" {...props}>
      {children}
    </td>
  ),
  h1: ({ children, ...props }) => (
    <h1 className="text-lg font-bold text-gray-900 mt-4 mb-2" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="text-base font-bold text-gray-800 mt-3 mb-1.5 border-b border-gray-100 pb-1" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="text-sm font-bold text-gray-800 mt-2.5 mb-1" {...props}>
      {children}
    </h3>
  ),
  p: ({ children, ...props }) => (
    <p className="text-sm leading-relaxed text-gray-700 mb-2" {...props}>
      {children}
    </p>
  ),
  ul: ({ children, ...props }) => (
    <ul className="list-disc list-inside space-y-1 my-2 text-sm text-gray-700" {...props}>
      {children}
    </ul>
  ),
  ol: ({ children, ...props }) => (
    <ol className="list-decimal list-inside space-y-1 my-2 text-sm text-gray-700" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="leading-relaxed" {...props}>
      {children}
    </li>
  ),
  strong: ({ children, ...props }) => (
    <strong className="font-semibold text-gray-900" {...props}>
      {children}
    </strong>
  ),
  blockquote: ({ children, ...props }) => (
    <blockquote
      className="border-s-4 border-blue-300 bg-blue-50/50 ps-4 py-2 my-2 text-sm text-gray-600 italic rounded-e-lg"
      {...props}
    >
      {children}
    </blockquote>
  ),
  code: ({ children, className, ...props }) => {
    const isInline = !className;
    if (isInline) {
      return (
        <code
          className="bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded text-xs font-mono"
          {...props}
        >
          {children}
        </code>
      );
    }
    return (
      <code
        className="block bg-gray-900 text-gray-100 p-3 rounded-lg text-xs font-mono overflow-x-auto my-2"
        {...props}
      >
        {children}
      </code>
    );
  },
  hr: (props) => <hr className="my-3 border-gray-200" {...props} />,
  a: ({ children, href, ...props }) => {
    const isApiDownload = href && /\/api\/v1\/(chat\/files|ppt\/files)\//.test(href);
    if (isApiDownload) {
      return (
        <button
          type="button"
          className="text-blue-600 hover:text-blue-800 underline cursor-pointer"
          onClick={async () => {
            const token = localStorage.getItem("token");
            const baseURL = process.env.NEXT_PUBLIC_API_URL || "";
            const fullUrl = href.startsWith("http") ? href : `${baseURL}${href}`;
            try {
              const res = await fetch(fullUrl, {
                headers: { "ngrok-skip-browser-warning": "1", ...(token ? { Authorization: `Bearer ${token}` } : {}) },
              });
              if (!res.ok) throw new Error(`Download failed: ${res.status}`);
              const blob = await res.blob();
              const blobUrl = URL.createObjectURL(blob);
              const a = document.createElement("a");
              a.href = blobUrl;
              a.download = href.split("/").pop() || "download";
              document.body.appendChild(a);
              a.click();
              a.remove();
              URL.revokeObjectURL(blobUrl);
            } catch {
              // silent fail — inline download buttons are the primary mechanism
            }
          }}
        >
          {children}
        </button>
      );
    }
    return (
      <a
        href={href}
        className="text-blue-600 hover:text-blue-800 underline"
        target="_blank"
        rel="noopener noreferrer"
        {...props}
      >
        {children}
      </a>
    );
  },
};

export function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={className} dir="auto">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
