import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Search, MapPin, CarFront, Gauge, ArrowRight, Activity, ShieldCheck, Zap } from "lucide-react";
import { useGetFeaturedListings, useGetStats } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CarCard } from "@/components/car/CarCard";
import { MOCK_LISTINGS, MOCK_STATS, MOCK_BRANDS } from "@/lib/mock-data";

export default function Home() {
  const [, setLocation] = useLocation();
  const [searchBrand, setSearchBrand] = useState("");
  const [searchWilaya, setSearchWilaya] = useState("");

  const { data: featuredData, isLoading: loadingFeatured } = useGetFeaturedListings();
  const { data: statsData } = useGetStats();

  const featuredListings = featuredData || MOCK_LISTINGS.filter(l => l.isFeatured);
  const stats = statsData || MOCK_STATS;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchBrand && searchBrand !== "all") params.append("brand", searchBrand);
    if (searchWilaya && searchWilaya !== "all") params.append("wilaya", searchWilaya);
    setLocation(`/listings?${params.toString()}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      
      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden flex items-center justify-center min-h-[80vh]">
        <div className="absolute inset-0 z-0">
          <img 
            src={`${import.meta.env.BASE_URL}images/hero-bg.png`} 
            alt="Hero Background" 
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/60 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center md:text-left">
          <div className="max-w-3xl animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <span className="inline-block py-1 px-3 rounded-full bg-primary/20 text-primary border border-primary/30 text-sm font-bold tracking-wider mb-6">
              #1 EN ALGÉRIE
            </span>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-display font-black text-white leading-[1.1] mb-6 tracking-tight">
              Trouvez la voiture <br className="hidden md:block"/>
              de vos <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-500">rêves</span>.
            </h1>
            <p className="text-lg md:text-xl text-white/70 mb-10 max-w-2xl font-light">
              Des milliers de véhicules neufs et d'occasion vous attendent. Recherchez, comparez et contactez les vendeurs en quelques clics.
            </p>

            {/* Search Box */}
            <div className="bg-white/10 backdrop-blur-xl p-4 rounded-3xl border border-white/20 shadow-2xl max-w-4xl mx-auto md:mx-0">
              <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3">
                <div className="flex-1">
                  <Select onValueChange={setSearchBrand}>
                    <SelectTrigger className="h-14 bg-white/90 border-0 rounded-2xl text-lg px-4">
                      <div className="flex items-center gap-3">
                        <CarFront className="w-5 h-5 text-primary" />
                        <SelectValue placeholder="Toutes les marques" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les marques</SelectItem>
                      {MOCK_BRANDS.map(b => (
                        <SelectItem key={b.slug} value={b.name}>{b.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="flex-1">
                  <Select onValueChange={setSearchWilaya}>
                    <SelectTrigger className="h-14 bg-white/90 border-0 rounded-2xl text-lg px-4">
                      <div className="flex items-center gap-3">
                        <MapPin className="w-5 h-5 text-primary" />
                        <SelectValue placeholder="Toutes les wilayas" />
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Toutes les wilayas</SelectItem>
                      <SelectItem value="Alger">Alger</SelectItem>
                      <SelectItem value="Oran">Oran</SelectItem>
                      <SelectItem value="Constantine">Constantine</SelectItem>
                      <SelectItem value="Annaba">Annaba</SelectItem>
                      <SelectItem value="Blida">Blida</SelectItem>
                      <SelectItem value="Sétif">Sétif</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" size="lg" className="h-14 px-8 rounded-2xl bg-primary hover:bg-primary/90 text-lg font-bold text-white shadow-lg shadow-primary/30 w-full md:w-auto">
                  <Search className="w-5 h-5 mr-2" />
                  Rechercher
                </Button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* STATS SECTION */}
      <section className="py-12 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 divide-x divide-border">
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-black font-display text-foreground">{stats.totalListings.toLocaleString('fr-DZ')}</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium uppercase tracking-wider">Annonces</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-black font-display text-foreground">{stats.totalBrands}</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium uppercase tracking-wider">Marques</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-black font-display text-foreground">{stats.totalWilayas}</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium uppercase tracking-wider">Wilayas</div>
            </div>
            <div className="text-center px-4">
              <div className="text-3xl md:text-4xl font-black font-display text-primary">+{stats.newThisWeek}</div>
              <div className="text-sm text-muted-foreground mt-1 font-medium uppercase tracking-wider">Cette Semaine</div>
            </div>
          </div>
        </div>
      </section>

      {/* POPULAR BRANDS */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Marques Populaires</h2>
              <p className="text-muted-foreground mt-2">Explorez les véhicules des meilleures marques en Algérie</p>
            </div>
            <Link href="/brands">
              <Button variant="ghost" className="hidden sm:flex text-primary font-semibold group">
                Voir tout <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {MOCK_BRANDS.slice(0, 12).map((brand) => (
              <Link key={brand.slug} href={`/listings?brand=${brand.name}`}>
                <div className="bg-card border border-border/50 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 hover:shadow-lg hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group">
                  <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    {/* Placeholder for brand logo */}
                    <span className="font-display font-bold text-xl text-muted-foreground group-hover:text-primary">{brand.name.charAt(0)}</span>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-foreground">{brand.name}</div>
                    <div className="text-xs text-muted-foreground">{brand.count} annonces</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURED LISTINGS */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-display font-bold text-foreground">Annonces En Vedette</h2>
              <p className="text-muted-foreground mt-2">Les meilleures offres sélectionnées pour vous</p>
            </div>
            <Link href="/listings">
              <Button variant="ghost" className="hidden sm:flex text-primary font-semibold group">
                Parcourir <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {loadingFeatured ? (
              Array(4).fill(0).map((_, i) => (
                <div key={i} className="animate-pulse bg-muted rounded-2xl h-80"></div>
              ))
            ) : (
              featuredListings.slice(0, 4).map((listing) => (
                <CarCard key={listing.id} listing={listing} />
              ))
            )}
          </div>
          
          <div className="mt-10 text-center sm:hidden">
            <Link href="/listings">
              <Button variant="outline" size="lg" className="w-full">
                Voir toutes les annonces
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* WHY CHOOSE US */}
      <section className="py-24 bg-secondary text-secondary-foreground">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-white mb-4">Pourquoi choisir DZ Cars ?</h2>
            <p className="text-secondary-foreground/70 text-lg">La plateforme la plus fiable pour l'achat et la vente de véhicules en Algérie.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                <ShieldCheck className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Annonces Vérifiées</h3>
              <p className="text-secondary-foreground/70">Toutes nos annonces sont modérées pour éviter les fraudes et garantir une expérience sécurisée.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                <Activity className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Le plus grand choix</h3>
              <p className="text-secondary-foreground/70">Des milliers de nouveaux véhicules ajoutés chaque semaine à travers les 58 wilayas.</p>
            </div>
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6">
                <Zap className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Vente Rapide</h3>
              <p className="text-secondary-foreground/70">Vendez votre voiture plus rapidement grâce à notre large audience d'acheteurs potentiels.</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
