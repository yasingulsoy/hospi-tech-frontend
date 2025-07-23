import ProfileCard from "../../components/ProfileCard";

export default function ProfilePage() {
  // Mock kullanıcı verisi
  const user = {
    name: "Yasin Demir",
    email: "yasin@ornek.com",
    role: "admin" as const,
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] animate-fade-in">
      <ProfileCard name={user.name} email={user.email} role={user.role} />
    </div>
  );
} 