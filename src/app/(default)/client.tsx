"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

const Client = () => {
  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={() =>
          toast({
            title: "Hello",
            description: "Hello",
            variant: "success",
            button: {
              label: "Click me",
              onClick: () => {
                console.log("clicked");
              },
            },
          })
        }
      >
        Success
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Hello",
            description: "Hello",
            variant: "default",
            button: {
              label: "Click me",
              onClick: () => {
                console.log("clicked");
              },
            },
          })
        }
      >
        Default
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Hello",
            description: "Hello",
            variant: "error",
            button: {
              label: "Click me",
              onClick: () => {
                console.log("clicked");
              },
            },
          })
        }
      >
        Error
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Hello",
            description: "Hello",
            variant: "warning",
            button: {
              label: "Click me",
              onClick: () => {
                console.log("clicked");
              },
            },
          })
        }
      >
        Warning
      </Button>
      <Button
        onClick={() =>
          toast({
            title: "Hello",
            description: "Hello",
            variant: "info",
            button: {
              label: "Click me",
              onClick: () => {
                console.log("clicked");
              },
            },
          })
        }
      >
        Info
      </Button>
    </div>
  );
};

export default Client;
