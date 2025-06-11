export const normalizer = (str: string) => {
  return str.trim().split(/\s+/).sort().join(" ");
};
