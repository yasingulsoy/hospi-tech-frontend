import { UserCircleIcon, ShieldCheckIcon } from "@heroicons/react/24/solid";

const roleColors: Record<string, string> = {
  admin: "bg-blue-100 text-blue-700",
  viewer: "bg-green-100 text-green-700",
};
const roleLabels: Record<string, string> = {
  admin: "Admin",
  viewer: "İzleyici",
};

export default function ProfileCard({
  name,
  email,
  role,
}: {
  name: string;
  email: string;
  role: "admin" | "viewer";
}) {
  return (
    <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl p-8 border border-blue-100 flex flex-col items-center gap-4 animate-fade-in">
      <div className="relative">
        <UserCircleIcon className="w-24 h-24 text-blue-200" />
        <span className={`absolute bottom-2 right-2 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${roleColors[role]}`}> 
          <ShieldCheckIcon className="w-4 h-4" /> {roleLabels[role]}
        </span>
      </div>
      <div className="text-xl font-bold text-blue-700">{name}</div>
      <div className="text-gray-500">{email}</div>
      <button className="mt-4 w-full bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors">Şifre Değiştir</button>
      <button className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-semibold shadow-sm transition-colors">Çıkış Yap</button>
    </div>
  );
} 