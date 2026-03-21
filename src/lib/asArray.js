/** Normalize API list payloads so hooks always receive a real Array. */
export function asArray(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.data)) return data.data;
  if (data && Array.isArray(data.courses)) return data.courses;
  return [];
}
