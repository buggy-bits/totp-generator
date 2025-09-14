import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api, TOTPEntry } from "../utils/api";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LoadingSpinner } from "./LoadingSpinner";
import { Trash2, ExternalLink } from "lucide-react";
import { localStorage } from "../utils/localStorage";
interface EntryListProps {
  hasAddButton?: boolean;
}

export function EntryList({ hasAddButton = true }: EntryListProps) {
  const [entries, setEntries] = useState<TOTPEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const currentId = searchParams.get("id");
  const { removeEntry } = useLocalStorage();

  const fetchEntries = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // const data = await api.listEntries();
      const data = localStorage.getEntries();
      setEntries(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load entries");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchEntries();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this entry?")) return;

    try {
      await api.deleteTOTP(id);
      removeEntry(id);
      setEntries(entries.filter((entry) => entry.id !== id));

      // If we're viewing the deleted entry, redirect to home
      if (currentId === id) {
        navigate("/");
      }
    } catch (err) {
      alert(
        "Failed to delete entry: " +
          (err instanceof Error ? err.message : "Unknown error")
      );
    }
  };

  const handleEntryClick = (id: string) => {
    navigate(`/otp?id=${id}`);
  };

  if (isLoading) {
    return (
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-mono text-white mb-4">Your Entries</h3>
        <div className="flex justify-center">
          <LoadingSpinner />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="text-lg font-mono text-white mb-4">Your Entries</h3>
        <div className="text-red-400 text-sm">
          <p>Error: {error}</p>
          <button
            onClick={fetchEntries}
            className="mt-2 text-blue-400 hover:text-blue-300 transition-colors"
          >
            Try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="text-lg font-mono text-white mb-4">Your Entries</h3>

      {entries.length === 0 ? (
        <p className="text-slate-400 text-sm">
          No entries yet. Create your first one!
        </p>
      ) : (
        <div className="space-y-2">
          {entries.map((entry) => (
            <div
              key={entry.id}
              className={`p-3 rounded-lg border transition-all ${
                currentId === entry.id
                  ? "bg-blue-600/20 border-blue-500"
                  : "bg-slate-700 border-slate-600 hover:bg-slate-600"
              }`}
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleEntryClick(entry.id)}
                  className="flex-1 text-left"
                >
                  <div className="text-white font-mono text-sm font-medium">
                    {entry.issuer}
                  </div>
                  {/* <div className="text-slate-400 text-xs font-mono mt-1">
                    {entry.id}
                  </div> */}
                </button>
                <div className="flex items-center space-x-1 ml-2">
                  {currentId !== entry.id && (
                    <button
                      onClick={() => handleEntryClick(entry.id)}
                      className="p-1 text-slate-400 hover:text-white transition-colors"
                      title="View OTP"
                    >
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDelete(entry.id)}
                    className="p-1 text-slate-400 hover:text-red-400 transition-colors"
                    title="Delete entry"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {hasAddButton && (
        <button
          onClick={() => navigate("/")}
          className="w-full mt-4 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg text-sm font-mono transition-colors"
        >
          Add New Entry
        </button>
      )}
    </div>
  );
}
