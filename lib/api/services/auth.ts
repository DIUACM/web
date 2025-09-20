"use client";
import { API_BASE_URL, apiFetchClient } from "@/lib/api/client";

export type LoginRequest = {
  identifier: string;
  password: string;
  device_name?: string;
};

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  username: string;
  gender: "male" | "female" | "other" | null;
  phone: string | null;
  codeforces_handle: string | null;
  atcoder_handle: string | null;
  vjudge_handle: string | null;
  department: string | null;
  student_id: string | null;
  max_cf_rating: number | null;
  profile_picture: string | null;
};

export type LoginResponse = {
  token: string;
  token_type: "Bearer";
  user: AuthUser;
};

export async function login(body: LoginRequest): Promise<LoginResponse> {
  return apiFetchClient<LoginResponse>(`${API_BASE_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ device_name: "web", ...body }),
  });
}

export async function logout(token: string): Promise<{ message: string }> {
  return apiFetchClient<{ message: string }>(`${API_BASE_URL}/api/auth/logout`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
  });
}
