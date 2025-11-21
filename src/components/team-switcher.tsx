"use client";

import * as React from "react";
import { ChevronDown, DoorOpen, LogOut, Plus, User } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { COLORS, OPACITY, sortTeams } from "@/lib/team";
import { authClient } from "@/lib/auth-client";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import { useCreateTeamMutation, useUserTeamsQuery } from "@/queries/team";
import Link from "next/link";
import { createTeamDialogConfig } from "@/dialogs/create-team";
import type { FormDialogConfig } from "./form-dialog";
import { useFormDialog } from "@/providers/form-dialog-provider";
import { useJoinTeamWithInvitationMutation } from "@/queries/team-invitation";
import { acceptInvitationDialogConfig } from "@/dialogs/accept-invitation";
import { Button } from "./ui/button";
import { useSessionQuery } from "@/queries/session";
import { toast } from "sonner";
import { revalidateAny } from "@/lib/get-query-client";

const MAX_TEAMS = 3;

export function TeamSwitcher() {
  const { data: teams, isLoading } = useUserTeamsQuery();
  const {
    mutate: joinTeamWithInvitation,
    isPending: isJoiningTeamWithInvitation,
  } = useJoinTeamWithInvitationMutation();
  const { data: session, isPending } = useSessionQuery();
  const { openDialog } = useFormDialog();
  const {
    mutate: createTeam,
    data: createdTeam,
    isSuccess: isCreatedTeamSuccess,
  } = useCreateTeamMutation();
  const router = useRouter();

  const handleCreateTeam = async () => {
    const result = await openDialog(createTeamDialogConfig as FormDialogConfig);
    if (result.success && result.data) {
      createTeam({ name: result.data.name, color: result.data.color });
      if (isCreatedTeamSuccess && createdTeam) {
        router.push(`/teams/${createdTeam.id}`);
      }
    }
  };

  const handleJoinTeamWithInvitation = async () => {
    const result = await openDialog(
      acceptInvitationDialogConfig as FormDialogConfig,
    );
    if (result.success) {
      joinTeamWithInvitation(result.data.token);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={isLoading}>
        <Button
          variant="ghost"
          className="group m-2 flex h-12 w-fit cursor-pointer items-center justify-center gap-2 p-2"
        >
          {isPending ? (
            <div className="flex animate-pulse items-center gap-3">
              <Skeleton className="size-10 rounded-full" />
              <div className="flex flex-col gap-2">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-3 w-16 rounded" />
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Avatar className="size-10 rounded-full border-2 shadow-sm transition-all group-hover:shadow-md">
                <AvatarImage src={session?.user.image ?? undefined} />
                <AvatarFallback className="from-primary/20 to-primary/10 g-linear-to-br text-lg font-semibold">
                  {(session?.user.firstName?.[0] ?? "") +
                    (session?.user.lastName?.[0] ?? "")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start">
                <span className="text-sm font-semibold">
                  {session?.user.firstName} {session?.user.lastName}
                </span>
                <span className="text-muted-foreground text-xs">
                  {session?.user.email}
                </span>
              </div>
              <ChevronDown className="text-muted-foreground ml-2 size-4 transition-transform group-hover:translate-y-0.5" />
            </div>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-64 rounded-lg p-1.5 shadow-lg"
        align="start"
        side="bottom"
        sideOffset={4}
      >
        <DropdownMenuLabel className="text-muted-foreground flex items-center gap-2 px-2 py-1 text-xs font-semibold tracking-wider uppercase">
          KONTO{" "}
          <Link
            href="/account"
            className="text-primary ml-auto text-xs hover:underline"
          >
            Einstellungen
          </Link>
        </DropdownMenuLabel>
        <DropdownMenuGroup className="grid grid-cols-2 gap-1">
          <DropdownMenuItem
            onClick={() => {
              router.push(`/user/profile/${session?.user.id}`);
            }}
            className="group hover:bg-accent cursor-pointer gap-2 rounded-md p-2 transition-all"
          >
            <div className="bg-primary flex size-8 items-center justify-center rounded-md shadow-sm transition-all group-hover:scale-105">
              <User className="text-primary-foreground size-4" />
            </div>
            <div className="text-sm font-semibold">Profil</div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={async () => {
              const signoutResult = await authClient.signOut();
              if (signoutResult.error) {
                toast.error(signoutResult.error.message);
                return;
              }
              revalidateAny("any");
              router.push("/auth/login");
            }}
            className="group hover:bg-destructive cursor-pointer gap-2 rounded-md p-2 transition-all"
          >
            <div className="bg-destructive flex size-8 items-center justify-center rounded-md shadow-sm transition-all group-hover:scale-105">
              <LogOut className="text-destructive-foreground size-4" />
            </div>
            <div className="text-sm font-semibold">Logout</div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuLabel className="text-muted-foreground flex items-center gap-2 px-2 py-1 text-xs font-semibold tracking-wider uppercase">
          Teams{" "}
          <Link
            href="/teams"
            className="text-primary ml-auto text-xs hover:underline"
          >
            Alle Teams
          </Link>
        </DropdownMenuLabel>
        <div className="my-1 space-y-0.5">
          {session?.user.id &&
            teams &&
            teams
              ?.sort((a, b) => sortTeams(a, b, session?.user.id ?? ""))
              .slice(0, MAX_TEAMS)
              .map((team) => (
                <DropdownMenuItem
                  key={team.id}
                  onClick={() => router.push(`/teams/${team.id}`)}
                  className="group hover:bg-accent/50 cursor-pointer gap-2 rounded-md p-2 transition-all"
                >
                  <div
                    className="flex size-8 shrink-0 items-center justify-center rounded-md border shadow-sm transition-all group-hover:scale-105"
                    style={{
                      backgroundColor: COLORS?.[team.color] + OPACITY[20],
                      borderColor: COLORS?.[team.color] + OPACITY[30],
                    }}
                  >
                    <span
                      className="text-sm font-bold"
                      style={{ color: COLORS?.[team.color] + OPACITY[70] }}
                    >
                      {team.name.slice(0, 2).toLocaleUpperCase()}
                    </span>
                  </div>
                  <div className="flex min-w-0 flex-1 flex-col">
                    <span
                      className="text-foreground truncate text-sm font-semibold"
                      title={team.name}
                    >
                      {team.name}
                    </span>
                    <span className="text-muted-foreground text-xs">
                      {team.teamMembers.length}{" "}
                      {team.teamMembers.length === 1
                        ? "Mitglied"
                        : "Mitglieder"}
                    </span>
                  </div>
                </DropdownMenuItem>
              ))}
          {teams && teams.length > MAX_TEAMS && (
            <Link
              href="/teams"
              className="text-primary ml-2 text-xs hover:underline"
            >
              +{teams.length - MAX_TEAMS} weitere Teams
            </Link>
          )}
        </div>
        <DropdownMenuSeparator className="my-1" />
        <DropdownMenuGroup className="grid grid-cols-2 gap-1">
          <DropdownMenuItem
            onClick={handleCreateTeam}
            className="group hover:bg-primary/10 cursor-pointer gap-2 rounded-md p-2 transition-all"
          >
            <div className="bg-primary flex size-8 items-center justify-center rounded-md shadow-sm transition-all group-hover:scale-105">
              <Plus className="text-primary-foreground size-4" />
            </div>
            <div className="text-foreground text-sm font-semibold">
              Erstellen
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={handleJoinTeamWithInvitation}
            disabled={isJoiningTeamWithInvitation}
            className="group hover:bg-accent cursor-pointer gap-2 rounded-md p-2 transition-all disabled:cursor-not-allowed disabled:opacity-50"
          >
            <div className="bg-accent flex size-8 items-center justify-center rounded-md shadow-sm transition-all group-hover:scale-105">
              <DoorOpen className="text-accent-foreground size-4" />
            </div>
            <div className="text-foreground text-sm font-semibold">
              Beitreten
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
