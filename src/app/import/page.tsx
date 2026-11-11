"use client";
export default function ImportPage() {
  return <div className="max-w-2xl"><h1 className="page-title mb-4">Import Data</h1><div className="card p-6"><div className="border-2 border-dashed border-slate-200 rounded-lg p-8 text-center"><div className="text-slate-500 mb-4">Drop CSV file here or click to upload</div><button className="btn btn-primary">Choose File</button></div><div className="mt-6"><div className="font-medium mb-2">Or import from Google Sheet</div><input placeholder="Sheet URL" className="input mb-3" /><button className="btn btn-secondary">Import</button></div></div></div>;
}
