import { useState, type FormEvent } from "react";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { navigate } from "@/components/AppLink";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAdminSession } from "../AdminSession";
import { toast } from "sonner";

export function AdminLoginPage() {
  const { login } = useAdminSession();
  const [email, setEmail] = useState("admin@gurukulclasses.com");
  const [password, setPassword] = useState("admin123");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Logged in successfully");
      navigate("/admin");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.32),_transparent_30%),linear-gradient(180deg,#020617_0%,#0f172a_55%,#111827_100%)] px-4 py-10 text-white">
      <div className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="max-w-xl">
          <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-300">
            Gurukul admin access
          </p>
          <h1 className="mt-4 text-4xl font-extrabold tracking-tight md:text-6xl">
            Manage the whole website from one place.
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-white/75">
            Update hero banners, results, gallery images, press releases and blogs without touching
            the public design.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {["JWT protected login", "Image and PDF uploads", "Instant live updates"].map(
              (item) => (
                <div
                  key={item}
                  className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-white/80"
                >
                  {item}
                </div>
              ),
            )}
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/10 bg-white/95 p-6 text-slate-950 shadow-2xl shadow-slate-950/40 md:p-8">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.3em] text-sky-700">Sign in</p>
            <h2 className="mt-2 text-2xl font-extrabold tracking-tight">Admin Login</h2>
          </div>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="pl-9"
                  placeholder="admin@gurukulclasses.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <div className="relative">
                <KeyRound className="pointer-events-none absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  className="pl-9"
                  placeholder="admin123"
                  required
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full gap-2 rounded-xl bg-slate-950 text-white hover:bg-slate-800"
              disabled={loading}
            >
              {loading ? "Signing in..." : "Login to Dashboard"}
              <ArrowRight className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
