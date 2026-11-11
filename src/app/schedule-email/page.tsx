"use client";
import { useState } from "react";
export default function ScheduleEmailPage() {
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  return <div className="max-w-2xl"><h1 className="page-title mb-4">Schedule Email</h1><div className="card p-6 space-y-4"><input placeholder="To" className="input" /><input placeholder="Subject" className="input" /><textarea placeholder="Message" rows={4} className="input" /><div className="grid grid-cols-2 gap-4"><input type="date" value={date} onChange={e => setDate(e.target.value)} className="input" /><input type="time" value={time} onChange={e => setTime(e.target.value)} className="input" /></div><button className="btn btn-primary w-full">Schedule Send</button></div></div>;
}
