"use client";
import { useEffect, useMemo, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2, Camera, UserIcon } from "lucide-react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImageCropper } from "@/components/image-cropper";
import { useAuth } from "@/components/providers/auth-provider";
import { getProfile, updateProfile, uploadProfilePicture } from "@/lib/api/services/profile";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters").max(255),
  username: z.string().min(3, "Username must be at least 3 characters").max(255),
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
        phone: values.phone || null,
        codeforces_handle: values.codeforces_handle || null,
        atcoder_handle: values.atcoder_handle || null,
        vjudge_handle: values.vjudge_handle || null,
        department: values.department || null,
        student_id: values.student_id || null,
      } as any;
      const res = await updateProfile(token, payload);
      setUser(() => res.data);
      toast.success("Profile updated successfully");
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
        toast.error(e?.message || "Failed to update profile");
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
      toast.success("Profile picture updated successfully");
      setShowCropper(false);
    } catch (e: any) {
      const msg = e?.body?.errors?.profile_picture?.[0] || e?.message || "Failed to upload image";
      toast.error(msg);
    } finally {
      setUploading(false);
    }
  }

  const user = useMemo(() => session?.user, [session?.user]);

  function getInitials(name?: string) {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card className="overflow-hidden bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-md">
        <CardHeader className="border-b border-slate-200 dark:border-slate-700">
          <CardTitle className="flex items-center gap-3 text-xl text-slate-900 dark:text-white">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 dark:from-blue-400 dark:to-blue-600 flex items-center justify-center">
              <UserIcon className="h-5 w-5 text-white" />
            </div>
            Edit Profile
          </CardTitle>
          <CardDescription>Update your profile information</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="flex flex-col items-center space-y-4 pb-6 border-b border-slate-200 dark:border-slate-700">
                <div className="relative">
                  <Avatar className="h-32 w-32 ring-4 ring-slate-100 dark:ring-slate-800">
                    <AvatarImage src={user?.profile_picture || undefined} alt={user?.name || "User"} />
                    <AvatarFallback className="text-2xl font-semibold">{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 rounded-full p-3 shadow-lg"
                    onClick={() => setShowCropper(true)}
                    disabled={uploading || loading}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                  </Button>
                </div>
                <div className="text-center">
                  <p className="text-sm text-muted-foreground">Click the camera icon to update your profile picture</p>
                </div>
              </div>

              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                    Basic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="Jane Doe" disabled={saving || loading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="username"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Username *</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="janedoe" disabled={saving || loading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="gender"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Gender</FormLabel>
                          <Select onValueChange={(v) => field.onChange(v as any)} value={field.value} disabled={saving || loading}>
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
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="+8801XXXXXXXXX" disabled={saving || loading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    Academic Information
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="student_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Student ID</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={saving || loading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="department"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Department</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="CSE" disabled={saving || loading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* No starting semester in current API; omitted intentionally */}
                  </div>
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t border-slate-200 dark:border-slate-700">
                <div>
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-purple-500"></div>
                    Competitive Programming Profiles
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="codeforces_handle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Codeforces Handle</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={saving || loading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="atcoder_handle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>AtCoder Handle</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={saving || loading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="vjudge_handle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>VJudge Handle</FormLabel>
                          <FormControl>
                            <Input {...field} disabled={saving || loading} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-between gap-4 pt-8 border-t border-slate-200 dark:border-slate-700">
                <div className="flex flex-col sm:flex-row gap-4 order-2 sm:order-1">
                  <Button type="button" variant="outline" asChild disabled={saving || loading || !user?.username}>
                    <Link href={`/programmers/${user?.username || ""}`}>View Profile</Link>
                  </Button>

                  <Button type="button" variant="secondary" asChild disabled={saving || loading}>
                    <Link href="/change-password">Change Password</Link>
                  </Button>
                </div>

                <Button
                  type="submit"
                  disabled={saving || loading}
                  size="lg"
                  className="min-w-[140px] order-1 sm:order-2 rounded-full px-8 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white shadow-md hover:shadow-xl transition-all dark:from-blue-500 dark:to-cyan-500 dark:hover:from-blue-600 dark:hover:to-cyan-600 font-medium"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {showCropper && (
        <ImageCropper onComplete={onCroppedImage} onCancel={() => setShowCropper(false)} />
      )}
    </div>
  );
}
