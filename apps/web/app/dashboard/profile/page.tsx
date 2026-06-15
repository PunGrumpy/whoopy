import { getSession } from "@/lib/session";

import { ConnectionSection } from "./components/connection-section";
import { DisconnectSection } from "./components/disconnect-section";
import { ProfileSection } from "./components/profile-section";

const ProfilePage = async () => {
  const session = await getSession();
  if (!session) {
    return null;
  }

  const { profile } = session;

  return (
    <>
      <div className="flex items-center justify-between gap-3 p-12 pb-0">
        <h1 className="text-4xl font-medium">Profile</h1>
      </div>
      <div className="flex flex-col gap-6 p-12">
        <ProfileSection profile={profile} />
        <ConnectionSection userId={profile.id} />
        <DisconnectSection />
      </div>
    </>
  );
};

export default ProfilePage;
