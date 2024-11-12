export type ServerActionResponse<T = undefined> = T extends undefined
  ? {
      status: "success" | "error" | "info";
      message: string;
      data?: never;
    }
  : {
      status: "success" | "error" | "info";
      message: string;
      data: T;
    };

export type SessionUser =
  | {
      id: string;
      email: string;
      emailVerified: boolean;
      name: string;
      createdAt: Date;
      updatedAt: Date;
      image?: string | undefined;
      username?: string | undefined;
    }
  | undefined;
