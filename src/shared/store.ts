import { Tot } from "@prisma/client";
import { Store } from "@tanstack/react-store";

export const drawerContainerStore = new Store<HTMLElement | null>(null);

export const drawerStore = new Store<{
  drawerName: string | null;
  editable: boolean;
  tot?: Tot | null;
}>({
  drawerName: null,
  editable: false,
  tot: null,
});

export const submitTotBtnStateStore = new Store<
  "idle" | "loading" | "success" | "error"
>("idle");

export const delTotBtnStateStore = new Store<
  "idle" | "loading" | "success" | "error"
>("idle");
