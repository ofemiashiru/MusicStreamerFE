export const slugify = (text) => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "") // Remove non-word characters (e.g., apostrophes)
    .replace(/[\s_-]+/g, "-") // Collapse whitespace/dashes into a single dash
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing dashes
};
