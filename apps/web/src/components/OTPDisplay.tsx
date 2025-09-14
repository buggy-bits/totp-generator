import React from "react";
import { LoadingSpinner } from "./LoadingSpinner";
import { RefreshCw, Copy, CheckCircle } from "lucide-react";
import { useState } from "react";
import DrainingTimer from "./Timer";

interface OTPDisplayProps {
  otp: string | null;
  timeRemaining: number;
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  expires: number;
}

export function OTPDisplay({
  otp,
  timeRemaining,
  isLoading,
  error,
  onRefresh,
  expires,
}: OTPDisplayProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (otp) {
      try {
        await navigator.clipboard.writeText(otp);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy OTP:", err);
      }
    }
  };
  const formatOTP = (code: string) => {
    return code.replace(/(.{3})/g, "$1 ").trim();
  };
  const getProgressPercentage = () => {
    return timeRemaining > 0 ? (timeRemaining / 30) * 100 : 0;
  };

  if (error) {
    return (
      <div className="bg-slate-800 rounded-lg p-8 text-center">
        <div className="text-red-400 mb-4">
          <p className="text-lg font-mono">Error loading OTP</p>
          <p className="text-sm text-slate-400 mt-2">{error}</p>
        </div>
        <button
          onClick={onRefresh}
          className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry</span>
        </button>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-8">
      <div className="text-center">
        <div className="mb-6">
          <p className="text-slate-400 text-sm font-mono mb-2">Current OTP</p>
          {isLoading ? (
            <div className="flex justify-center">
              <LoadingSpinner size="lg" />
            </div>
          ) : (
            <div className="relative">
              <div className="text-4xl md:text-6xl font-mono font-bold text-white tracking-wider mb-4">
                {otp ? (
                  <DrainingTimer text={formatOTP(otp)} endTime={expires} />
                ) : (
                  "------"
                )}
              </div>
              {otp && (
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center space-x-2 text-slate-400 hover:text-white transition-colors"
                >
                  {copied ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <span className="text-green-400">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Timer */}

        {/* Refresh Button */}
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="mt-2 inline-flex items-center space-x-2 text-slate-400 hover:text-white disabled:opacity-50 transition-colors"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`} />
          <span>Refresh</span>
        </button>
      </div>
    </div>
  );
}
