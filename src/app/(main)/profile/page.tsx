import { ProfileForm } from "@/features/profiles/components/profile-form";
import { getCurrentUser } from "@/features/profiles/api";
import { redirect } from "next/navigation";
import { format } from "date-fns";

export default async function ProfilePage() {
  const { user, profile } = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-8">
      <div>
        <h1 className="text-xl font-medium">My Profile</h1>
        <h2 className="text-muted-foreground text-sm">
          Manage your profile information
        </h2>
      </div>

      <div className="max-w-2xl">
        <ProfileForm profile={profile} userEmail={user.email || ""} />

        <div className="mt-8 pt-8 border-t space-y-4">
          <div>
            <h3 className="text-sm font-medium mb-2">Account Information</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">User ID:</span> {user.id}
              </div>
              <div>
                <span className="font-medium">Account Created:</span>{" "}
                {format(new Date(user.created_at), "MMM d, yyyy")}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
