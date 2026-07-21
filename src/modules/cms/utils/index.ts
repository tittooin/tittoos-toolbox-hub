export const generateSlug = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
};

export const formatISODate = (dateString?: string): string => {
  const d = dateString ? new Date(dateString) : new Date();
  return d.toISOString().split("T")[0];
};
