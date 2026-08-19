export default function (str: string) {
  return str
    .replace(/([A-Z])/g, '-$1') // Replace uppercase letters with - + lowercase
    .replace(/[\s_]+/g, '-') // Replace spaces and underscores with -
    .replace(/-+/g, '-') // collapse any run of dashes into one
    .toLowerCase() // Convert to lowercase
    .replace(/^-+|-+$/g, '') // Remove leading/trailing dashes
}
