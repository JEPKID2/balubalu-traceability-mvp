export function formatDate(value: string) {
  return new Intl.DateTimeFormat("es-CO", {
    dateStyle: "full",
    timeStyle: "short"
  }).format(new Date(value));
}
