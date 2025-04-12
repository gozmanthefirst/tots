"use client";

import { useEffect, useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Tot } from "@prisma/client";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useStore } from "@tanstack/react-store";
import { useWindowSize } from "@uidotdev/usehooks";
import { useForm, UseFormReturn } from "react-hook-form";
import { TbClearAll, TbX } from "react-icons/tb";
import { z } from "zod";

import { editTot } from "@/features/tots/api/edit-tot";
import { getTots } from "@/features/tots/api/get-tots";
import { DelTotBtn } from "@/features/tots/components/del-tot-btn";
import { PinTotBtn } from "@/features/tots/components/pin-tot-btn";
import { Button } from "@/shared/components/button";
import { Drawer, DrawerContent, DrawerTitle } from "@/shared/components/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
} from "@/shared/components/form";
import { Modal, ModalContent, ModalTitle } from "@/shared/components/modal";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import {
  delTotBtnStateStore,
  drawerContainerStore,
  drawerStore,
  submitTotBtnStateStore,
} from "@/shared/store";
import { ServerActionResponse } from "@/shared/types";
import { createTot } from "../api/create-tot";
import { TotsEditor } from "./tots-editor";

const editorSchema = z.object({
  tot: z
    .string()
    .min(1, { message: "C'mon now, surely your Tot can't be blank." }),
});

type EditorFormType = z.infer<typeof editorSchema>;

export const TotDrawer = () => {
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

  const queryClient = useQueryClient();

  const onSubmit = async (values: EditorFormType) => {
    try {
      submitTotBtnStateStore.setState(() => "loading");

      let response: ServerActionResponse | ServerActionResponse<Tot>;

      if (!drawer.tot) {
        response = await createTot(values);
      } else {
        response = await editTot({
          updatedTot: { ...drawer.tot, content: values.tot },
        });
      }

      if (response.status === "error") {
        return submitTotBtnStateStore.setState(() => "error");
      }

      submitTotBtnStateStore.setState(() => "success");
      setTimeout(() => {
        drawerStore.setState(() => ({
          drawerName: null,
          editable: false,
          tot: null,
        }));
        form.setValue("tot", "");
      }, 1000);
      setTimeout(() => {
        queryClient.invalidateQueries({
          queryKey: ["tots"],
        });
      }, 1500);
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      submitTotBtnStateStore.setState(() => "error");
    } finally {
      setTimeout(() => {
        submitTotBtnStateStore.setState(() => "idle");
      }, 3000);
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
                          onSubmit={form.handleSubmit(onSubmit)}
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
                          onSubmit={form.handleSubmit(onSubmit)}
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
    undefined,
    { tot: string }
  >;
}) => {
  const drawer = useStore(drawerStore);
  const submitButtonState = useStore(submitTotBtnStateStore);
  const delButtonState = useStore(delTotBtnStateStore);
  const isPinned = drawer.tot?.pinned ?? false;

  const { data: { data: tots } = {} } = useQuery({
    queryKey: ["tots"],
    queryFn: () => runParallelAction(getTots()),
  });

  const pinnedTots = useMemo(() => {
    const pinned: Tot[] = [];

    // Extract pinned tots
    (tots ?? []).forEach((tot) => {
      if (tot.pinned) {
        pinned.push(tot);
      }
    });

    return pinned;
  }, [tots]);

  return (
    <>
      {/* Left Controls (Pin) */}
      <div className="absolute -top-12 left-0 flex items-center gap-3 lg:top-0 lg:-left-12 lg:flex-col">
        {drawer.editable &&
        drawer.tot &&
        (isPinned || pinnedTots.length < 3) ? (
          <PinTotBtn isPinned={isPinned} />
        ) : null}
      </div>

      {/* Right Controls (Close, Clear, Delete) */}
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
            }}
            variant="secondary"
            disabled={delButtonState !== "idle" || submitButtonState !== "idle"}
            className="ml-auto cursor-pointer rounded-full"
          >
            <TbClearAll size={20} strokeWidth={2} />
          </Button>
        ) : null}

        {/* Delete Tot */}
        {drawer.editable && !!drawer.tot ? <DelTotBtn /> : null}
      </div>
    </>
  );
};
