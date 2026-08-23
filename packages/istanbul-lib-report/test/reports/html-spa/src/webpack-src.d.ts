// Local ambient declaration for the untyped webpack JSX source module used by
// the getChildData test; keeps `allowJs` disabled for the package.
declare module "*/getChildData.js" {
  const getChildData: (
    sourceData: unknown,
    metricsToShow: unknown,
    activeSort?: unknown,
    isFlat?: unknown,
    activeFilters?: unknown,
    fileFilter?: unknown,
  ) => unknown;
  export default getChildData;
}
