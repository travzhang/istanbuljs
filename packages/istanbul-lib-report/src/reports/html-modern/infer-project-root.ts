/** Parent directory with POSIX slashes (empty string if none / only filesystem root). */
function posixParentDir(filePath: string): string {
  const posix = filePath.replaceAll("\\", "/").replace(/\/+$/, "");
  const idx = posix.lastIndexOf("/");
  // Match SummarizerFactory: file directly under `/` has an empty parent path.
  if (idx <= 0) {
    return "";
  }
  return posix.slice(0, idx);
}

function commonPrefixSegments(paths: string[]): string[] {
  if (paths.length === 0) {
    return [];
  }

  const segmentsList = paths.map((p) => {
    if (p === "") {
      return [];
    }
    if (p === "/") {
      return [""];
    }
    return p.split("/");
  });

  let common = segmentsList[0]!;
  for (let i = 1; i < segmentsList.length; i++) {
    const other = segmentsList[i]!;
    const next: string[] = [];
    const len = Math.min(common.length, other.length);
    for (let j = 0; j < len; j++) {
      if (common[j] === other[j]) {
        next.push(common[j]!);
      } else {
        break;
      }
    }
    common = next;
    if (common.length === 0) {
      break;
    }
  }

  return common;
}

/**
 * Infer project root like SummarizerFactory's `_commonParent`:
 * the common parent directory of all coverage file paths.
 * Returns `undefined` when there is no useful shared prefix (including filesystem root only).
 */
export function inferProjectRoot(filePaths: string[]): string | undefined {
  if (filePaths.length === 0) {
    return undefined;
  }

  const common = commonPrefixSegments(filePaths.map(posixParentDir));
  // Empty or only `""` (POSIX `/`) is not a useful project root for relativizing paths.
  if (common.length === 0 || (common.length === 1 && common[0] === "")) {
    return undefined;
  }

  return common.join("/");
}

export function resolveProjectRoot(filePaths: string[], explicit?: string): string {
  if (explicit !== undefined && explicit !== "") {
    return explicit;
  }

  return inferProjectRoot(filePaths) || process.cwd();
}
