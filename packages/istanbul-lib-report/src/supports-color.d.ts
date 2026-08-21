// supports-color v7 ships without type declarations; minimal typings for the
// parts this package uses.
declare module "supports-color" {
  interface ColorSupport {
    level: number;
    hasBasic: boolean;
    has256: boolean;
    has16m: boolean;
  }

  const supportsColor: {
    stdout: ColorSupport | false;
    stderr: ColorSupport | false;
  };

  export default supportsColor;
}
