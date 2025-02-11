"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Tot } from "@prisma/client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useStore } from "@tanstack/react-store";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Local Imports
import { createTot } from "@/features/editor/actions/create-tot";
import { TotsEditor } from "@/features/editor/components/tots-editor";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/components/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/shared/components/form";
import { drawerContainerStore, drawerStore } from "@/shared/store";
import { ServerActionResponse } from "@/shared/types";

const editorSchema = z.object({
  tot: z
    .string()
    .min(1, { message: "C'mon now, surely your Tot can't be blank." }),
});

type EditorFormType = z.infer<typeof editorSchema>;

export const EditorDrawer = () => {
  const drawer = useStore(drawerStore);
  const drawerContainer = useStore(drawerContainerStore);

  const currentTot = drawer.tot;

  const form = useForm<EditorFormType>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      tot: currentTot?.content || "",
    },
  });

  useEffect(() => {
    form.setValue("tot", currentTot?.content || "");
  }, [currentTot?.content]);

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
    <Drawer
      open={!!drawer.drawerName}
      onOpenChange={(open) => {
        if (!open) {
          drawerStore.setState(() => ({
            drawerName: null,
            editable: false,
          }));
        }
      }}
      container={drawerContainer}
      repositionInputs={false}
    >
      <DrawerContent className="px-4 md:px-6">
        <VisuallyHidden>
          <DrawerTitle>Tot Editor</DrawerTitle>
        </VisuallyHidden>

        {/* Content */}
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
      </DrawerContent>
    </Drawer>
  );
};
