import type { Session } from "@/server/better-auth/config";
import type { z } from "zod";
import { tryCatch } from "./try-catch";
import { getSession } from "@/lib/session";

export type WithAuthProps = {
  session?: Session;
  params?: Record<string, any>;
};

type ActionFunction<S extends z.ZodType<any, any>, T> = (args: {
  data: z.infer<S>;
}) => Promise<T>;
type ActionAuthFunction<S extends z.ZodType<any, any>, T> = (args: {
  data: z.infer<S>;
  session: Session;
}) => Promise<T>;

type ActionInput = FormData | Record<string, any>;

export async function action<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ActionFunction<S, T>,
) {
  return async (input: ActionInput) => {
    const result = schema.safeParse(input);
    if (!result.success) {
      return {
        error: {
          code: "VALIDATION_ERROR",
          message: "Validierungsfehler",
          details: result.error,
        },
        data: undefined,
      };
    }
    const { data, error } = await tryCatch(action({ data: result.data }));
    if (error) {
      return {
        data: undefined,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Interner Serverfehler",
          details: error.message,
        },
      };
    }
    return {
      data,
      error: undefined,
    };
  };
}
export async function actionAuth<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ActionAuthFunction<S, T>,
) {
  return async (input: ActionInput) => {
    const session = await getSession();
    const result = schema.safeParse(input);
    if (!result.success) {
      return {
        error: {
          code: "VALIDATION_ERROR",
          message: "Validierungsfehler",
          details: result.error.message,
        },
        data: undefined,
      };
    }

    if (!session) {
      return {
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized",
          details: "Sie sind nicht berechtigt, diese Ressource zu nutzen.",
        },
        data: undefined,
      };
    }

    const { data, error } = await tryCatch(
      action({
        data: result.data,
        session: session as Session,
      }),
    );
    if (error) {
      return {
        data: undefined,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Interner Serverfehler",
          details: error.message,
        },
      };
    }
    return {
      data,
      error: undefined,
    };
  };
}

export async function actionAdmin<S extends z.ZodType<any, any>, T>(
  schema: S,
  action: ActionAuthFunction<S, T>,
) {
  return async (input: ActionInput) => {
    const session = await getSession();
    const result = schema.safeParse(input);
    if (!result.success) {
      return {
        data: undefined,
        error: {
          code: "VALIDATION_ERROR",
          message: "Validierungsfehler",
          details: result.error.message,
        },
      };
    }

    if (!session || (session as Session).user.role !== "admin") {
      return {
        data: undefined,
        error: {
          code: "UNAUTHORIZED",
          message: "Unauthorized",
          details: "Sie sind nicht berechtigt, diese Ressource zu nutzen.",
        },
      };
    }

    const { data, error } = await tryCatch(
      action({
        data: result.data,
        session: session as Session,
      }),
    );
    if (error) {
      return {
        data: undefined,
        error: {
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          details: error.message,
        },
      };
    }
    return {
      data,
      error: undefined,
    };
  };
}
