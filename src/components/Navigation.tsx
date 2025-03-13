
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/components/auth/AuthProvider";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";

export function Navigation() {
  const [open, setOpen] = useState(false);
  const { logout, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/auth");
  };

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Pricing", href: "/#pricing" },
  ];

  const userNavigation = [
    { name: "Profile", href: "/profile" },
    { name: "Dashboard", href: "/dashboard" },
  ];

  return (
    <header className="bg-background sticky top-0 z-50 w-full border-b">
      <div className="container-custom flex h-16 items-center justify-between">
        <Link to="/" className="font-bold text-lg sm:text-xl">
          Affirmation App
        </Link>
        <div className="flex items-center space-x-4">
          <nav className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.href}
                to={item.href}
                className="text-sm font-medium transition-colors hover:text-primary"
              >
                {item.name}
              </Link>
            ))}
            {isAuthenticated &&
              userNavigation.map((item) => (
                <Link
                  key={item.href}
                  to={item.href}
                  className="text-sm font-medium transition-colors hover:text-primary"
                >
                  {item.name}
                </Link>
              ))}
          </nav>
          <div className="hidden md:block">
            {isAuthenticated ? (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Log Out
              </Button>
            ) : (
              <Link to="/auth">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            )}
          </div>
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="px-2">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80vw] sm:max-w-sm">
              <SheetHeader className="text-left">
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through the app and manage your account.
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-6 py-6">
                <div className="flex flex-col space-y-3">
                  {navigation.map((item) => (
                    <Link
                      key={item.href}
                      to={item.href}
                      className="text-base font-medium transition-colors hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
                  {isAuthenticated &&
                    userNavigation.map((item) => (
                      <Link
                        key={item.href}
                        to={item.href}
                        className="text-base font-medium transition-colors hover:text-primary"
                        onClick={() => setOpen(false)}
                      >
                        {item.name}
                      </Link>
                    ))}
                </div>
                <div className="pt-4">
                  {isAuthenticated ? (
                    <Button variant="default" size="default" onClick={handleLogout} className="w-full">
                      Log Out
                    </Button>
                  ) : (
                    <Link to="/auth" className="w-full" onClick={() => setOpen(false)}>
                      <Button variant="default" size="default" className="w-full">
                        Sign In
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
