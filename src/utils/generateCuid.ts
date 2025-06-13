export function generateCuid(): string {
  // Generate random string
  const randomString = (length: number): string => {
    return Array.from({ length }, () => Math.random().toString(36).slice(2))
      .join("")
      .slice(0, length);
  };

  // Get current timestamp in base 36
  const timestamp = Date.now().toString(36);

  // Counter that increments with each ID
  let counter = 0;
  const count = (counter++).toString(36);

  // Create a fingerprint based on current environment
  const pid = process.pid || 1;
  const hostname = typeof window !== "undefined" ? window.location.hostname : "node";
  const fingerprint = (String(pid) + hostname)
    .split("")
    .reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0)
    .toString(36);

  // Generate random component
  const random = randomString(8);

  // Combine all parts to create the CUID
  return `c${timestamp}${count}${fingerprint}${random}`;
}
