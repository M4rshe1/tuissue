import { redirect } from "next/navigation";
import type { ComponentType } from "react";
import type { Session } from "~/lib/auth";
import { db } from "./db";
import { ErrorState } from "~/components/error-state";
import { getSession } from "@/lib/session";
import { headers } from "next/headers";

export type WithAuthProps = {
  session: Session;
  searchParams: Record<string, string | string[]>;
  params: Record<string, string>;
};

type PageProps = {
  params?: Promise<Record<string, string>>;
  searchParams?: Promise<Record<string, string | string[]>>;
};

export const withAuth = <P extends object>(
  WrappedComponent: ComponentType<P>,
  reverse?: boolean,
) => {
  const WithAuth = async (props: PageProps) => {
    const [params, searchParams, session] = await Promise.all([
      props.params ?? Promise.resolve({}),
      props.searchParams ?? Promise.resolve({}),
      getSession(),
    ]);

    if (!session && !reverse) {
      redirect("/auth/login");
    }

    if (session && reverse) {
      redirect("/");
    }

    // Redirect to password change page if mustChangePassword is true
    // (except if already on the password change page)
    if (session && session.user.mustChangePassword) {
      const headersList = await headers();
      const pathname = headersList.get("x-pathname") || headersList.get("referer") || "";
      if (!pathname.includes("/auth/change-password")) {
        redirect("/auth/change-password");
      }
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
    const [params, searchParams, session] = await Promise.all([
      props.params ?? Promise.resolve({}),
      props.searchParams ?? Promise.resolve({}),
      getSession(),
    ]);

    if (!session || session?.user.role !== "admin") {
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

export const withPermissions = <P extends object>(
  WrappedComponent: ComponentType<P>,
  permission: "TEAM" | "CHILD" | "TEST",
  access: "READ" | "WRITE" | "ADMIN",
) => {
  const WithPermissions = async (props: PageProps) => {
    const [params, searchParams, session] = await Promise.all([
      props.params ?? Promise.resolve({} as Record<string, string>),
      props.searchParams ??
        Promise.resolve({} as Record<string, string | string[]>),
      getSession(),
    ]);

    if (!session) {
      return (
        <ErrorState
          title="Unauthorized"
          description="You must be signed in to view this page."
          details="You must be signed in to view this page."
        />
      );
    }

    if (permission === "TEAM" && session.user.role !== "admin") {
      if (!params?.teamId) {
        return (
          <ErrorState
            title="Bad request"
            description="Team ID is required to access this page."
            details="Team ID is required to access this page."
          />
        );
      }
      const team = await db.team.findFirst({
        where: {
          id: params?.teamId as string,
          teamMembers: {
            some: {
              userId: session.user.id,
              OR: [
                { role: { in: ["OWNER", "ADMIN", "MEMBER"] } },
                {
                  role: "RESTRICTED",
                },
              ],
            },
          },
        },
      });
      if (!team) {
        return (
          <ErrorState
            title="Forbidden"
            description="You don't have permission to access this team."
            details="You don't have permission to access this team."
          />
        );
      }
    }
    if (permission === "CHILD" && session.user.role !== "admin") {
      if (!params?.childId) {
        return (
          <ErrorState
            title="Bad request"
            description="Child ID is required to access this page."
            details="Child ID is required to access this page."
          />
        );
      }
      const child = await db.child.findFirst({
        where: {
          id: params?.childId as string,
          team: {
            teamMembers: {
              some: {
                userId: session.user.id,
                OR: [
                  { role: { in: ["OWNER", "ADMIN", "MEMBER"] } },
                  {
                    role: "RESTRICTED",
                    teamMemberAccess: {
                      some: {
                        accessType: "CHILD",
                        childId: params?.childId as string,
                      },
                    },
                  },
                  {
                    role: "RESTRICTED",
                    teamMemberAccess: {
                      some: {
                        accessType: "TEST",
                        testId: params?.testId as string,
                      },
                    },
                  },
                ],
              },
            },
          },
        },
      });
      if (!child) {
        return (
          <ErrorState
            title="Forbidden"
            description="You don't have permission to access this child."
            details="You don't have permission to access this child."
          />
        );
      }
    }
    if (permission === "TEST" && session.user.role !== "admin") {
      if (!params?.testId) {
        return (
          <ErrorState
            title="Bad request"
            description="Test ID is required to access this page."
            details="Test ID is required to access this page."
          />
        );
      }
      const test = await db.test.findFirst({
        where: {
          id: params?.testId as string,
          child: {
            team: {
              teamMembers: {
                some: {
                  userId: session.user.id,
                  OR: [
                    { role: { in: ["OWNER", "ADMIN", "MEMBER"] } },
                    {
                      role: "RESTRICTED",
                      teamMemberAccess: {
                        some: {
                          accessType: "TEST",
                          testId: params?.testId as string,
                        },
                      },
                    },
                    {
                      role: "RESTRICTED",
                      teamMemberAccess: {
                        some: {
                          accessType: "CHILD",
                          childId: params?.childId as string,
                        },
                      },
                    },
                  ],
                },
              },
            },
          },
        },
      });
      if (!test) {
        return (
          <ErrorState
            title="Forbidden"
            description="You don't have permission to access this test."
            details="You don't have permission to access this test."
          />
        );
      }
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

  return WithPermissions;
};
