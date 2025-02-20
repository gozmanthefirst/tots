"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { Tot } from "@prisma/client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useStore } from "@tanstack/react-store";
import { useWindowSize } from "@uidotdev/usehooks";
import { useEffect } from "react";
import { useForm, UseFormReturn } from "react-hook-form";
import { TbClearAll, TbX } from "react-icons/tb";
import { z } from "zod";

// Local Imports
import { TotsEditor } from "@/features/editor/components/tots-editor";
import { createTot } from "@/features/tots/actions/create-tot";
import { editTot } from "@/features/tots/actions/edit-tot";
import { Button } from "@/shared/components/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/components/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/shared/components/form";
import { Modal, ModalContent, ModalTitle } from "@/shared/components/modal";
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

  const windowSize = useWindowSize();

  const currentTot = drawer.tot;

  const form = useForm<EditorFormType>({
    resolver: zodResolver(editorSchema),
    defaultValues: {
      tot: currentTot?.content || "",
    },
  });

  // useEffect for populating the tot in the form when the drawer/modal opens
  useEffect(() => {
    form.setValue("tot", currentTot?.content || "");
  }, [currentTot?.content, form]);

  const onSubmit = async (values: EditorFormType) => {
    console.log(values.tot); //! TBR

    try {
      let response: ServerActionResponse | ServerActionResponse<Tot>;

      if (!drawer.tot) {
        response = await createTot(values);
      } else {
        response = await editTot({
          updatedTot: values.tot,
          tot: drawer.tot,
        });
      }

      if (response.status === "success") {
        console.log(response.message); //! TBR
        drawerStore.setState(() => ({
          drawerName: null,
          editable: false,
          tot: null,
        }));
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

  if (!windowSize.width) return null;

  return (
    <>
      {windowSize.width >= 1024 ? (
        <Drawer
          open={!!drawer.drawerName}
          onOpenChange={(open) => {
            if (!open) {
              drawerStore.setState(() => ({
                drawerName: null,
                editable: false,
                tot: null,
              }));
            }
          }}
          container={drawerContainer}
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
                        <TotsEditor
                          tots={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            {/* Close Button */}
            <ExternalControls form={form} />
          </DrawerContent>
        </Drawer>
      ) : (
        <Modal
          open={!!drawer.drawerName}
          onOpenChange={(open) => {
            if (!open) {
              drawerStore.setState(() => ({
                drawerName: null,
                editable: false,
              }));
            }
          }}
        >
          <ModalContent>
            <VisuallyHidden>
              <ModalTitle>Tot Editor</ModalTitle>
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
                        <TotsEditor
                          tots={field.value}
                          onChange={field.onChange}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </form>
            </Form>

            {/* Close Button */}
            <ExternalControls form={form} />
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

const ExternalControls = ({
  form,
}: {
  form: UseFormReturn<
    {
      tot: string;
    },
    any,
    undefined
  >;
}) => {
  const drawer = useStore(drawerStore);

  return (
    <div className="absolute -top-12 right-0 flex flex-row-reverse items-center gap-3 lg:top-0 lg:-right-12 lg:flex-col">
      {/* Close Drawer/Modal */}
      <Button
        size="icon"
        type="button"
        onClick={() =>
          drawerStore.setState(() => ({
            drawerName: null,
            editable: false,
            tot: null,
          }))
        }
        variant="secondary"
        className="ml-auto cursor-pointer rounded-full"
      >
        <TbX size={20} strokeWidth={2} />
      </Button>

      {/* Clear Tot */}
      {drawer.editable ? (
        <Button
          size="icon"
          type="button"
          onClick={() => {
            form.setValue("tot", "");
            console.log(form.getValues());
          }}
          variant="secondary"
          className="ml-auto cursor-pointer rounded-full"
        >
          <TbClearAll size={20} strokeWidth={2} />
        </Button>
      ) : null}
    </div>
  );
};
