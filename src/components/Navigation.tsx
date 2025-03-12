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
      <div className="container flex h-16 items-center space-x-4 sm:justify-between sm:space-x-0">
        <Link to="/" className="hidden font-bold sm:block">
          Affirmation App
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
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
          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="sm" className="px-2">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="sm:max-w-xs">
              <SheetHeader>
                <SheetTitle>Menu</SheetTitle>
                <SheetDescription>
                  Navigate through the app and manage your account.
                </SheetDescription>
              </SheetHeader>
              <div className="divide-y divide-border space-y-2 py-4">
                {navigation.map((item) => (
                  <Link
                    key={item.href}
                    to={item.href}
                    className="block py-2 text-sm font-medium transition-colors hover:text-primary"
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
                      className="block py-2 text-sm font-medium transition-colors hover:text-primary"
                      onClick={() => setOpen(false)}
                    >
                      {item.name}
                    </Link>
                  ))}
              </div>
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
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
