import { useState, useEffect, useCallback, useRef } from 'react';
import { api, OTPResponse } from '../utils/api';

interface UseOTPResult {
  otp: string | null;
  timeRemaining: number;
  isLoading: boolean;
  error: string | null;
  refresh: () => void;
  expires: number;
}

export function useOTP(id: string | null): UseOTPResult {
  const [otp, setOtp] = useState<string | null>(null);
  const [expires, setExpires] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timeRemaining, setTimeRemaining] = useState(0);

  const intervalRef = useRef<NodeJS.Timeout>();
  const fetchInProgress = useRef<boolean>(false);

  const fetchOTP = useCallback(async () => {
    if (fetchInProgress.current || !id) return;

    fetchInProgress.current = true;
    // console.log("Fetching new OTP...");
    setIsLoading(true);
    setError(null);

    try {
      const response: OTPResponse = await api.getOTP(id);
      // console.log("OTP fetched successfully:", response);
      setOtp(response.otp);
      setExpires(response.expires); // ← This updates state → triggers re-render
    } catch (err) {
      // console.error("Failed to fetch OTP:", err);
      setError(err instanceof Error ? err.message : 'Failed to fetch OTP');
      setOtp(null);
      setExpires(0);
    } finally {
      fetchInProgress.current = false;
      setIsLoading(false);
    }
  }, [id]); // <-- ONLY DEPENDS ON ID. STABLE IF ID IS STABLE.

  useEffect(() => {
    // 👇 THIS IS CRITICAL: Clear ANY existing interval BEFORE setting a new one
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = undefined; // Reset to avoid memory leak
    }

    const updateTimer = () => {
      const now = Math.floor(Date.now() / 1000);
      const remaining = Math.max(0, expires - now);
      setTimeRemaining(remaining);

      const seconds = new Date().getSeconds();
      const shouldRefresh =
        (remaining <= 0 || seconds === 0 || seconds === 30) && !fetchInProgress.current;

      if (shouldRefresh) {
        const reason = remaining <= 0 ? 'expired' : seconds === 0 ? ':00' : ':30';
        console.log(`🚀 Refreshing OTP at ${new Date().toISOString()} - reason: ${reason}`);
        fetchOTP();
      }
    };

    // Run once immediately
    updateTimer();

    // Set NEW interval
    intervalRef.current = setInterval(updateTimer, 1000);

    // ✅ CLEANUP: Always clear interval on unmount OR before re-running effect
    return () => {
      if (intervalRef.current) {
        // console.log("🧹 Cleared interval");
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    };
  }, [expires, fetchOTP]); // Only re-run if expires or fetchOTP changes

  // Initial fetch
  useEffect(() => {
    if (id) {
      // console.log("⚡ Initial fetch triggered");
      fetchOTP();
    }
  }, [id, fetchOTP]);

  // Cleanup on unmount (safety)
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        // console.log("🗑️ Final cleanup: cleared interval on unmount");
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return {
    otp,
    timeRemaining,
    isLoading,
    error,
    refresh: fetchOTP,
    expires,
  };
}
