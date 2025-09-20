"use client";
import { useAuth } from "@/components/providers/auth-provider";
import { ProfileForm } from "@/components/profile/profile-form";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Page() {
  const { session, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !session) router.replace("/login");
  }, [loading, session]);

  return (
    <div className="container mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold mb-6">Your Profile</h1>
      {session ? <ProfileForm /> : null}
    </div>
  );
}
