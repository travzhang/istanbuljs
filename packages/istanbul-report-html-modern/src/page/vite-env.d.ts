/// <reference types="vite/client" />

declare module "@repo/fixtures/report-data.json" {
  import type { ReportData } from "./report-data.ts";

  const reportData: ReportData;
  export default reportData;
}
