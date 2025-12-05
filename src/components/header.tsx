"use client";

import Link from "next/link";
import { Box } from "./tui/box";
import { authClient } from "@/server/better-auth/client";
import { useGlobalSettings } from "@/queries/setting";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/tui/popover";
import { Search } from "./search";
import { revalidateAny } from "@/lib/get-query-client";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useShortcuts } from "@/providers/shortcuts-provider";

const Header = () => {
  const { data: session } = authClient.useSession();
  const { data: allowSignup } = useGlobalSettings(["ALLOW_SIGNUP"]);
  const [searchOpen, setSearchOpen] = useState(false);
  const router = useRouter();
  const { addShortcuts, removeShortcuts } = useShortcuts();

  useEffect(() => {
    if (session) {
      addShortcuts([
        {
          id: "profile",
          label: "Profile",
          letters: ["P"],
          action: () => {
            router.push(`/user/profile/${session.user.id}`);
          },
        },
        {
          id: "search",
          label: "Search",
          ctrlKey: true,
          letters: ["K"],
          action: () => {
            setSearchOpen(true);
          },
        },
      ]);
    } else {
      addShortcuts([
        {
          id: "login",
          label: "Login",
          letters: ["L"],
          action: () => {
            router.push("/auth/login");
          },
        },
        {
          id: "register",
          label: "Register",
          letters: ["R"],
          action: () => {
            router.push("/auth/register");
          },
        },
      ]);
    }
    return () => {
      removeShortcuts(["profile", "login", "register", "search"]);
    };
  }, [session]);
  return (
    <header>
      <Box
        text={{
          topLeft: <span className="text-foreground">Navigation</span>,
        }}
      >
        <div className="grid text-sm md:grid-cols-3">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center hover:underline">
              <span className="font-bold">
                <span className="text-foreground">T</span>
                <span className="text-muted-foreground">u</span>
                <span className="text-foreground">I</span>
                <span className="text-muted-foreground">s</span>
                <span className="text-muted-foreground">s</span>
                <span className="text-muted-foreground">u</span>
                <span className="text-muted-foreground">e</span>
                <span className="text-muted-foreground"></span>
              </span>
              <span className="bg-foreground h-[1em] w-2 animate-pulse"></span>
            </Link>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Link href="/projects" className="text-foreground hover:underline">
              Projects
            </Link>
            <Search open={searchOpen} setOpen={setSearchOpen} />
          </div>
          <div className="flex items-center justify-end">
            {session ? (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="flex items-center gap-2 hover:opacity-80">
                    {session.user.image ? (
                      <img
                        src={session.user.image}
                        alt={session.user.name || "User"}
                        className="h-6 w-6 rounded-full"
                      />
                    ) : (
                      <div className="bg-muted flex h-6 w-6 items-center justify-center rounded-full">
                        <span className="text-foreground text-xs">
                          {session.user.name?.[0]?.toUpperCase() || "U"}
                        </span>
                      </div>
                    )}
                    <span className="text-foreground text-sm">
                      {session.user.name}
                    </span>
                  </button>
                </PopoverTrigger>
                <PopoverContent
                  className="w-fit"
                  boxProps={{
                    text: {
                      topLeft: <span className="text-foreground">Profile</span>,
                    },
                    style: {
                      background: "bg-popover",
                    },
                  }}
                >
                  <div className="flex flex-col gap-3 p-2">
                    <div className="border-border flex items-center gap-3 border-b pb-3">
                      {session.user.image ? (
                        <img
                          src={session.user.image}
                          alt={session.user.name || "User"}
                          className="h-10 w-10 rounded-full"
                        />
                      ) : (
                        <div className="bg-primary flex h-10 w-10 items-center justify-center rounded-full">
                          <span className="text-primary-foreground text-base">
                            {session.user.name?.[0]?.toUpperCase() || "U"}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="text-foreground text-sm font-semibold">
                          {session.user.name}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          {session.user.email}
                        </span>
                      </div>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Link
                        href={`/user/profile/${session.user.id}`}
                        className="flex items-center hover:underline"
                      >
                        <span className="text-foreground text-sm">Profile</span>
                      </Link>
                      <Link
                        href="/account/settings"
                        className="flex items-center hover:underline"
                      >
                        <span className="text-foreground text-sm">
                          Settings
                        </span>
                      </Link>
                      <div
                        role="button"
                        onClick={async () => {
                          const signoutResult = await authClient.signOut();
                          if (signoutResult.error) {
                            toast.error(signoutResult.error.message);
                            return;
                          }
                          revalidateAny("any");
                          router.refresh();
                        }}
                        className="flex cursor-pointer items-center hover:underline"
                      >
                        <span className="text-foreground text-sm">Logout</span>
                      </div>
                    </div>
                  </div>
                </PopoverContent>
              </Popover>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="flex items-center hover:underline"
                >
                  <span className="text-foreground text-sm">Sign in</span>
                </Link>
                {allowSignup && (
                  <>
                    <span className="text-muted-foreground text-sm">/</span>
                    <Link
                      href="/auth/register"
                      className="flex items-center hover:underline"
                    >
                      <span className="text-foreground text-sm">Sign up</span>
                    </Link>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </Box>
    </header>
  );
};

export default Header;
