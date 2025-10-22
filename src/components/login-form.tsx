"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ThemeToggle } from "./theme-toggle";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Alert, AlertTitle } from "./ui/alert";
import { AlertCircleIcon, Loader2 } from "lucide-react";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    emailOrUsername: "",
    password: "",
  });
  const [errors, setErrors] = useState<{
    emailOrUsername?: string;
    password?: string;
  }>({});
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const validateForm = () => {
    const newErrors: { emailOrUsername?: string; password?: string } = {};

    if (!formData.emailOrUsername.trim()) {
      newErrors.emailOrUsername = "Email atau Username wajib diisi";
    } else if (
      formData.emailOrUsername.includes("@") &&
      !validateEmail(formData.emailOrUsername)
    ) {
      newErrors.emailOrUsername = "Format email tidak valid";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password minimal 6 karakter";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include', // IMPORTANT: Include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        setLoginError(data.error || 'Login gagal');
        return;
      }

      // Wait a bit for cookie to be set
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Force reload to ensure middleware picks up the cookie
      window.location.href = '/dashboard';
    } catch (error) {
      setLoginError('Terjadi kesalahan. Silakan coba lagi.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <div className="flex flex-row justify-between gap-8">
            <div>
              <CardTitle>Login to your account</CardTitle>
              <CardDescription>Login untuk melanjutkan</CardDescription>
            </div>
            <div className="flex flex-row items-end justify-end">
              <ThemeToggle />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="emailOrUsername">
                  Email atau Username
                </FieldLabel>
                <Input
                  id="emailOrUsername"
                  type="text"
                  value={formData.emailOrUsername}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      emailOrUsername: e.target.value,
                    })
                  }
                  placeholder="Masukkan Email atau Username"
                  required
                  disabled={isLoading}
                  isError={!!errors.emailOrUsername}
                />
                {errors.emailOrUsername && (
                  <p className="mt-1 text-sm text-red-500">
                    {errors.emailOrUsername}
                  </p>
                )}
              </Field>
              <Field>
                <FieldLabel htmlFor="password">Password</FieldLabel>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      password: e.target.value,
                    })
                  }
                  required
                  placeholder="Masukkan Password"
                  disabled={isLoading}
                  isError={!!errors.password}
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-500">{errors.password}</p>
                )}
              </Field>
              {loginError && (
                <Alert variant="destructive">
                  <AlertCircleIcon />
                  <AlertTitle>{loginError}</AlertTitle>
                </Alert>
              )}
              <Field>
                <Button type="submit" disabled={isLoading}>
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin" size={20} />
                      <span>Logging in...</span>
                    </>
                  ) : (
                    <span>Login</span>
                  )}
                </Button>
              </Field>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
