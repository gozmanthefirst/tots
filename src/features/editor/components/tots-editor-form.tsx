"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Tots } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Local Imports
import { TotsEditor } from "@/features/editor/components/tots-editor";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/shared/components/form";
import { ServerActionResponse } from "@/shared/types";
import { createTot } from "../actions/create-tot";

export const editorSchema = z.object({
  tots: z.string().min(1, { message: "C'mon now, Tots can't be empty." }),
});

type EditorFormType = z.infer<typeof editorSchema>;

export const TotsEditorForm = () => {
  const form = useForm<EditorFormType>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      tots: "",
    },
  });

  const onSubmit = async (values: EditorFormType) => {
    console.log(values.tots); //! TBR

    try {
      const response: ServerActionResponse | ServerActionResponse<Tots> =
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
    <section className="sticky bottom-0 mx-auto my-4 h-full w-full max-w-2xl md:my-6">
      <Form {...form}>
        <form
          id="tots-editor"
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-6"
        >
          <FormField
            control={form.control}
            name="tots"
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
  );
};
