import { Link, useLocation, useNavigate } from "react-router-dom";
import { HomeyLogo } from "@/components/HomeyLogo";
import { Button } from "@/components/ui/button";
import { Home, Search, Heart, MessageCircle, User, LogOut } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const tabs = [
  { to: "/home", label: "Home", icon: Home },
  { to: "/listings", label: "Search", icon: Search },
  { to: "/saved", label: "Saved", icon: Heart },
  { to: "/contracts", label: "Contracts", icon: MessageCircle },
];

export const AppShell = ({ children }: { children: React.ReactNode }) => {
  const { pathname } = useLocation();
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-soft pb-20 md:pb-6">
      <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-lg border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/home" className="flex items-center gap-2">
            <HomeyLogo className="h-9 w-9" />
            <span className="font-bold text-lg hidden sm:inline">Homey</span>
          </Link>
          <nav className="hidden md:flex items-center gap-1">
            {tabs.map((t) => {
              const Icon = t.icon;
              const active = pathname === t.to || (t.to !== "/home" && pathname.startsWith(t.to));
              return (
                <Link key={t.to} to={t.to} className={`px-4 py-2 rounded-full text-sm font-medium flex items-center gap-2 transition-smooth ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary"}`}>
                  <Icon className="h-4 w-4" />{t.label}
                </Link>
              );
            })}
          </nav>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground hidden sm:inline">{user?.email}</span>
            <Button variant="ghost" size="icon" onClick={async () => { await signOut(); navigate("/login"); }}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">{children}</main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border z-40">
        <div className="flex justify-around py-2">
          {tabs.map((t) => {
            const Icon = t.icon;
            const active = pathname === t.to || (t.to !== "/home" && pathname.startsWith(t.to));
            return (
              <Link key={t.to} to={t.to} className={`flex flex-col items-center gap-1 px-3 py-2 ${active ? "text-primary" : "text-muted-foreground"}`}>
                <Icon className="h-5 w-5" />
                <span className="text-[10px] font-medium">{t.label}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};