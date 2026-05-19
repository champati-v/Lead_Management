import { useState } from "react";
import { ArrowRight, Eye, EyeOff, FolderKanban } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { useAuth } from "@/context/auth-context";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string(),
  email: z.email("Enter a valid email"),
  password: z.string().min(6, "Minimum 6 characters"),
  role: z.enum(["admin", "sales"]),
});

type FormValues = z.infer<typeof schema>;

export function AuthPage() {
  const navigate = useNavigate();
  const { login, register } = useAuth();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [submitting, setSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { name: "", email: "", password: "", role: "admin" } });

  const onSubmit = async (values: FormValues) => {
    if (mode === "register" && values.name.trim().length < 2) {
      form.setError("name", { message: "Name is required" });
      return;
    }

    setSubmitting(true);
    try {
      if (mode === "login") {
        await login({ email: values.email, password: values.password, role: values.role });
      } else {
        await register({ name: values.name.trim(), email: values.email, password: values.password, role: values.role });
      }
      toast.success(mode === "login" ? "Login successful" : "Account created");
      navigate("/dashboard", { replace: true });
    } catch (error: any) {
      toast.error(error?.response?.data?.message ?? "Authentication failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-100">
      <div className="grid min-h-screen lg:grid-cols-[1.1fr_1fr]">
        <section className="relative hidden overflow-hidden bg-slate-800 p-12 text-white lg:flex lg:flex-col lg:justify-center">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_20%,#334155_0%,#1e293b_55%,#111827_100%)]" />
          <div className="relative z-10 max-w-md">
            <div className="mb-6 flex items-center gap-3"><div className="grid h-10 w-10 place-items-center rounded-lg bg-blue-600"><FolderKanban className="h-5 w-5" /></div><p className="text-3xl font-semibold">SmartLeads</p></div>
            <h2 className="text-4xl font-semibold leading-tight">Manage your pipeline with precision.</h2>
            <p className="mt-3 text-lg leading-relaxed text-slate-300">The enterprise CRM engineered for high-performance sales teams who demand clarity and speed.</p>
          </div>
        </section>

        <section className="flex items-center justify-center px-6 py-10">
          <div className="w-full max-w-md">
            <h1 className="text-3xl font-semibold text-slate-900">Sign In</h1>
            <p className="mt-1 text-sm text-slate-600">Enter your credentials to access your dashboard.</p>

            <div className="mt-6 rounded-lg bg-slate-200 p-1">
              <div className="grid grid-cols-2 gap-1">
                <button type="button" className={`h-9 rounded-md text-sm font-medium ${mode === "login" ? "bg-white text-blue-600" : "text-slate-600"}`} onClick={() => setMode("login")}>Login</button>
                <button type="button" className={`h-9 rounded-md text-sm font-medium ${mode === "register" ? "bg-white text-blue-600" : "text-slate-600"}`} onClick={() => setMode("register")}>Register</button>
              </div>
            </div>

            <form className="mt-5 space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
              {mode === "register" ? (
                <div>
                  <Label className="text-sm">Name</Label>
                  <Input className="mt-1.5 h-9 text-sm" placeholder="John Doe" {...form.register("name")} />
                  <p className="mt-1 text-xs text-destructive">{form.formState.errors.name?.message}</p>
                </div>
              ) : null}

              <div>
                <Label className="text-sm">User Role</Label>
                <div className="mt-1.5 grid grid-cols-2 gap-2">
                  <button type="button" onClick={() => form.setValue("role", "admin")} className={`h-9 rounded-md border text-sm ${form.watch("role") === "admin" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-300"}`}>Admin</button>
                  <button type="button" onClick={() => form.setValue("role", "sales")} className={`h-9 rounded-md border text-sm ${form.watch("role") === "sales" ? "border-blue-600 bg-blue-50 text-blue-700" : "border-slate-300"}`}>Sales</button>
                </div>
              </div>
              <div>
                <Label className="text-sm">Email Address</Label>
                <Input className="mt-1.5 h-9 text-sm" placeholder="name@company.com" {...form.register("email")} />
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.email?.message}</p>
              </div>
              <div>
                <div className="flex items-center justify-between"><Label className="text-sm">Password</Label></div>
                <div className="relative mt-1.5"><Input className="h-9 pr-10 text-sm" type={showPassword ? "text" : "password"} {...form.register("password")} /><button className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500" type="button" onClick={() => setShowPassword((v) => !v)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div>
                <p className="mt-1 text-xs text-destructive">{form.formState.errors.password?.message}</p>
              </div>
              <Button className="h-9 w-full text-sm" disabled={submitting} type="submit">{submitting ? "Please wait..." : mode === "login" ? "Sign In" : "Register"} {!submitting && <ArrowRight className="ml-1.5 h-4 w-4" />}</Button>
            </form>
          </div>
        </section>
      </div>
    </main>
  );
}

