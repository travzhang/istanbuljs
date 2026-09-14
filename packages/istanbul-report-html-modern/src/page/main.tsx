import { render } from "preact";

import { loadDevReportData } from "./load-data.ts";
import ReportShell from "./shell.tsx";

await loadDevReportData();

render(<ReportShell />, document.getElementById("root")!);
