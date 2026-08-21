export default function dataProperties<T extends object>(
  klass: { prototype: { data: T } },
  properties: (keyof T & string)[],
): void {
  properties.forEach((p) => {
    Object.defineProperty(klass.prototype, p, {
      enumerable: true,
      get(this: { data: T }) {
        return this.data[p];
      },
    });
  });
}
