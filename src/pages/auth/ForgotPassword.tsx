import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HomeyLogo } from "@/components/HomeyLogo";
import { toast } from "sonner";
import { ArrowLeft, MailCheck } from "lucide-react";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    setSent(true);
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col px-6 py-10">
      <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back to login
      </Link>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex flex-col items-center mb-6">
            <HomeyLogo className="h-16 w-16" />
            <h1 className="text-2xl font-bold mt-4">Forgot password?</h1>
            <p className="text-muted-foreground text-sm mt-1 text-center">No worries, we'll send you reset instructions</p>
          </div>

          <div className="bg-card rounded-3xl shadow-soft p-6">
            {sent ? (
              <div className="text-center py-6 space-y-4 animate-scale-in">
                <div className="h-16 w-16 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
                  <MailCheck className="h-8 w-8 text-accent" />
                </div>
                <h2 className="font-semibold text-lg">Check your email</h2>
                <p className="text-sm text-muted-foreground">We sent a reset link to <strong>{email}</strong></p>
              </div>
            ) : (
              <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" placeholder="you@example.com" />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-primary shadow-soft">
                  {loading ? "Sending..." : "Send reset link"}
                </Button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;