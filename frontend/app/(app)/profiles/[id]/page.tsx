import type { Metadata } from "next";
import { ProfileDetailClient } from "./_components/ProfileDetailClient";

export const metadata: Metadata = {
  title: "Profile Detail",
};

export default async function ProfileDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <ProfileDetailClient id={id} />;
}
