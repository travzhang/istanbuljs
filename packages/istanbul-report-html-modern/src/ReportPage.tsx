import { useMemo } from "react";

import { ReportFooter } from "./components/ReportFooter";
import { buildReportFiles } from "./helpers/build-report-files";
import { ReportApp } from "./ReportApp";

import "./index.css";

/** Standalone single-file HTML page shell around {@link ReportApp}. */
export function ReportPage() {
  const reportData = window.reportData;

  const prepared = useMemo(() => {
    if (reportData === undefined) {
      return null;
    }
    return buildReportFiles(reportData);
  }, [reportData]);
  console.log({
    prepared,
    reportData,
  });
  if (prepared === null || reportData === undefined) {
    return <p>No report data loaded.</p>;
  }

  return (
    <div className="report-page">
      <div className="report-page__content">
        <ReportApp files={prepared.files} projectRoot={prepared.projectRoot} name={prepared.name} />
      </div>
      <ReportFooter
        generatedAt={reportData.generatedAt}
        packageName={reportData.packageName}
        packageVersion={reportData.packageVersion}
      />
    </div>
  );
}

export default ReportPage;
