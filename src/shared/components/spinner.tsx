// External Imports
import { CSSProperties } from "react";

const bars = Array(12).fill(0);

interface Props {
  color: string;
  size?: number;
}

export const Spinner = ({ color, size = 20 }: Props) => {
  return (
    <div
      className="size-(--spinner-size)"
      style={
        {
          "--spinner-size": `${size}px`,
          "--spinner-color": `${color}`,
        } as CSSProperties & Record<string, string>
      }
    >
      <div className="relative top-1/2 left-1/2 size-(--spinner-size)">
        {bars.map((_, i) => (
          <div
            key={`spinner-bar-${i}`}
            className="bar absolute -top-[4%] -left-[10%] h-[8%] w-[24%] animate-load rounded-md bg-(--spinner-color)"
          />
        ))}
      </div>
    </div>
  );
};
