import type { ReportData } from "../report-data.ts";
import { base64ToUint8Array, decompressGzip } from "./decompress.ts";

/**
 * Decode gzip+base64 `window.reportData` (as embedded by the html-modern reporter)
 * into a plain object. No-op when data is already an object (e.g. local Vite dev).
 */
export async function loadReportData(): Promise<void> {
  const embeddedReportData = window.reportData as ReportData | string | undefined;

  if (typeof embeddedReportData !== "string") {
    return;
  }

  const decompressedText = await decompressGzip(base64ToUint8Array(embeddedReportData));
  window.reportData = JSON.parse(decompressedText) as ReportData;
}
