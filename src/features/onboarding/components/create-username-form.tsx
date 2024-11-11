"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Local Imports
import { signOut } from "@/features/auth/server/sign-out";
import { Button } from "@/shared/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/form";
import { Input } from "@/shared/components/input";
import { Spinner } from "@/shared/components/spinner";
import { cn } from "@/shared/lib/utils/cn";
import { instrument } from "@/styles/fonts";
import { AnimatePresence, motion } from "framer-motion";
import { usernameSchema } from "../schemas/zod-schema";

const createUsernameBtnCopy = {
  idle: "Create Username",
  loading: <Spinner color="#0F0F0F" />,
  success: "Username created!",
  error: "Something went wrong",
};
const signOutBtnCopy = {
  idle: "Back to sign in",
  loading: <Spinner color="#E5E999" />,
  success: "Sign out successful!",
  error: "Something went wrong",
};

type UsernameFormType = z.infer<ReturnType<typeof usernameSchema>>;

export const CreateUsernameForm = () => {
  const router = useRouter();

  const [signOutBtnState, setSignOutBtnState] = useState<
    "idle" | "loading" | "success" | "error"
  >("idle");

  const handleSignOut = async () => {
    try {
      setSignOutBtnState("loading");
      await signOut();

      setSignOutBtnState("success");
    } catch (error) {
      console.log(error);
      setSignOutBtnState("error");

      setTimeout(() => {
        setSignOutBtnState("idle");
      }, 3000);
    }
  };

  const form = useForm<UsernameFormType>({
    resolver: zodResolver(usernameSchema([])),
    defaultValues: {
      username: undefined,
    },
  });

  const onSubmit = (values: UsernameFormType) => {};

  return (
    <div className="flex flex-col gap-4 items-center text-center max-w-md w-full px-2 md:gap-6">
      <h1
        className={cn(
          "text-4xl text-brand-400 md:text-5xl",
          instrument.className
        )}
      >
        Create <span className="italic">Username</span>
      </h1>

      <p className="text-neutral-300 text-sm">
        {`Enter your unique username. Only letters, numbers and underscores are
          allowed.`}
      </p>

      <section className="w-full mt-4">
        <Form {...form}>
          <form
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
                        // disabled={isCreateUsernamePending}
                        placeholder="johndoe"
                        value={field.value}
                        // onChange={(e) => {
                        //   const username = e.target.value;

                        //   field.onChange(username);

                        //   if (validUsernames?.includes(username?.toLowerCase())) {
                        //     form.setError("username", {
                        //       type: "custom",
                        //       message: "This username has already been taken",
                        //     });
                        //   } else {
                        //     form.clearErrors();
                        //   }
                        // }}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex flex-col gap-3">
              <Button className="" size={"lg"}>
                Create Username
              </Button>
              <AnimatedButton
                action={handleSignOut}
                buttonCopy={signOutBtnCopy}
                buttonState={signOutBtnState}
                setButtonState={setSignOutBtnState}
                size="lg"
                variant="secondary"
              />
              {/* <Button className="" size={"lg"} variant={"secondary"}>
                Back to sign in
              </Button> */}
            </div>
          </form>
        </Form>
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
  action: () => void;
}

const AnimatedButton = ({
  variant,
  size,
  buttonState,
  setButtonState,
  buttonCopy,
  action,
}: AnimatedButtonProps) => {
  const variants = {
    initial: { opacity: 0, y: -40 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: 40 },
  };

  return (
    <Button
      variant={variant}
      size={size}
      disabled={buttonState !== "idle"}
      onClick={() => {
        action();
      }}
      className={cn("relative overflow-hidden max-w-md w-full")}
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
