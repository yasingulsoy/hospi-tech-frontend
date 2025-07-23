import { useState, useRef } from "react";
import { MicrophoneIcon, PaperAirplaneIcon, SparklesIcon } from "@heroicons/react/24/outline";

const examplePrompts = [
  "Son 6 ayda en çok kazandıran tedavi nedir?",
  "Bu ayki toplam gelir nedir?",
  "En çok uygulanan tedavi türleri hangileri?",
  "Geçen yılın hasta sayısı nedir?",
  "Tedavi bazında gelir dağılımı?",
];

export default function QueryInput({ onSubmit }: { onSubmit: (query: string) => void }) {
  const [query, setQuery] = useState("");
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  // Sesli komut başlat/durdur
  const handleVoice = () => {
    if (!('webkitSpeechRecognition' in window || 'SpeechRecognition' in window)) {
      alert("Tarayıcınız sesli komut desteklemiyor.");
      return;
    }
    if (listening) {
      recognitionRef.current?.stop();
      setListening(false);
      return;
    }
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = "tr-TR";
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.onresult = (event: any) => {
      setQuery(event.results[0][0].transcript);
      setListening(false);
    };
    recognition.onend = () => setListening(false);
    recognition.onerror = () => setListening(false);
    recognition.start();
    recognitionRef.current = recognition;
    setListening(true);
  };

  // Sorgu gönder
  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (query.trim()) onSubmit(query.trim());
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl md:rounded-2xl shadow-xl p-4 md:p-6 lg:p-10 border border-blue-100 animate-fade-in mx-4">
      <form onSubmit={handleSubmit} className="flex flex-col gap-3 md:gap-4">
        <label className="font-semibold text-gray-900 text-base md:text-lg flex items-center gap-2">
          <SparklesIcon className="w-5 h-5 md:w-6 md:h-6 text-blue-400" /> Doğal Dil Sorgu
        </label>
        <div className="flex gap-2 items-center">
          <input
            type="text"
            className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500 px-3 md:px-4 py-2 md:py-3 text-sm md:text-base shadow-sm text-gray-900 placeholder-gray-500"
            placeholder="Örn: Son 6 ayda en çok kazandıran tedavi nedir?"
            value={query}
            onChange={e => setQuery(e.target.value)}
            autoFocus
          />
          <button
            type="button"
            onClick={handleVoice}
            className={`p-2 rounded-full border transition-colors ${listening ? 'bg-blue-100 border-blue-400' : 'bg-gray-100 border-gray-300 hover:bg-blue-50'}`}
            aria-label="Sesli komut"
          >
            <MicrophoneIcon className={`w-5 h-5 md:w-6 md:h-6 ${listening ? 'text-blue-600 animate-pulse' : 'text-gray-500'}`} />
          </button>
          <button
            type="submit"
            className="p-2 rounded-full bg-blue-600 hover:bg-blue-700 transition-colors text-white shadow-md"
            aria-label="Sorguyu Gönder"
          >
            <PaperAirplaneIcon className="w-5 h-5 md:w-6 md:h-6 rotate-90" />
          </button>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          {examplePrompts.map((ex, i) => (
            <button
              key={i}
              type="button"
              className="bg-blue-50 hover:bg-blue-100 text-blue-700 px-2 md:px-3 py-1 rounded-full text-xs md:text-sm border border-blue-100 transition-colors"
              onClick={() => setQuery(ex)}
            >
              {ex}
            </button>
          ))}
        </div>
      </form>
    </div>
  );
} 