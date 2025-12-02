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

const registerSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterClient = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const { addShortcut, removeShortcut } = useShortcuts();

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormValues) => {
    setIsLoading(true);
    try {
      const result = await authClient.signUp.email({
        email: data.email,
        password: data.password,
        name: data.name,
      });

      if (result.error) {
        toast({
          title: "Registration failed",
          description: result.error.message || "Failed to create account",
          variant: "error",
        });
      } else if (result.data) {
        toast({
          title: "Success",
          description: "Account created successfully",
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
      id: "cancel-register",
      label: "Home",
      letters: ["ESC"],
      action: () => {
        router.push("/");
      },
    });
    return () => {
      removeShortcut("cancel-register");
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
        topLeft: <span className="text-foreground">Register</span>,
        bottomLeft: (
          <span className="text-muted-foreground">/auth/register</span>
        ),
      }}
    >
      <Box
        style={{
          box: "w-fit h-fit rounded-xs",
          background: "bg-card",
        }}
        text={{
          topCenter: <span className="text-foreground">Register</span>,
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
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          box={{
                            text: {
                              topLeft: "Name",
                            },
                            style: {
                              background: "bg-card",
                            },
                          }}
                          placeholder="Enter your name"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <PasswordInput
                          box={{
                            text: {
                              topLeft: "Confirm Password",
                            },
                            style: {
                              background: "bg-card",
                            },
                          }}
                          placeholder="Confirm your password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Creating account..." : "Register"}
                </Button>
              </form>
            </Form>
            <div className="text-muted-foreground text-center text-sm">
              Already have an account?{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Login
              </Link>
            </div>
          </div>
        </div>
      </Box>
    </Box>
  );
};

export default RegisterClient;
