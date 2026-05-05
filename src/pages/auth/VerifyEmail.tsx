import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeyLogo } from "@/components/HomeyLogo";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const VerifyEmail = () => {
  const { state } = useLocation() as { state?: { email?: string } };
  const email = state?.email;

  const resend = async () => {
    if (!email) return;
    const { error } = await supabase.auth.resend({ type: "signup", email });
    if (error) toast.error(error.message);
    else toast.success("Verification email sent!");
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center px-6 py-10">
      <div className="w-full max-w-md text-center animate-fade-in">
        <HomeyLogo className="h-16 w-16 mx-auto" />
        <div className="bg-card rounded-3xl shadow-soft p-8 mt-6">
          <div className="h-20 w-20 rounded-full bg-gradient-primary flex items-center justify-center mx-auto mb-6 shadow-glow">
            <Mail className="h-10 w-10 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold mb-2">Verify your email</h1>
          <p className="text-muted-foreground mb-6">
            We sent a verification link to {email ? <strong>{email}</strong> : "your email"}. Click it to activate your account.
          </p>
          <div className="space-y-3">
            <Button onClick={resend} variant="outline" className="w-full h-12">Resend email</Button>
            <Link to="/login"><Button className="w-full h-12 bg-gradient-primary shadow-soft">Back to login</Button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;