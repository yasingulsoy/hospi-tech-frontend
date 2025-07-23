import DbUploadForm from "../../components/DbUploadForm";

export default function DbUploadPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h2 className="text-xl font-bold mb-4">Veritabanı Yükle veya Bağlan</h2>
        <DbUploadForm />
      </div>
    </div>
  );
} 