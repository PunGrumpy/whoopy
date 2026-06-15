import Link from "next/link";
import { redirect } from "next/navigation";

import { Button } from "@/components/ui/button";
import { getSession } from "@/lib/session";

const ProfilePage = async () => {
  const session = await getSession();
  if (!session) {
    redirect("/");
  }

  const { profile } = session;

  return (
    <>
      <div className="flex items-center justify-between gap-3 p-12 pb-0">
        <h1 className="text-4xl font-medium">Profile</h1>
      </div>
      <div className="max-w-2xl p-12">
        <div className="rounded-3xl border border-border bg-card p-8 shadow-sm">
          <div className="flex items-center gap-4 border-b border-border pb-6">
            <span className="flex size-14 items-center justify-center rounded-full bg-foreground/10 text-xl font-semibold text-foreground">
              {profile.firstName?.[0] || profile.email[0].toUpperCase()}
            </span>
            <div>
              <h2 className="text-xl font-medium">
                {profile.firstName} {profile.lastName}
              </h2>
              <p className="text-sm text-muted-foreground">{profile.email}</p>
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <div className="flex justify-between py-2 text-sm border-b border-border/50">
              <span className="text-muted-foreground">WHOOP User ID</span>
              <span className="font-mono font-medium">{profile.id}</span>
            </div>
            <div className="flex justify-between py-2 text-sm border-b border-border/50">
              <span className="text-muted-foreground">Account Status</span>
              <span className="inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 text-xs font-semibold bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300">
                Connected
              </span>
            </div>
          </div>

          <div className="mt-8 flex justify-end">
            <Button
              nativeButton={false}
              render={<Link href="/api/auth/logout" />}
              className="rounded-full font-medium"
              variant="destructive"
            >
              Disconnect WHOOP Account
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfilePage;
