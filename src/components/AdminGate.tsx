import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface AdminGateProps {
  children: React.ReactNode;
}

const SESSION_KEY = "admin_authenticated";

export function AdminGate({ children }: AdminGateProps) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem(SESSION_KEY) === "true"
  );
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("verify-admin", {
        body: { password },
      });
      if (error) throw error;
      if (data.valid) {
        sessionStorage.setItem(SESSION_KEY, "true");
        setAuthenticated(true);
      } else {
        toast.error("Incorrect password");
      }
    } catch {
      toast.error("Failed to verify password");
    } finally {
      setLoading(false);
    }
  };

  if (authenticated) return <>{children}</>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm space-y-6 rounded-2xl border bg-card p-8 shadow-lg"
      >
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-accent-gradient">
            <Lock className="h-7 w-7 text-accent-foreground" />
          </div>
          <h1 className="font-display text-2xl font-bold">Admin Access</h1>
          <p className="text-sm text-muted-foreground text-center">
            Enter the admin password to continue
          </p>
        </div>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoFocus
        />
        <Button
          type="submit"
          disabled={loading || !password}
          className="w-full bg-accent-gradient text-accent-foreground font-semibold hover:opacity-90"
        >
          {loading ? "Verifying…" : "Enter Dashboard"}
        </Button>
      </form>
    </div>
  );
}
