"use client";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useAuth } from "@/components/providers/auth-provider";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

const schema = z.object({
  identifier: z.string().min(3, "Enter email or username"),
  password: z.string().min(6, "Password is too short"),
});

type Values = z.infer<typeof schema>;

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<Values>({ resolver: zodResolver(schema), defaultValues: { identifier: "", password: "" } });

  async function onSubmit(values: Values) {
    setSubmitting(true);
    try {
      await login(values);
      toast.success("Signed in successfully");
      router.push("/profile/edit");
    } catch (err: any) {
      const msg = err?.body?.errors?.identifier?.[0] || err?.message || "Login failed";
      toast.error(msg);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto w-full max-w-md rounded-xl border bg-white/70 dark:bg-slate-900/70 backdrop-blur p-6 shadow-sm">
      <div className="mb-6 text-center">
        <h1 className="text-2xl font-semibold">Sign in</h1>
        <p className="text-sm text-slate-500 mt-1">Use your email or username</p>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="identifier"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email or Username</FormLabel>
                <FormControl>
                  <Input placeholder="jane@example.com or janedoe" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="••••••••" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Signing in..." : "Sign In"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
