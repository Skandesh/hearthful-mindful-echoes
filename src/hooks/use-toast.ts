
import { useToast as useToastHook } from "@/components/ui/use-toast";
import { toast as toastFunction } from "@/components/ui/use-toast";

// Re-export the hooks/functions
export const useToast = useToastHook;
export const toast = toastFunction;
