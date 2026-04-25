type ClassValue = string | number | boolean | null | undefined | ClassDictionary | ClassArray;
interface ClassDictionary {
  [key: string]: ClassValue;
}
interface ClassArray extends Array<ClassValue> {}

function classNames(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  for (const input of inputs) {
    if (!input) continue;

    if (typeof input === "string" || typeof input === "number") {
      classes.push(String(input));
      continue;
    }

    if (Array.isArray(input)) {
      const inner = classNames(...input);
      if (inner) {
        classes.push(inner);
      }
      continue;
    }

    if (typeof input === "object") {
      Object.entries(input).forEach(([key, value]) => {
        if (value) {
          classes.push(key);
        }
      });
    }
  }

  return classes.filter(Boolean).join(" ");
}

export function cn(...inputs: ClassValue[]) {
  return classNames(...inputs);
}
