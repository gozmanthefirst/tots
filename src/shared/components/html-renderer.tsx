import { HTMLAttributes, Ref } from "react";

interface HtmlRendererProps extends HTMLAttributes<HTMLDivElement> {
  ref?: Ref<HTMLDivElement>;
  html: string;
}

export const HtmlRenderer = ({ ref, html, ...props }: HtmlRendererProps) => {
  return (
    <div ref={ref} dangerouslySetInnerHTML={{ __html: html }} {...props} />
  );
};
