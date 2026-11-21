import { InputError } from "@/lib/crm";

export const CSV_LIMIT_BYTES = 50 * 1024;
export const CSV_LIMIT_ROWS = 100;

export async function readBoundedCsv(request: Request): Promise<string> {
  if (request.headers.get("content-type")?.split(";")[0]?.trim().toLowerCase() !== "text/csv") {
    throw new InputError("Content-Type must be text/csv");
  }
  const declared = Number(request.headers.get("content-length") || "0");
  if (declared > CSV_LIMIT_BYTES) throw new InputError("CSV exceeds the 50 KB validation limit");
  if (!request.body) throw new InputError("CSV content is required");
  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let size = 0;
  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      size += value.byteLength;
      if (size > CSV_LIMIT_BYTES) {
        await reader.cancel();
        throw new InputError("CSV exceeds the 50 KB validation limit");
      }
      chunks.push(value);
    }
  } finally { reader.releaseLock(); }
  if (!size) throw new InputError("CSV content is required");
  const bytes = new Uint8Array(size);
  let offset = 0;
  for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.byteLength; }
  try { return new TextDecoder("utf-8", { fatal: true }).decode(bytes).replace(/^\uFEFF/, ""); }
  catch { throw new InputError("CSV must be UTF-8"); }
}

// Bounded RFC-4180 reader with escaped quotes, CRLF, and quoted line breaks.
export function parseCsv(source: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [], field = "", quoted = false, afterQuote = false;
  function addField() {
    if (field.length > 4000) throw new InputError("CSV field is too long");
    row.push(field);
    field = ""; afterQuote = false;
  }
  function addRow() {
    addField();
    if (row.some((cell) => cell.trim())) rows.push(row);
    row = [];
    if (rows.length > CSV_LIMIT_ROWS + 1) throw new InputError("CSV supports at most 100 data rows");
  }
  for (let i = 0; i < source.length; i++) {
    const ch = source[i];
    if (quoted) {
      if (ch === '"') {
        if (source[i + 1] === '"') { field += '"'; i++; }
        else { quoted = false; afterQuote = true; }
      } else field += ch;
      continue;
    }
    if (ch === ',') { addField(); continue; }
    if (ch === '\r' || ch === '\n') {
      if (ch === '\r' && source[i + 1] === '\n') i++;
      addRow();
      continue;
    }
    if (ch === '"') {
      if (field || afterQuote) throw new InputError("Malformed CSV quotation");
      quoted = true;
      continue;
    }
    if (afterQuote) throw new InputError("Unexpected characters after quoted CSV value");
    field += ch;
  }
  if (quoted) throw new InputError("Unterminated quoted CSV field");
  if (row.length || field || afterQuote) addRow();
  return rows;
}

export type CsvIssue = { row: number; code: string; message: string };
export type CheckedRow = { row: number; email: string | null; name: string; valid: boolean };
export function validateContactsCsv(rows: string[][]): { checked: CheckedRow[]; issues: CsvIssue[] } {
  if (!rows.length) throw new InputError("CSV is empty");
  const headers = rows[0].map((value) => value.trim().toLowerCase());
  const accepted = ["name", "email", "title", "company"];
  if (!headers.includes("name") || headers.length !== new Set(headers).size ||
      headers.some((header) => !accepted.includes(header))) {
    throw new InputError("CSV headers must include name, with optional email, title and company (no duplicate or unknown columns)");
  }
  if (rows.length - 1 > CSV_LIMIT_ROWS) throw new InputError("CSV supports at most 100 data rows");
  const issues: CsvIssue[] = [];
  const checked: CheckedRow[] = [];
  const seen = new Set<string>();
  for (let index = 1; index < rows.length; index++) {
    const columns = rows[index];
    const line = index + 1;
    let valid = true;
    function issue(code: string, message: string) {
      valid = false; issues.push({ row: line, code, message });
    }
    if (columns.length !== headers.length) issue("column_count", "Unexpected number of CSV columns");
    const values = Object.fromEntries(headers.map((h, i) => [h, (columns[i] || "").trim()]));
    const name = values.name || "";
    const email = (values.email || "").toLowerCase() || null;
    if (!name || name.length > 160) issue("name", "Name is required and must be at most 160 characters");
    if (email && (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
      issue("email", "Email is invalid");
    }
    for (const field of ["name", "title", "company"]) {
      const value = values[field] || "";
      if (value.length > 160) issue("field_length", field + " must be at most 160 characters");
      if (/^[\s\t\r\n]*[=+\-@]/u.test(value)) issue("formula", field + " starts with a spreadsheet formula character");
    }
    if (email) {
      if (seen.has(email)) issue("duplicate_in_file", "Email is repeated in this CSV");
      seen.add(email);
    }
    checked.push({ row: line, name, email, valid });
  }
  return { checked, issues };
}
