import React, { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { OTPDisplay } from "../components/OTPDisplay";
import { EntryList } from "../components/EntryList";
import { EntryForm } from "../components/EntryForm";
import { useOTP } from "../hooks/useOTP";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { Edit, ArrowLeft } from "lucide-react";

export function OTPPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get("id");
  const [showEditForm, setShowEditForm] = useState(false);
  const { entries } = useLocalStorage();

  const { otp, timeRemaining, isLoading, error, refresh, expires } = useOTP(id);

  if (!id) {
    navigate("/");
    return null;
  }

  const currentEntry = entries.find((entry) => entry.id === id);

  const handleEditSuccess = () => {
    setShowEditForm(false);
    refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate("/")}
            className="flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-mono text-sm">Back to Home</span>
          </button>

          {currentEntry && (
            <div className="flex items-center space-x-4">
              <h1 className="text-2xl font-mono text-white">
                {currentEntry.issuer}
              </h1>
              <button
                onClick={() => setShowEditForm(!showEditForm)}
                className="flex items-center space-x-2 bg-slate-700 hover:bg-slate-600 text-white px-3 py-2 rounded-lg transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span className="font-mono text-sm">Edit</span>
              </button>
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main OTP Display */}
          <div className="lg:col-span-2">
            <OTPDisplay
              otp={otp}
              timeRemaining={timeRemaining}
              isLoading={isLoading}
              error={error}
              onRefresh={refresh}
              expires={expires}
            />

            {/* Edit Form */}
            {showEditForm && currentEntry && (
              <div className="mt-6">
                <EntryForm
                  mode="edit"
                  initialData={{
                    id: currentEntry.id,
                    issuer: currentEntry.issuer,
                  }}
                  onSuccess={handleEditSuccess}
                  onCancel={() => setShowEditForm(false)}
                />
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <EntryList />
          </div>
        </div>
      </div>
    </div>
  );
}
