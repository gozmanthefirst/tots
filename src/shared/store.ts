import { Store } from "@tanstack/react-store";

export const mainPageComponentStore = new Store<HTMLElement | null>(null);
export const drawerStore = new Store<string | null>(null);
