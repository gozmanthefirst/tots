// External Imports
import DOMPurify from "dompurify";
import { HTMLAttributes, Ref } from "react";

export interface HtmlRendererProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  html: string;
}

export const HtmlRenderer = ({
  className,
  ref,
  html,
  ...props
}: HtmlRendererProps) => {
  const cleanHtml = DOMPurify.sanitize(html);

  return (
    <div ref={ref} dangerouslySetInnerHTML={{ __html: cleanHtml }} {...props} />
  );
};
