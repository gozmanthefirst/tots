"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Tot } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Local Imports
import { TotsEditor } from "@/features/editor/components/tots-editor";
import { Container } from "@/shared/components/container";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/shared/components/form";
import { ServerActionResponse } from "@/shared/types";
import { createTot } from "../actions/create-tot";

const editorSchema = z.object({
  tot: z
    .string()
    .min(1, { message: "C'mon now, surely your Tot can't be blank." }),
});

type EditorFormType = z.infer<typeof editorSchema>;

export const TotsEditorForm = () => {
  const form = useForm<EditorFormType>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      tot: "",
    },
  });

  const onSubmit = async (values: EditorFormType) => {
    console.log(values.tot); //! TBR

    try {
      const response: ServerActionResponse | ServerActionResponse<Tot> =
        await createTot(values);

      if (response.status === "success") {
        console.log(response.message); //! TBR
        return;
      }
      if (response.status === "error") {
        console.log(response.message);
        return;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Container className="sticky bottom-0 z-20">
      <section className="mx-auto h-full w-full max-w-2xl py-3 md:py-4">
        <Form {...form}>
          <form
            id="tot-editor"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            <FormField
              control={form.control}
              name="tot"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <TotsEditor tots={field.value} onChange={field.onChange} />
                  </FormControl>
                </FormItem>
              )}
            />
          </form>
        </Form>
      </section>
    </Container>
  );
};
