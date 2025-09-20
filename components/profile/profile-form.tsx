"use client";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { toast } from "sonner";
import { useAuth } from "@/components/providers/auth-provider";
import { getProfile, updateProfile, uploadProfilePicture } from "@/lib/api/services/profile";
import { ImageCropper } from "@/components/image-cropper";

const schema = z.object({
  name: z.string().min(3).max(255),
  username: z.string().min(3).max(255),
  gender: z.enum(["unspecified", "male", "female", "other"]),
  phone: z.string().max(50).optional(),
  codeforces_handle: z.string().max(255).optional(),
  atcoder_handle: z.string().max(255).optional(),
  vjudge_handle: z.string().max(255).optional(),
  department: z.string().max(255).optional(),
  student_id: z.string().max(255).optional(),
});

type Values = z.infer<typeof schema>;

export function ProfileForm() {
  const { session, setUser } = useAuth();
  const token = session?.token || "";
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [showCropper, setShowCropper] = useState(false);

  const form = useForm<Values>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      username: "",
      gender: "unspecified",
      phone: "",
      codeforces_handle: "",
      atcoder_handle: "",
      vjudge_handle: "",
      department: "",
      student_id: "",
    },
  });

  useEffect(() => {
    let active = true;
    async function load() {
      if (!token) return;
      try {
        const res = await getProfile(token);
        if (!active) return;
        const u = res.data;
        form.reset({
          name: u.name || "",
          username: u.username || "",
          gender: (u.gender as any) || "unspecified",
          phone: u.phone || "",
          codeforces_handle: u.codeforces_handle || "",
          atcoder_handle: u.atcoder_handle || "",
          vjudge_handle: u.vjudge_handle || "",
          department: u.department || "",
          student_id: u.student_id || "",
        });
        setUser(() => u);
      } catch (e: any) {
        toast.error(e?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [token]);

  async function onSubmit(values: Values) {
    setSaving(true);
    try {
      const payload = {
        name: values.name,
        username: values.username,
        gender: values.gender === "unspecified" ? null : (values.gender as any),
        phone: values.phone ? values.phone : null,
        codeforces_handle: values.codeforces_handle ? values.codeforces_handle : null,
        atcoder_handle: values.atcoder_handle ? values.atcoder_handle : null,
        vjudge_handle: values.vjudge_handle ? values.vjudge_handle : null,
        department: values.department ? values.department : null,
        student_id: values.student_id ? values.student_id : null,
      } as any;
      const res = await updateProfile(token, payload);
      setUser(() => res.data);
      toast.success("Profile updated");
    } catch (e: any) {
      const fieldErrors = e?.body?.errors as Record<string, string[]> | undefined;
      if (fieldErrors && typeof fieldErrors === "object") {
        const knownKeys = [
          "name",
          "username",
          "gender",
          "phone",
          "codeforces_handle",
          "atcoder_handle",
          "vjudge_handle",
          "department",
          "student_id",
        ] as const;
        const keys = Object.keys(fieldErrors);
        let firstFocused = false;
        for (const key of keys) {
          if ((knownKeys as readonly string[]).includes(key)) {
            const message = fieldErrors[key]?.[0] || "Invalid value";
            // @ts-expect-error index type
            form.setError(key, { type: "server", message });
            if (!firstFocused) {
              try {
                // @ts-expect-error index type
                form.setFocus?.(key);
              } catch {}
              firstFocused = true;
            }
          }
        }
        toast.error("Please fix the highlighted fields.");
      } else {
        toast.error(e?.message || "Update failed");
      }
    } finally {
      setSaving(false);
    }
  }

  function dataUrlToFile(dataUrl: string, filename: string): File {
    const arr = dataUrl.split(",");
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, { type: mime });
  }

  async function onCroppedImage(croppedDataUrl: string) {
    setUploading(true);
    try {
      const file = dataUrlToFile(croppedDataUrl, "avatar.jpg");
      const res = await uploadProfilePicture(token, file);
      setUser((u) => ({ ...u, profile_picture: res.data.url }));
      toast.success("Profile picture updated");
      setShowCropper(false);
    } catch (e: any) {
      const msg = e?.body?.errors?.profile_picture?.[0] || e?.message || "Upload failed";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  }

  const user = useMemo(() => session?.user, [session?.user]);

  return (
    <div className="grid gap-6 md:grid-cols-[280px_1fr]">
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>Upload a new avatar image (max 5 MB).</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={user?.profile_picture || undefined} alt={user?.name || "User"} />
              <AvatarFallback>{user?.name?.[0]?.toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <Button onClick={() => setShowCropper(true)} disabled={uploading}>
                {uploading ? "Uploading..." : "Update Picture"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      {showCropper && (
        <ImageCropper onComplete={onCroppedImage} onCancel={() => setShowCropper(false)} />
      )}

      <Card>
        <CardHeader>
          <CardTitle>Edit Profile</CardTitle>
          <CardDescription>Update your public profile information.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4 sm:grid-cols-2">
              <FormField name="name" control={form.control} render={({ field }) => (
                <FormItem className="sm:col-span-2">
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Jane Doe" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="username" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="janedoe" {...field} />
                  </FormControl>
                  <FormDescription>Your unique public handle.</FormDescription>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="gender" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Gender</FormLabel>
                  <Select onValueChange={(v) => field.onChange(v as any)} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="unspecified">Prefer not to say</SelectItem>
                      <SelectItem value="male">Male</SelectItem>
                      <SelectItem value="female">Female</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="phone" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone</FormLabel>
                  <FormControl>
                    <Input placeholder="+8801XXXXXXXXX" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="department" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Department</FormLabel>
                  <FormControl>
                    <Input placeholder="CSE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="student_id" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Student ID</FormLabel>
                  <FormControl>
                    <Input placeholder="" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="codeforces_handle" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>Codeforces</FormLabel>
                  <FormControl>
                    <Input placeholder="handle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="atcoder_handle" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>AtCoder</FormLabel>
                  <FormControl>
                    <Input placeholder="handle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <FormField name="vjudge_handle" control={form.control} render={({ field }) => (
                <FormItem>
                  <FormLabel>VJudge</FormLabel>
                  <FormControl>
                    <Input placeholder="handle" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />

              <div className="sm:col-span-2 flex justify-end">
                <Button type="submit" disabled={saving || loading}>
                  {saving ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
