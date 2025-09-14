import { EntryForm } from "../components/EntryForm";
import { Shield, Lock, Clock, Database } from "lucide-react";
import { EntryList } from "../components/EntryList";

export function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <Shield className="w-16 h-16 text-blue-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-mono font-bold text-white mb-4">
            Free TOTP Generator
          </h1>
          <p className="text-xl text-slate-300 font-mono max-w-2xl mx-auto">
            Generate secure time-based one-time passwords for your accounts.
            Your secrets stay encrypted and are never logged or stored in plain
            text.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-12">
          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 text-center border border-slate-700">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Lock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-mono text-white mb-2">
              1. Enter Secret
            </h3>
            <p className="text-slate-400 text-sm">
              Add your TOTP secret key provided by your service when enabling
              2FA
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 text-center border border-slate-700">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-mono text-white mb-2">
              2. Generate OTP
            </h3>
            <p className="text-slate-400 text-sm">
              Get your time-based one-time password with automatic refresh every
              30 seconds
            </p>
          </div>

          <div className="bg-slate-800/50 backdrop-blur rounded-lg p-6 text-center border border-slate-700">
            <div className="w-12 h-12 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Database className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-lg font-mono text-white mb-2">
              3. Secure Storage
            </h3>
            <p className="text-slate-400 text-sm">
              Your entry IDs are saved locally in your browser for quick access
            </p>
          </div>
        </div>

        {/* Create Form */}
        <div className="max-w-2xl flex mx-auto">
          <EntryForm mode="create" />
          <EntryList hasAddButton={false} />
        </div>

        {/* Security Notice */}
        <div className="max-w-2xl mx-auto mt-8 bg-slate-800/30 backdrop-blur border border-slate-700 rounded-lg p-4">
          <div className="flex items-start space-x-3">
            <Shield className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-green-400 font-mono text-sm font-medium mb-1">
                Security Notice
              </h4>
              <p className="text-slate-300 text-xs leading-relaxed">
                Your secret codes are encrypted and processed securely on our
                servers. Only the encrypted entry ID is stored in your browser's
                local storage. We never log, store, or have access to your plain
                text secrets.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
