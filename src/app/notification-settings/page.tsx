"use client";
import { useState } from "react";
export default function NotificationSettingsPage() {
  const [settings, setSettings] = useState({ email: true, push: true, slack: false });
  return <div className="max-w-2xl"><h1 className="page-title mb-4">Notification Settings</h1><div className="card p-6 space-y-4"><label className="flex items-center gap-3"><input type="checkbox" checked={settings.email} onChange={() => setSettings({...settings, email: !settings.email})} /><span>Email notifications</span></label><label className="flex items-center gap-3"><input type="checkbox" checked={settings.push} onChange={() => setSettings({...settings, push: !settings.push})} /><span>Push notifications</span></label><label className="flex items-center gap-3"><input type="checkbox" checked={settings.slack} onChange={() => setSettings({...settings, slack: !settings.slack})} /><span>Slack notifications</span></label></div></div>;
}
