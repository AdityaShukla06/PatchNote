import { MDXRemote } from "next-mdx-remote/rsc";

export function MarkdownRenderer({ source }: { source: string }) {
  if (!source) return null;
  return (
    <div className="prose prose-invert max-w-none">
      <MDXRemote source={source} />
    </div>
  );
}
