import logo from "@/assets/homey-logo.png";

export const HomeyLogo = ({ className = "h-20 w-20" }: { className?: string }) => (
  <img src={logo} alt="Homey - Find. Connect. Live Easy." className={className} />
);