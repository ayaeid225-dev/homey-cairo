import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HomeyLogo } from "@/components/HomeyLogo";
import { SocialAuthButtons } from "@/components/SocialAuthButtons";
import { toast } from "sonner";
import { GraduationCap, Home, Wrench, Eye, EyeOff } from "lucide-react";

type Role = "student" | "landlord" | "service_provider";

const roles: { value: Role; label: string; desc: string; icon: typeof Home }[] = [
  { value: "student", label: "Student", desc: "Find housing & roommates", icon: GraduationCap },
  { value: "landlord", label: "Landlord", desc: "List your properties", icon: Home },
  { value: "service_provider", label: "Service Provider", desc: "Offer your services", icon: Wrench },
];

const Signup = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [role, setRole] = useState<Role>("student");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: `${window.location.origin}/home`,
        data: { full_name: fullName, role },
      },
    });
    setLoading(false);
    if (error) {
      toast.error(error.message);
      return;
    }
    toast.success("Account created! Check your email to verify.");
    navigate("/verify-email", { state: { email } });
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex flex-col items-center mb-6">
            <HomeyLogo className="h-16 w-16" />
            <h1 className="text-2xl font-bold mt-4">Create your account</h1>
            <p className="text-muted-foreground text-sm mt-1">Step {step} of 2</p>
          </div>

          <div className="bg-card rounded-3xl shadow-soft p-6 space-y-5">
            {step === 1 ? (
              <>
                <p className="text-sm font-medium text-foreground">I am a...</p>
                <div className="space-y-3">
                  {roles.map((r) => {
                    const Icon = r.icon;
                    const active = role === r.value;
                    return (
                      <button
                        key={r.value}
                        onClick={() => setRole(r.value)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-smooth text-left ${
                          active ? "border-primary bg-secondary shadow-soft" : "border-border hover:border-primary/40"
                        }`}
                      >
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center ${active ? "bg-gradient-primary" : "bg-muted"}`}>
                          <Icon className={`h-6 w-6 ${active ? "text-primary-foreground" : "text-muted-foreground"}`} />
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold">{r.label}</div>
                          <div className="text-xs text-muted-foreground">{r.desc}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
                <Button className="w-full h-12 bg-gradient-primary shadow-soft" onClick={() => setStep(2)}>
                  Continue
                </Button>
              </>
            ) : (
              <>
                <form onSubmit={submit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full name</Label>
                    <Input id="name" required value={fullName} onChange={(e) => setFullName(e.target.value)} className="h-12" placeholder="Ahmed Hassan" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="h-12" placeholder="you@example.com" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <div className="relative">
                      <Input id="password" type={show ? "text" : "password"} required minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 pr-10" placeholder="At least 6 characters" />
                      <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                        {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                  </div>
                  <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-primary shadow-soft">
                    {loading ? "Creating account..." : "Create Account"}
                  </Button>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center"><span className="w-full border-t" /></div>
                  <div className="relative flex justify-center text-xs uppercase"><span className="bg-card px-2 text-muted-foreground">Or sign up with</span></div>
                </div>
                <SocialAuthButtons />
                <Button variant="ghost" className="w-full" onClick={() => setStep(1)}>← Back to role</Button>
              </>
            )}
          </div>

          <p className="text-center text-sm text-muted-foreground mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-primary font-semibold hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;