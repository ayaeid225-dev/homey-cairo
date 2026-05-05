import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { HomeyLogo } from "@/components/HomeyLogo";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

const PhoneAuth = () => {
  const navigate = useNavigate();
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [stage, setStage] = useState<"phone" | "otp">("phone");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ phone });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Code sent to your phone");
    setStage("otp");
  };

  const verify = async () => {
    setLoading(true);
    const { error } = await supabase.auth.verifyOtp({ phone, token: otp, type: "sms" });
    setLoading(false);
    if (error) { toast.error(error.message); return; }
    toast.success("Signed in!");
    navigate("/home", { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col px-6 py-10">
      <Link to="/login" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
        <ArrowLeft className="h-4 w-4 mr-1" /> Back
      </Link>
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-md animate-fade-in">
          <div className="flex flex-col items-center mb-6">
            <HomeyLogo className="h-16 w-16" />
            <h1 className="text-2xl font-bold mt-4">{stage === "phone" ? "Sign in with phone" : "Enter code"}</h1>
            <p className="text-muted-foreground text-sm mt-1 text-center">
              {stage === "phone" ? "We'll text you a verification code" : "Sent to " + phone}
            </p>
          </div>

          <div className="bg-card rounded-3xl shadow-soft p-6">
            {stage === "phone" ? (
              <form onSubmit={sendOtp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone number</Label>
                  <Input id="phone" type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="h-12" placeholder="+20 100 000 0000" />
                </div>
                <Button type="submit" disabled={loading} className="w-full h-12 bg-gradient-primary shadow-soft">
                  {loading ? "Sending..." : "Send code"}
                </Button>
              </form>
            ) : (
              <div className="space-y-5">
                <div className="flex justify-center">
                  <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                    <InputOTPGroup>
                      {[0,1,2,3,4,5].map(i => <InputOTPSlot key={i} index={i} />)}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                <Button onClick={verify} disabled={loading || otp.length < 6} className="w-full h-12 bg-gradient-primary shadow-soft">
                  {loading ? "Verifying..." : "Verify"}
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => setStage("phone")}>Change number</Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PhoneAuth;
