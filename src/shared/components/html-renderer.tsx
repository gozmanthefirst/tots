import { HTMLAttributes, Ref } from "react";
import DOMPurify from "dompurify";

interface HtmlRendererProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  html: string;
}

export const HtmlRenderer = ({ ref, html, ...props }: HtmlRendererProps) => {
  const cleanHtml = DOMPurify.sanitize(html);

  return (
    <div ref={ref} dangerouslySetInnerHTML={{ __html: cleanHtml }} {...props} />
  );
};
