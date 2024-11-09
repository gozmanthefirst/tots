"use client";

// External Imports
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

// Local Imports
import { Button } from "@/shared/components/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/shared/components/form";
import { Input } from "@/shared/components/input";
import { cn } from "@/shared/lib/utils/cn";
import { instrument } from "@/styles/fonts";
import { usernameSchema } from "../schemas/zod-schema";

type UsernameFormType = z.infer<ReturnType<typeof usernameSchema>>;

export const CreateUsernameForm = () => {
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
          instrument.className,
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
              <Button className="" size={"lg"} variant={"secondary"}>
                Back to sign in
              </Button>
            </div>
          </form>
        </Form>
      </section>
    </div>
  );
};
