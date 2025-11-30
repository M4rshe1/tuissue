import {
  getGlobalSettingAction,
  getGlobalSettingsAction,
} from "@/actions/setting";
import { useQuery } from "@tanstack/react-query";
import { toast } from "@/components/tui/toaster";

export const useGlobalSetting = (key: string) => {
  return useQuery({
    queryKey: ["global-setting", key],
    queryFn: async () => {
      const { data, error } = await getGlobalSettingAction({ key });
      if (error) {
        toast({
          variant: "error",
          title: error.message,
          description: error.details,
        });
        return null;
      }
      return data;
    },
    enabled: !!key,
  });
};

export const useGlobalSettings = (keys: string[]) => {
  return useQuery({
    queryKey: ["global-settings", keys],
    queryFn: async () => {
      const { data, error } = await getGlobalSettingsAction({ keys });
      if (error) {
        toast({
          variant: "error",
          title: error.message,
          description: error.details,
        });
        return null;
      }
      return data;
    },
    enabled: keys.length > 0,
  });
};
