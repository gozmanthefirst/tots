"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useQuery } from "@tanstack/react-query";
import { AnimatePresence, motion } from "motion/react";
import { useRouter } from "next/navigation";
import { Dispatch, JSX, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { RotatingLines } from "react-loader-spinner";
import { z } from "zod";

// Local Imports
import { getUsernames } from "@/shared/actions/get-usernames";
import { Button } from "@/shared/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/form";
import { Input } from "@/shared/components/input";
import { signOut } from "@/shared/lib/auth/auth-client";
import { cn } from "@/shared/lib/utils/cn";
import { runParallelAction } from "@/shared/lib/utils/parallel-server-action";
import { ServerActionResponse } from "@/shared/types";
import { instrumentSerif } from "@/styles/fonts";
import { createUsername } from "../actions/create-username";

const createUsernameBtnCopy = {
  idle: "Create Username",
  loading: <RotatingLines visible width="18" strokeColor="#0F0F0F" />,
  success: "Username created!",
  error: "Something went wrong",
};
const signOutBtnCopy = {
  idle: "Back to sign in",
  loading: <RotatingLines visible width="18" strokeColor="#E5E999" />,
  success: "Sign out successful!",
  error: "Something went wrong",
};

export const usernameSchema = (usernames: string[]) =>
  z.object({
    username: z
      .string({ required_error: "Username is required" })
      .trim()
      .min(5, { message: "Username must be 5 or more characters long" })
      .max(15, { message: "Username must be 15 or fewer characters long" })
      .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers, and underscores",
      })
      .refine((username) => !usernames.includes(username?.toLowerCase()), {
        message: "This username has already been taken",
      }),
  });

type UsernameFormType = z.infer<ReturnType<typeof usernameSchema>>;

export const CreateUsernameForm = () => {
  const router = useRouter();

  const [signOutBtnState, setSignOutBtnState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");
  const [createUsernameBtnState, setCreateUsernameBtnState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onRequest() {
            setSignOutBtnState("loading");
          },
          onError(ctx) {
            if (process.env.NODE_ENV !== "production") {
              console.error(ctx.error);
            }

            setSignOutBtnState("error");
          },
          onSuccess() {
            setSignOutBtnState("success");
            router.push("/sign-in");
          },
        },
      });
    } catch (error) {
      if (process.env.NODE_ENV !== "production") {
        console.error(error);
      }

      setSignOutBtnState("error");
    } finally {
      setTimeout(() => {
        setSignOutBtnState("idle");
      }, 3000);
    }
  };

  // Fetch usernaes
  const { data: { data: usernames } = {} } = useQuery({
    queryKey: ["usernames"],
    queryFn: () => runParallelAction(getUsernames()),
    refetchInterval: 5000,
  });

  const validUsernames = usernames
    ?.map((user) => user?.username)
    .filter((username): username is string => username !== null);

  const form = useForm<UsernameFormType>({
    resolver: zodResolver(usernameSchema(validUsernames!)),
    defaultValues: {
      username: "",
    },
  });

  const onSubmit = async (values: UsernameFormType) => {
    try {
      setCreateUsernameBtnState("loading");
      const response: ServerActionResponse = await createUsername(values);

      if (response.status === "success") {
        setCreateUsernameBtnState("success");

        setTimeout(() => {
          window.location.href = "/";
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setCreateUsernameBtnState("error");

      setTimeout(() => {
        setCreateUsernameBtnState("idle");
      }, 3000);
    }
  };

  return (
    <div className="flex w-full max-w-md flex-col items-center gap-4 px-2 text-center md:gap-6">
      <h1
        className={cn(
          "text-4xl text-brand-400 md:text-5xl",
          instrumentSerif.className,
        )}
      >
        Create <span className="italic">Username</span>
      </h1>

      <p className="text-sm text-neutral-300">
        {`Enter your unique username. Only letters, numbers and underscores are
          allowed.`}
      </p>

      <section className="mt-4 flex w-full flex-col gap-6">
        <Form {...form}>
          <form
            id="username-form"
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col gap-6"
          >
            {/* Username */}
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="text"
                        disabled={createUsernameBtnState !== "idle"}
                        placeholder="johndoe"
                        value={field.value}
                        onChange={(e) => {
                          const username = e.target.value;

                          field.onChange(username);

                          if (
                            validUsernames?.includes(username?.toLowerCase())
                          ) {
                            form.setError("username", {
                              type: "custom",
                              message: "This username has already been taken",
                            });
                          } else {
                            form.clearErrors();
                          }
                        }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <div className="flex flex-col gap-3">
          <AnimatedButton
            form="username-form"
            disabled={
              createUsernameBtnState !== "idle" || signOutBtnState !== "idle"
            }
            buttonCopy={createUsernameBtnCopy}
            buttonState={createUsernameBtnState}
            setButtonState={setCreateUsernameBtnState}
            size="lg"
            variant="brand"
          />
          <AnimatedButton
            action={handleSignOut}
            disabled={
              createUsernameBtnState !== "idle" || signOutBtnState !== "idle"
            }
            buttonCopy={signOutBtnCopy}
            buttonState={signOutBtnState}
            setButtonState={setSignOutBtnState}
            size="lg"
            variant="secondary"
          />
        </div>
      </section>
    </div>
  );
};

interface AnimatedButtonProps {
  variant: "brand" | "secondary";
  size: "lg" | "xl";
  buttonState: "error" | "idle" | "loading" | "success";
  setButtonState: Dispatch<
    SetStateAction<"error" | "idle" | "loading" | "success">
  >;
  buttonCopy: {
    idle: string;
    loading: JSX.Element;
    success: string;
    error: string;
  };
  action?: () => void;
  disabled?: boolean;
  form?: string;
}

const AnimatedButton = ({
  variant,
  size,
  buttonState,
  setButtonState,
  buttonCopy,
  action,
  disabled,
  form,
}: AnimatedButtonProps) => {
  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  return (
    <Button
      form={form ? form : ""}
      variant={variant}
      size={size}
      disabled={disabled}
      onClick={() => {
        action ? action() : () => {};
      }}
      className={cn("relative w-full max-w-md overflow-hidden")}
    >
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={buttonState}
          transition={{ type: "spring", bounce: 0, duration: 0.3 }}
          initial="initial"
          animate="visible"
          exit="exit"
          variants={variants}
        >
          {buttonCopy[buttonState]}
        </motion.div>
      </AnimatePresence>
    </Button>
  );
};
