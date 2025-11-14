// lib/api.ts
export const API_BASE = `${process.env.NEXT_PUBLIC_API_URL}`; // backend URL

// centralized API call function
export async function apiFetch(endpoint: string, method = "GET", data?: any) {
  const token = localStorage.getItem("token");

  const headers: any = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const res = await fetch(`${API_BASE}${endpoint}`, {
    method,
    headers,
    ...(data ? { body: JSON.stringify(data) } : {}),
  });

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(errText || "API Error");
  }

  return res.json();
}
