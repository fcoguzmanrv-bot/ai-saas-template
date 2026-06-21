"use client";

import { useState } from "react";

export default function SettingsForm({ user }: { user: { name: string; email: string; plan: string } }) {
  const [name, setName] = useState(user.name);
  const [saved, setSaved] = useState(false);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    // Add your profile update API endpoint here
    // await fetch('/api/user/profile', { method: 'PUT', body: JSON.stringify({ name }) })
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Profile */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-bold text-gray-900 mb-4">Profile</h2>
        <form onSubmit={handleSave} className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Name</label>
              <input type="text" value={name} onChange={e => setName(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-4 py-2.5 text-sm outline-none focus:border-violet-400" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email</label>
              <input type="email" value={user.email} disabled
                className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button type="submit"
              className="rounded-xl bg-violet-600 px-4 py-2 text-sm font-semibold text-white hover:bg-violet-700 transition-colors">
              Save changes
            </button>
            {saved && <span className="text-sm text-green-600">Saved!</span>}
          </div>
        </form>
      </div>

      {/* Plan info */}
      <div className="rounded-2xl border border-gray-200 bg-white p-6">
        <h2 className="font-bold text-gray-900 mb-4">Current Plan</h2>
        <div className="flex items-center gap-3">
          <span className={`rounded-full px-3 py-1 text-sm font-bold ${
            user.plan === "ENTERPRISE" ? "bg-yellow-100 text-yellow-700" :
            user.plan === "PRO" ? "bg-violet-100 text-violet-700" :
            "bg-gray-100 text-gray-600"
          }`}>{user.plan}</span>
          {user.plan === "FREE" && (
            <a href="/billing" className="text-sm text-violet-600 hover:text-violet-700 font-medium">
              Upgrade your plan →
            </a>
          )}
        </div>
      </div>

      {/* Danger zone */}
      <div className="rounded-2xl border border-red-100 bg-white p-6">
        <h2 className="font-bold text-red-600 mb-2">Danger Zone</h2>
        <p className="text-sm text-gray-500 mb-4">Once you delete your account, there is no going back. Please be certain.</p>
        <button className="rounded-xl border border-red-200 px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition-colors">
          Delete account
        </button>
      </div>
    </div>
  );
}
