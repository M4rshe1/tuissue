"use client";

import Link from "next/link";
import { Box } from "./tui/box";
import { authClient } from "@/server/better-auth/client";
import { useGlobalSettings } from "@/queries/setting";
import { Popover, PopoverTrigger } from "@/components/ui/popover";
import { PopoverContent } from "@/components/tui/popover";
import { Search } from "./search";

const Header = () => {
  const { data: session } = authClient.useSession();
  const { data: allowSignup } = useGlobalSettings(["ALLOW_SIGNUP"]);
  return (
    <header>
      <Box
        text={{
          topLeft: <span className="text-foreground">Navigation</span>,
        }}
      >
        <div className="grid text-sm md:grid-cols-3">
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
          <div className="flex items-center justify-end">
            <Search />
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
                      topLeft: <span className="text-foreground">User</span>,
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
                        <div className="bg-muted flex h-10 w-10 items-center justify-center rounded-full">
                          <span className="text-foreground text-base">
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
                      <Link
                        href="/auth/logout"
                        className="flex items-center hover:underline"
                      >
                        <span className="text-foreground text-sm">Logout</span>
                      </Link>
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
