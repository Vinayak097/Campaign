
import { Bell, Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="border-b bg-blue-500">
      

      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5 " />
          </Button>
          <Link to="/" className="flex items-center gap-2">
            <div className="font-bold text-xl bg-gradient-to-r from-brand-purple to-brand-darkPurple bg-clip-text text-transparent">OutreachAlchemy</div>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-5 text-sm">
          <Link to="/" className="font-medium hover:text-brand-purple transition-colors">
            Dashboard
          </Link>
          <Link to="/campaigns" className="font-medium hover:text-brand-purple transition-colors">
            Campaigns
          </Link>
          <Link to="/message-generator" className="font-medium hover:text-brand-purple transition-colors">
            Message Generator
          </Link>
        </nav>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon">
            <Bell className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  );
};

export default Header;