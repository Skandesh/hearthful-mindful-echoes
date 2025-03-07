
import { useState } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export function useConfirmationDialog() {
  const [isOpen, setIsOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState({
    title: "",
    description: "",
    confirmCallback: () => {}
  });

  const showConfirmation = (
    title: string,
    description: string,
    onConfirm: () => void
  ) => {
    setDialogContent({
      title,
      description,
      confirmCallback: onConfirm
    });
    setIsOpen(true);
  };

  const confirmAction = () => {
    dialogContent.confirmCallback();
    setIsOpen(false);
  };

  const cancelAction = () => {
    setIsOpen(false);
  };

  const ConfirmationDialog = () => (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{dialogContent.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {dialogContent.description}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={cancelAction}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={confirmAction}>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );

  return {
    showConfirmation,
    confirmAction,
    cancelAction,
    ConfirmationDialog
  };
}
