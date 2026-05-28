export function formatCurrency(value) {
  if (value === null || value === undefined || value === "") return "";
  const num = typeof value === "string" ? value.replace(/\D/g, "") : String(value);
  if (!num) return "";
  return Number(num).toLocaleString("id-ID");
}
