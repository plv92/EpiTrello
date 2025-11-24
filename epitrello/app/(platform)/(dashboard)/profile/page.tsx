import { auth } from "@/lib/auth";
import { ProfileForm } from "./_components/profile-form";
import { cookies } from "next/headers";

const ProfilePage = async () => {
  const authResult = await auth();

  if (!authResult.isValid || !authResult.user) {
    return (
      <div className="w-full mb-20">
        <div className="max-w-2xl mx-auto px-4 py-8">
          <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
            <p className="text-yellow-800">Unable to load user profile. Please try signing in again.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mb-20">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold">Mon Profil</h1>
            <p className="text-muted-foreground mt-2">
              Gérez vos informations personnelles et vos paramètres de compte
            </p>
          </div>
          
          <ProfileForm user={authResult.user} />
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
