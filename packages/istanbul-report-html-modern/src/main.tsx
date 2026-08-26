import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "monaco-editor-css";

import { loadReportData } from "./helpers/loadData.ts";
import ReportPage from "./ReportPage.tsx";

await loadReportData();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ReportPage />
  </StrictMode>,
);
