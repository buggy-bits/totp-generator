import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../utils/api";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { LoadingSpinner } from "./LoadingSpinner";
import { Plus, Edit, X } from "lucide-react";

interface EntryFormProps {
  mode: "create" | "edit";
  initialData?: {
    id: string;
    issuer: string;
  };
  onSuccess?: () => void;
  onCancel?: () => void;
}

export function EntryForm({
  mode,
  initialData,
  onSuccess,
  onCancel,
}: EntryFormProps) {
  const [issuer, setIssuer] = useState(initialData?.issuer || "");
  const [secretCode, setSecretCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { addEntry, updateEntry } = useLocalStorage();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!issuer.trim()) {
      setError("Issuer is required");
      return;
    }

    if (mode === "create" && !secretCode.trim()) {
      setError("Secret code is required");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      if (mode === "create") {
        const response = await api.createTOTP({
          issuer: issuer.trim(),
          secretCode: secretCode.trim(),
        });

        if (response.status != "success") {
          return setError(response.status);
        }
        // Save to localStorage
        addEntry({
          id: response.data.id,
          issuer: issuer.trim(),
          createdAt: Date.now(),
        });

        navigate(`/otp?id=${response.data.id}`);
      } else if (mode === "edit" && initialData) {
        await api.updateTOTP({
          id: initialData.id,
          issuer: issuer.trim(),
          ...(secretCode.trim() && { secretCode: secretCode.trim() }),
        });

        // Update localStorage
        updateEntry(initialData.id, issuer.trim());

        if (onSuccess) onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const isCreateMode = mode === "create";

  return (
    <div className="bg-slate-800 rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-mono text-white flex items-center space-x-2">
          {isCreateMode ? (
            <Plus className="w-5 h-5" />
          ) : (
            <Edit className="w-5 h-5" />
          )}
          <span>{isCreateMode ? "Add New Entry" : "Edit Entry"}</span>
        </h2>
        {!isCreateMode && onCancel && (
          <button
            onClick={onCancel}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="issuer"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Issuer / Service Name
          </label>
          <input
            type="text"
            id="issuer"
            value={issuer}
            onChange={(e) => setIssuer(e.target.value)}
            placeholder="e.g., Google, GitHub, AWS"
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
        </div>

        <div>
          <label
            htmlFor="secretCode"
            className="block text-sm font-medium text-slate-300 mb-2"
          >
            Secret Code {!isCreateMode && "(leave empty to keep current)"}
          </label>
          <input
            type="text"
            id="secretCode"
            value={secretCode}
            onChange={(e) => setSecretCode(e.target.value)}
            placeholder={
              isCreateMode
                ? "Enter your TOTP secret key"
                : "Enter new secret key (optional)"
            }
            className="w-full bg-slate-700 border border-slate-600 rounded-lg px-4 py-2 text-white font-mono placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={isLoading}
          />
          <p className="text-xs text-slate-400 mt-1">
            The secret key provided by your service (usually when setting up
            2FA)
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 rounded-lg p-3">
            <p className="text-red-400 text-sm">{error}</p>
          </div>
        )}

        <div className="flex space-x-3 pt-2">
          <button
            type="submit"
            disabled={isLoading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg font-mono text-sm transition-colors flex items-center justify-center space-x-2"
          >
            {isLoading ? (
              <LoadingSpinner size="sm" />
            ) : (
              <>
                {isCreateMode ? (
                  <Plus className="w-4 h-4" />
                ) : (
                  <Edit className="w-4 h-4" />
                )}
                <span>{isCreateMode ? "Create Entry" : "Update Entry"}</span>
              </>
            )}
          </button>

          {isCreateMode && (
            <button
              type="button"
              onClick={() => navigate("/")}
              disabled={isLoading}
              className="px-4 py-2 border border-slate-600 text-slate-300 hover:text-white hover:border-slate-500 rounded-lg font-mono text-sm transition-colors"
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
}
