"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

const handleDisconnect = () => {
  window.location.href = "/api/auth/logout";
};

export const DisconnectSection = () => (
  <section className="rounded-lg border bg-card p-6">
    <h2 className="text-lg font-medium">Disconnect</h2>
    <p className="mt-2 text-muted-foreground text-sm">
      Clears your session. You will need to reconnect your WHOOP account to use
      the dashboard again.
    </p>
    <AlertDialog>
      <AlertDialogTrigger
        render={
          <Button
            className="mt-4 rounded-full font-medium"
            variant="destructive"
          />
        }
      >
        Disconnect WHOOP Account
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Disconnect WHOOP account?</AlertDialogTitle>
          <AlertDialogDescription>
            This will sign you out and remove your WHOOP connection from this
            device.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleDisconnect} variant="destructive">
            Disconnect
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  </section>
);
