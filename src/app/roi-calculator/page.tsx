"use client";
import { useState } from "react";
export default function ROICalculatorPage() {
  const [investment, setInvestment] = useState(5000);
  const roi = 150;
  return (<div className="max-w-2xl"><h1 className="page-title mb-4">ROI Calculator</h1><div className="card p-6"><input type="number" value={investment} onChange={e => setInvestment(+e.target.value)} className="input mb-4" /><div className="text-2xl font-bold text-emerald-600">ROI: {roi}%</div></div></div>);
}
