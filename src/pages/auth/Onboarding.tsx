import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { HomeyLogo } from "@/components/HomeyLogo";
import { ShieldCheck, Users, Wrench } from "lucide-react";

const slides = [
  {
    icon: ShieldCheck,
    title: "Verified Listings",
    desc: "No more scams or unclear ads. Every property is reviewed and verified by our team before going live.",
  },
  {
    icon: Users,
    title: "AI Roommate Matching",
    desc: "Find compatible roommates based on lifestyle, study habits, and preferences — powered by smart matching.",
  },
  {
    icon: Wrench,
    title: "Trusted Local Services",
    desc: "Cleaning, internet, moving, maintenance — all from verified providers near your new home.",
  },
];

const Onboarding = () => {
  const [i, setI] = useState(0);
  const navigate = useNavigate();
  const Icon = slides[i].icon;

  const finish = () => {
    localStorage.setItem("homey_onboarded", "1");
    navigate("/signup");
  };

  return (
    <div className="min-h-screen bg-gradient-soft flex flex-col">
      <div className="flex justify-between items-center p-6">
        <HomeyLogo className="h-10 w-10" />
        <button onClick={finish} className="text-sm text-muted-foreground hover:text-foreground transition-smooth">
          Skip
        </button>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-8 text-center">
        <div key={i} className="animate-fade-in">
          <div className="w-32 h-32 rounded-full bg-gradient-primary flex items-center justify-center mx-auto shadow-elegant mb-8">
            <Icon className="h-16 w-16 text-primary-foreground" strokeWidth={1.5} />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-4">{slides[i].title}</h2>
          <p className="text-muted-foreground text-lg max-w-md leading-relaxed">{slides[i].desc}</p>
        </div>
      </div>

      <div className="flex justify-center gap-2 mb-8">
        {slides.map((_, idx) => (
          <div
            key={idx}
            className={`h-2 rounded-full transition-smooth ${idx === i ? "w-8 bg-primary" : "w-2 bg-muted"}`}
          />
        ))}
      </div>

      <div className="px-8 pb-10 space-y-3">
        <Button
          size="lg"
          className="w-full h-14 text-base bg-gradient-primary hover:opacity-90 shadow-elegant"
          onClick={() => (i < slides.length - 1 ? setI(i + 1) : finish())}
        >
          {i < slides.length - 1 ? "Next" : "Get Started"}
        </Button>
        {i > 0 && (
          <Button variant="ghost" size="lg" className="w-full" onClick={() => setI(i - 1)}>
            Back
          </Button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;