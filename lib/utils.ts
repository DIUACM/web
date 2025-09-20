import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility type for API errors
export interface ApiError {
  message?: string;
  body?: {
    errors?: Record<string, string[]>;
    [key: string]: unknown;
  };
  [key: string]: unknown;
}

// Helper function to safely extract error message
export function getErrorMessage(error: unknown): string {
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  return 'An error occurred';
}

// Helper function to extract API error info
export function getApiErrorInfo(error: unknown) {
  const apiError = error as ApiError;
  return {
    message: apiError?.message || 'Request failed',
    body: apiError?.body,
    fieldErrors: apiError?.body?.errors
  };
}
