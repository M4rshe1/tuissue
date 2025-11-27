import { redirect } from "next/navigation";
import type { ComponentType } from "react";
import type { Session } from "@/server/better-auth/config";
import { db } from "@/server/db";
import { ErrorState } from "@/components/error-state";
import { getSession } from "@/lib/session";
import { headers } from "next/headers";
import { PROJECT_VISIBILITY } from "./enums";

export type WithAuthProps = {
  session: Session;
  searchParams: Record<string, string | string[]>;
  params: Record<string, string>;
};

type PageProps = {
  params?: Promise<Record<string, string>>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

export const withOptionalAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  reverse?: boolean,
) => {
  const WithOptionalAuth = async (props: PageProps) => {
    const [params, searchParams, session, headersList] = await Promise.all([
      props.params ?? Promise.resolve({}),
      props.searchParams ?? Promise.resolve({}),
      getSession(),
      headers(),
    ]);

    if (session) {
      await checkPasswordChange(session, headersList);
    }

    return (
      <WrappedComponent
        {...(props as any)}
        session={session}
        params={params || {}}
        searchParams={searchParams || {}}
      />
    );
  };

  return WithOptionalAuth;
};

export const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  reverse?: boolean,
) => {
  const WithAuth = async (props: PageProps) => {
    const [params, searchParams, session, headersList] = await Promise.all([
      props.params ?? Promise.resolve({}),
      props.searchParams ?? Promise.resolve({}),
      getSession(),
      headers(),
    ]);

    if (!session && !reverse) {
      redirect("/auth/login");
    }

    if (session && reverse) {
      redirect("/");
    }

    if (session) {
      await checkPasswordChange(session, headersList);
    }

    return (
      <WrappedComponent
        {...(props as any)}
        session={session}
        params={params || {}}
        searchParams={searchParams || {}}
      />
    );
  };

  return WithAuth;
};

export const withAdmin = <P extends object>(
  WrappedComponent: ComponentType<P>,
) => {
  const WithAdmin = async (props: PageProps) => {
    const [params, searchParams, session, headersList] = await Promise.all([
      props.params ?? Promise.resolve({}),
      props.searchParams ?? Promise.resolve({}),
      getSession(),
      headers(),
    ]);

    if (session) {
      await checkPasswordChange(session, headersList);
    }

    if (!session || session?.user?.role !== "admin") {
      return (
        <ErrorState
          title="Unauthorized"
          description="You do not have access to this page."
        />
      );
    }

    return (
      <WrappedComponent
        {...(props as any)}
        session={session}
        params={params || {}}
        searchParams={searchParams || {}}
      />
    );
  };

  return WithAdmin;
};

export const withProject = <P extends object>(
  WrappedComponent: ComponentType<P>,
) => {
  const withProject = async (props: PageProps) => {
    const [params, searchParams, session, headersList] = await Promise.all([
      props.params ?? Promise.resolve({} as Record<string, string>),
      props.searchParams ??
        Promise.resolve({} as Record<string, string | string[]>),
      getSession(),
      headers(),
    ]);

    if (session) {
      await checkPasswordChange(session, headersList);
    }

    const [project, userProject] = await Promise.all([
      db.project.findUnique({
        where: {
          id: params.projectId,
        },
      }),
      db.userProject.findFirst({
        where: {
          projectId: params.projectId,
          userId: session?.user?.id,
        },
      }),
    ]);

    if (!project) {
      return (
        <ErrorState
          title="Project not found"
          description="The project you are trying to access does not exist."
        />
      );
    }

    if (
      project.visibility === PROJECT_VISIBILITY.PRIVATE &&
      !session?.user?.id
    ) {
      redirect("/auth/login?redirect=/projects/" + project.id);
    }
    if (
      project.visibility === PROJECT_VISIBILITY.PRIVATE &&
      session?.user?.id &&
      !userProject
    ) {
      redirect("/auth/login?redirect=/projects/" + project.id);
    }

    if (
      [PROJECT_VISIBILITY.SEMI_PUBLIC, PROJECT_VISIBILITY.PROTECTED].includes(
        project.visibility as any,
      ) &&
      !session?.user?.id
    ) {
      redirect("/auth/login?redirect=/projects/" + project.id);
    }

    return (
      <WrappedComponent
        {...(props as any)}
        session={session}
        params={params || {}}
        searchParams={searchParams || {}}
      />
    );
  };

  return withProject;
};

async function checkPasswordChange(session: Session, headersList: Headers) {
  if (session && session.user?.mustChangePassword) {
    const pathname =
      headersList.get("x-pathname") || headersList.get("referer") || "";
    if (!pathname.includes("/auth/change-password")) {
      redirect("/auth/change-password");
    }
  }
}
