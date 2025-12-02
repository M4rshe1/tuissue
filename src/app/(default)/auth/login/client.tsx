"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";

import { authClient } from "@/server/better-auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/tui/input";
import { PasswordInput } from "@/components/tui/password-input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "@/components/tui/toaster";
import { Box } from "@/components/tui/box";
import { useShortcuts } from "@/providers/shortcuts-provider";

const loginSchema = z.object({
  email: z.email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginClient = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { addShortcut, removeShortcut } = useShortcuts();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormValues) => {
    setIsLoading(true);
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (result.error) {
        toast({
          title: "Login failed",
          description: result.error.message || "Invalid email or password",
          variant: "error",
        });
      } else if (result.data) {
        toast({
          title: "Success",
          description: "Logged in successfully",
          variant: "success",
        });
        router.push("/");
        router.refresh();
      }
    } catch (error) {
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred",
        variant: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    addShortcut({
      id: "cancel-login",
      label: "Home",
      letters: ["ESC"],
      action: () => {
        router.push("/");
      },
    });
    return () => {
      removeShortcut("cancel-login");
    };
  }, []);

  return (
    <Box
      style={{
        background: "bg-background",
        box: "h-full",
        content: "flex items-center justify-center",
      }}
      text={{
        topLeft: <span className="text-foreground">Login</span>,
        bottomLeft: <span className="text-muted-foreground">/auth/login</span>,
      }}
    >
      <Box
        style={{
          box: "w-fit h-fit rounded-xs",
          background: "bg-card",
        }}
        text={{
          topCenter: <span className="text-foreground">Login</span>,
        }}
      >
        <div className="flex h-full items-center justify-center">
          <div className="w-full max-w-xl space-y-6">
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          box={{
                            text: {
                              topLeft: "Email",
                            },
                            style: {
                              background: "bg-card",
                            },
                          }}
                          className="w-full"
                          type="email"
                          placeholder="Enter your email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PasswordInput
                          box={{
                            text: {
                              topLeft: "Password",
                            },
                            style: {
                              background: "bg-card",
                            },
                          }}
                          placeholder="Enter your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Logging in..." : "Login"}
                </Button>
              </form>
            </Form>
            <div className="text-muted-foreground text-center text-sm">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="text-primary hover:underline"
              >
                Register
              </Link>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default LoginClient;
