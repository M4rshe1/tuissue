"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toaster";

const Client = () => {
  return (
    <div>
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
        Click me
      </Button>
    </div>
  );
};

export default Client;
