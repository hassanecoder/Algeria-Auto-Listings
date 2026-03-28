import { Link, useLocation } from "wouter";
import { Car, Plus, Menu, X, Scale } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/lib/store";

export function Navbar() {
  const [location] = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { selectedCars } = useCompareStore();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Annonces", path: "/listings" },
    { name: "Marques", path: "/brands" },
  ];

  const isHome = location === "/";
  const transparent = isHome && !isScrolled;

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b ${
        transparent 
          ? "bg-transparent border-transparent text-white" 
          : "bg-background/80 backdrop-blur-lg border-border text-foreground shadow-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <div className={`p-2 rounded-xl transition-colors ${transparent ? 'bg-white/20' : 'bg-primary/10'}`}>
              <img 
                src={`${import.meta.env.BASE_URL}images/logo.png`} 
                alt="DZ Cars Logo" 
                className="w-8 h-8 object-contain hidden" 
              />
              <Car className={`w-7 h-7 ${transparent ? 'text-white' : 'text-primary'}`} />
            </div>
            <span className={`text-2xl font-display font-black tracking-tight ${transparent ? 'text-white' : 'text-foreground'}`}>
              DZ<span className={transparent ? 'text-white/80' : 'text-primary'}>Cars</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link 
                key={link.path} 
                href={link.path}
                className={`font-medium text-sm transition-colors hover:text-primary ${
                  location === link.path 
                    ? (transparent ? "text-white font-bold" : "text-primary font-bold") 
                    : (transparent ? "text-white/80" : "text-muted-foreground")
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="hidden md:flex items-center gap-4">
            <Link href="/compare">
              <Button 
                variant="ghost" 
                size="sm" 
                className={`relative ${transparent ? 'text-white hover:bg-white/10 hover:text-white' : ''}`}
              >
                <Scale className="w-4 h-4 mr-2" />
                Comparer
                {selectedCars.length > 0 && (
                  <span className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                    {selectedCars.length}
                  </span>
                )}
              </Button>
            </Link>
            <Link href="/post-ad">
              <Button className={`rounded-full font-bold shadow-lg transition-transform hover:-translate-y-0.5 ${
                transparent 
                  ? 'bg-white text-primary hover:bg-white/90 shadow-white/10' 
                  : 'bg-primary hover:bg-primary/90 shadow-primary/25'
              }`}>
                <Plus className="w-4 h-4 mr-2" />
                Déposer une annonce
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Toggle */}
          <button 
            className="md:hidden p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <X className={transparent ? 'text-white' : 'text-foreground'} />
            ) : (
              <Menu className={transparent ? 'text-white' : 'text-foreground'} />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-20 left-0 right-0 bg-background border-b border-border shadow-lg p-4 flex flex-col gap-4 animate-in slide-in-from-top-2">
          {navLinks.map((link) => (
            <Link 
              key={link.path} 
              href={link.path}
              onClick={() => setMobileMenuOpen(false)}
              className={`p-3 rounded-lg font-medium text-center ${
                location === link.path ? "bg-primary/10 text-primary" : "text-foreground"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <div className="h-px bg-border my-2" />
          <Link href="/compare" onClick={() => setMobileMenuOpen(false)}>
            <Button variant="outline" className="w-full justify-center">
              <Scale className="w-4 h-4 mr-2" />
              Comparer ({selectedCars.length})
            </Button>
          </Link>
          <Link href="/post-ad" onClick={() => setMobileMenuOpen(false)}>
            <Button className="w-full justify-center rounded-xl bg-primary">
              <Plus className="w-4 h-4 mr-2" />
              Déposer une annonce
            </Button>
          </Link>
        </div>
      )}
    </header>
  );
}
