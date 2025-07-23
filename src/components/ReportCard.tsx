import { StarIcon } from "@heroicons/react/24/solid";

export default function ReportCard({
  title,
  description,
  date,
  favorite,
  onToggleFavorite,
}: {
  title: string;
  description: string;
  date: string;
  favorite: boolean;
  onToggleFavorite: () => void;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6 border border-blue-100 flex flex-col gap-2 hover:shadow-xl transition-shadow animate-fade-in">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-bold text-blue-700 text-lg truncate" title={title}>{title}</h4>
        <button
          onClick={onToggleFavorite}
          className={`p-1 rounded-full ${favorite ? 'bg-yellow-100' : 'bg-gray-100'} transition-colors`}
          aria-label="Favori yap"
        >
          <StarIcon className={`w-6 h-6 ${favorite ? 'text-yellow-400' : 'text-gray-300'}`} />
        </button>
      </div>
      <div className="text-gray-900 text-sm line-clamp-2">{description}</div>
      <div className="text-xs text-gray-400 mt-2">{date}</div>
    </div>
  );
} 