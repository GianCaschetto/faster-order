export const sanitizeFilename = (filename: string): string | undefined => {
  if (!filename) return;
  const fileExtension = filename.split(".").pop();
  const randomFilename = `${crypto.randomUUID()}.${fileExtension}`;
  return randomFilename;
};
