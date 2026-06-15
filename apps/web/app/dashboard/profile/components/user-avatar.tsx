"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface UserAvatarProps {
  readonly email: string;
  readonly firstName: string;
  readonly lastName: string;
}

const getInitials = (
  firstName: string,
  lastName: string,
  email: string
): string => {
  if (firstName && lastName) {
    return `${firstName[0]}${lastName[0]}`.toUpperCase();
  }

  if (firstName) {
    return firstName[0].toUpperCase();
  }

  return email[0]?.toUpperCase() ?? "?";
};

export const UserAvatar = ({ email, firstName, lastName }: UserAvatarProps) => {
  const initials = getInitials(firstName, lastName, email);
  const avatarSrc = `https://avatar.vercel.sh/${encodeURIComponent(email)}.svg?text=${encodeURIComponent(initials)}`;

  return (
    <Avatar className="size-14 after:border-0">
      <AvatarImage alt="" src={avatarSrc} />
      <AvatarFallback className="text-lg font-semibold">
        {initials}
      </AvatarFallback>
    </Avatar>
  );
};
