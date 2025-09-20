import { LoginForm } from "@/components/auth/login-form";

export const metadata = { title: "Sign In" };

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="min-h-[60vh] grid place-items-center">
        <LoginForm />
      </div>
    </div>
  );
}
