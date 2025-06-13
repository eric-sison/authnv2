export const normalizer = (str: string) => {
  return str
    .trim()
    .split(/\s+/)
    .map((s) => s.toLowerCase())
    .sort()
    .join(" ");
};
