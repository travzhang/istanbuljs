# @vitest/istanbul-report-html-modern

Modern Istanbul HTML coverage report:

- **React components** — `import { ReportApp } from "@vitest/istanbul-report-html-modern"` + `import "@vitest/istanbul-report-html-modern/style.css"`
- **Single-file HTML** — `dist/index.html` (used by `@vitest/istanbul-lib-report`’s `html-modern` report)

## Scripts

```bash
pnpm build   # dist/index.js + style.css + index.html
pnpm dev     # full report page with mock data
pnpm play    # UI playground
```
