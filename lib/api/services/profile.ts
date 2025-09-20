"use client";
import { API_BASE_URL, apiFetchClient } from "@/lib/api/client";
import type { AuthUser } from "./auth";

export type GetProfileResponse = { data: AuthUser };

export async function getProfile(token: string): Promise<GetProfileResponse> {
  return apiFetchClient<GetProfileResponse>(`${API_BASE_URL}/api/profile`, {
    headers: { Authorization: `Bearer ${token}` },
    method: "GET",
  });
}

export type UpdateProfileRequest = Partial<
  Pick<
    AuthUser,
    | "name"
    | "username"
    | "gender"
    | "phone"
    | "codeforces_handle"
    | "atcoder_handle"
    | "vjudge_handle"
    | "department"
    | "student_id"
  >
>;

export type UpdateProfileResponse = { data: AuthUser };

export async function updateProfile(
  token: string,
  body: UpdateProfileRequest
): Promise<UpdateProfileResponse> {
  return apiFetchClient<UpdateProfileResponse>(`${API_BASE_URL}/api/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify(body),
  });
}

export type UploadPictureResponse = { message: string; data: { url: string } };

export async function uploadProfilePicture(
  token: string,
  file: File
): Promise<UploadPictureResponse> {
  const form = new FormData();
  form.append("profile_picture", file);
  return apiFetchClient<UploadPictureResponse>(
    `${API_BASE_URL}/api/profile/picture`,
    {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    }
  );
}
