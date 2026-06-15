import { UserAvatar } from "./user-avatar";

interface ProfileSectionProps {
  readonly profile: {
    email: string;
    firstName: string;
    lastName: string;
  };
}

export const ProfileSection = ({ profile }: ProfileSectionProps) => (
  <section className="rounded-lg border bg-card p-6">
    <h2 className="text-lg font-medium">Profile</h2>
    <div className="mt-4 flex items-center gap-4">
      <UserAvatar
        email={profile.email}
        firstName={profile.firstName}
        lastName={profile.lastName}
      />
      <div>
        <p className="text-xl font-medium">
          {profile.firstName} {profile.lastName}
        </p>
        <p className="text-sm text-muted-foreground">{profile.email}</p>
      </div>
    </div>
  </section>
);
