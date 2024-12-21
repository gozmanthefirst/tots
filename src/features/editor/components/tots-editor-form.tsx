"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Local Imports
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/form";
import { Input } from "@/shared/components/input";
import { editorSchema } from "../schemas/zod-schema";
import { TotsEditor } from "@/features/editor/components/tots-editor";

type EditorFormType = z.infer<typeof editorSchema>;

export const TotsEditorForm = () => {
  const form = useForm<EditorFormType>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      tots: "",
    },
  });

  const onSubmit = (values: EditorFormType) => {};

  return (
    <section className="sticky bottom-0 max-w-2xl mx-auto w-full h-full my-4 md:my-6">
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
                  {/* <Input
                    type="text"
                    placeholder="Write down your tots..."
                    {...field}
                  /> */}
                  <TotsEditor tots={field.value} onChange={field.onChange} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </form>
      </Form>
    </section>
  );
};
