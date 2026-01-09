export default function (str: String) {
  return (
    str
      // Replace uppercase letters with - + lowercase
      .replace(/([A-Z])/g, "-$1")
      // Replace spaces and underscores with -
      .replace(/[\s_]+/g, "-")
      // Convert to lowercase
      .toLowerCase()
      // Remove leading/trailing dashes
      .replace(/^-+|-+$/g, "")
  );
}
