/** Build KYK referral/sales codes: Ashiya → Ashiyakyk2024 */
export function makeKykCode(name, year = 2024) {
  const cleaned = String(name || "")
    .trim()
    .replace(/[^a-zA-Z0-9]/g, "");
  if (!cleaned) return null;
  const proper = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return `${proper}kyk${year}`;
}
