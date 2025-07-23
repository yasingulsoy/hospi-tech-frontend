import ConnectionManager from "../../components/ConnectionManager";

export default function ConnectionsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto py-8">
        <ConnectionManager />
      </div>
    </div>
  );
} 