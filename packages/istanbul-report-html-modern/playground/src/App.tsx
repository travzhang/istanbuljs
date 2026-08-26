import reportData from "@repo/fixtures/report-data.json";
import { useMemo } from "react";

import { buildReportFiles } from "../../src/helpers/build-report-files";
import { ReportApp } from "../../src/ReportApp";
import type { FileCoverageData } from "../../src/types";

export function App() {
  const prepared = useMemo(
    () =>
      buildReportFiles({
        projectRoot: reportData.projectRoot,
        coverage: reportData.coverage as Record<string, FileCoverageData>,
        sources: reportData.sources,
      }),
    [],
  );

  return (
    <ReportApp
      files={prepared.files}
      projectRoot={prepared.projectRoot}
      name={prepared.name || "playground"}
    />
  );
}
