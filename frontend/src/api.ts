export function apiBase() {
  const envUrl = import.meta.env.VITE_API_URL as string | undefined;
  if (envUrl && envUrl.length > 0) return envUrl;
  // default to same host, api port 3000
  return `${window.location.protocol}//${window.location.hostname}:3000`;
}
