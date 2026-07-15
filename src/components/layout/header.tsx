"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Rocket, Heart, History, Briefcase, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "./theme-toggle";

const navigation = [
  { name: "Home", href: "/" },
  { name: "Pokedex", href: "/pokedex" },
  { name: "Collections", href: "/collections", icon: Briefcase },
  { name: "Living Dex", href: "/living-dex", icon: Sparkles },
  { name: "Favorites", href: "/favorites", icon: Heart },
  { name: "Recent", href: "/recent", icon: History },
  { name: "Team Builder", href: "/team-builder" },
  { name: "Battle", href: "/battle" },
  { name: "Quiz", href: "/quiz" },
  { name: "Settings", href: "/settings" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center space-x-2">
            <Rocket className="h-6 w-6 text-primary" />
            <span className="inline-block font-bold tracking-tight sm:text-xl">
              Pokemon Galaxy
            </span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex md:items-center md:gap-x-8">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href
                  ? "text-foreground"
                  : "text-muted-foreground"
              )}
            >
              {item.icon && <item.icon className={cn("h-4 w-4", pathname === item.href ? "fill-primary text-primary" : "")} />}
              {item.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex">
            <ThemeToggle />
          </div>
          <button
            className="inline-flex items-center justify-center rounded-md p-2.5 text-muted-foreground md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {mobileMenuOpen ? (
              <X className="h-6 w-6" aria-hidden="true" />
            ) : (
              <Menu className="h-6 w-6" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="border-b border-border md:hidden">
          <div className="space-y-1 px-4 pb-3 pt-2">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "flex items-center gap-3 rounded-md px-3 py-2 text-base font-medium",
                  pathname === item.href
                    ? "bg-accent text-accent-foreground"
                    : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                )}
                onClick={() => setMobileMenuOpen(false)}
              >
                {item.icon && <item.icon className={cn("h-5 w-5", pathname === item.href ? "fill-primary text-primary" : "")} />}
                {item.name}
              </Link>
            ))}
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-base font-medium text-muted-foreground">
                Theme
              </span>
              <ThemeToggle />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
