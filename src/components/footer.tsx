"use client";

import { Box } from "./tui/box";
import { useShortcuts } from "@/providers/shortcuts-provider";
import { Button } from "./ui/button";
import Link from "next/link";

const Footer = () => {
  const { shortcuts, triggerShortcut } = useShortcuts();
  if (shortcuts.length === 0) return null;
  return (
    <div>
      <Box
        text={{
          topLeft: <span className="text-foreground">Shortcuts</span>,
        }}
      >
        <div className="flex w-full justify-between">
          {shortcuts && (
            <div className="text-muted-foreground flex w-full justify-start gap-1">
              {shortcuts.map((shortcut) => {
                let keys: string[] = [];
                if (shortcut.ctrlKey) keys.push("CTRL");
                if (shortcut.shiftKey) keys.push("SHIFT");
                if (shortcut.altKey) keys.push("ALT");
                if (shortcut.metaKey) keys.push("META");
                if (shortcut.escKey) keys.push("ESC");
                keys.push(...shortcut.letters);
                return (
                  <div key={shortcut.label} className="text-sm">
                    <Button
                      size="xs"
                      variant="ghost"
                      onClick={() => triggerShortcut(shortcut.id)}
                    >
                      [{keys.join("+")}]
                    </Button>
                    {shortcut.label}
                  </div>
                );
              })}
            </div>
          )}
          <div className="flex w-full items-center justify-end gap-1 text-sm">
            <Link
              href="https://github.com/M4rshe1/tuissue"
              className="text-primary hover:text-foreground hover:underline"
              target="_blank"
            >
              Github
            </Link>
            <span className="text-muted-foreground">|</span>
            <Link
              href="https://github.com/M4rshe1/tuissue"
              className="text-primary hover:text-foreground hover:underline"
              target="_blank"
            >
              Docs
            </Link>
          </div>
        </div>
      </Box>
    </div>
  );
};

export default Footer;
