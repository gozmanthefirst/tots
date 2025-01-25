import { Tot } from "@prisma/client";

interface Props {
  tot: Tot;
}

export const SingleTot = ({ tot }: Props) => {
  return (
    <div
      className="relative rounded-2xl border border-neutral-800 bg-neutral-800/50 p-4 text-neutral-300 shadow-sm md:rounded-3xl md:p-5"
    >
      <div dangerouslySetInnerHTML={{ __html: tot.content }} />
    </div>
  );
};
