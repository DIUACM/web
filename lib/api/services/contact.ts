"use client";
import { API_BASE_URL, apiFetchClient } from "@/lib/api/client";

export type ContactRequest = {
  name: string;
  email: string;
  message: string;
};

export type ContactResponse = {
  message: string;
  data: {
    id: number;
    name: string;
    email: string;
    created_at: string;
  };
};

export async function submitContact(body: ContactRequest): Promise<ContactResponse> {
  return apiFetchClient<ContactResponse>(`${API_BASE_URL}/api/contact`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}