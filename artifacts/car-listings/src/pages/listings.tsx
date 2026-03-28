import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Filter, X, SlidersHorizontal, Search } from "lucide-react";
import { useGetListings, GetListingsParams } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CarCard } from "@/components/car/CarCard";
import { MOCK_LISTINGS, MOCK_BRANDS, MOCK_WILAYAS } from "@/lib/mock-data";

export default function ListingsPage() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  
  // Parse initial state from URL
  const [filters, setFilters] = useState<GetListingsParams>({
    brand: searchParams.get("brand") || undefined,
    model: searchParams.get("model") || undefined,
    wilaya: searchParams.get("wilaya") || undefined,
    fuelType: searchParams.get("fuelType") || undefined,
    transmission: searchParams.get("transmission") || undefined,
    condition: searchParams.get("condition") || undefined,
    search: searchParams.get("search") || undefined,
    sort: "newest"
  });

  const [priceRange, setPriceRange] = useState([0, 10000000]);
  const [yearRange, setYearRange] = useState([1990, new Date().getFullYear()]);
  const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

  // Use the API hook
  const { data, isLoading, isError } = useGetListings(filters);

  // Fallback to mock data if error or loading
  const listings = data?.listings || MOCK_LISTINGS;
  const total = data?.total || MOCK_LISTINGS.length;

  const updateFilter = (key: keyof GetListingsParams, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value === "all" ? undefined : value }));
  };

  const clearFilters = () => {
    setFilters({ sort: "newest" });
    setPriceRange([0, 10000000]);
    setYearRange([1990, new Date().getFullYear()]);
  };

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    updateFilter("search", formData.get("search"));
  };

  const formatPrice = (val: number) => {
    if (val >= 1000000) return `${(val / 1000000).toFixed(1)}M DA`;
    return `${(val / 1000).toFixed(0)}k DA`;
  };

  return (
    <div className="min-h-screen bg-muted/20 pt-20 pb-20">
      
      {/* Top Search Bar & Header */}
      <div className="bg-background border-b border-border py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-display font-bold text-foreground">Recherche de véhicules</h1>
              <p className="text-muted-foreground mt-1">{total.toLocaleString('fr-DZ')} véhicules trouvés</p>
            </div>

            <form onSubmit={handleSearch} className="flex items-center gap-2 max-w-md w-full">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                <Input 
                  name="search"
                  placeholder="Rechercher (ex: Clio 4, Golf...)" 
                  defaultValue={filters.search}
                  className="pl-10 h-12 rounded-xl bg-muted/50 border-transparent focus-visible:bg-background"
                />
              </div>
              <Button type="submit" className="h-12 rounded-xl bg-primary font-bold">
                Chercher
              </Button>
            </form>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Mobile Filters Toggle */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <Button onClick={() => setIsMobileFiltersOpen(true)} variant="outline" className="w-full">
              <Filter className="w-4 h-4 mr-2" />
              Filtres
            </Button>
          </div>

          {/* Sidebar Filters */}
          <aside className={`
            lg:w-1/4 shrink-0 
            ${isMobileFiltersOpen ? 'fixed inset-0 z-50 bg-background overflow-y-auto p-4' : 'hidden lg:block'}
          `}>
            <div className="sticky top-28 bg-card rounded-2xl border border-border p-5 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-bold font-display flex items-center gap-2">
                  <SlidersHorizontal className="w-5 h-5 text-primary" /> Filtres
                </h2>
                {isMobileFiltersOpen ? (
                  <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)}>
                    <X className="w-5 h-5" />
                  </Button>
                ) : (
                  <button onClick={clearFilters} className="text-sm text-primary hover:underline font-medium">
                    Réinitialiser
                  </button>
                )}
              </div>

              <Accordion type="multiple" defaultValue={["brand", "price", "location"]} className="w-full space-y-4">
                
                <AccordionItem value="brand" className="border-border/50 rounded-xl px-2">
                  <AccordionTrigger className="hover:no-underline font-semibold py-3 text-base">Marque & Modèle</AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Marque</Label>
                        <Select value={filters.brand || "all"} onValueChange={(v) => updateFilter("brand", v)}>
                          <SelectTrigger className="rounded-lg">
                            <SelectValue placeholder="Toutes" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="all">Toutes</SelectItem>
                            {MOCK_BRANDS.map(b => (
                              <SelectItem key={b.slug} value={b.name}>{b.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Modèle</Label>
                        <Input 
                          placeholder="Ex: Clio" 
                          value={filters.model || ""}
                          onChange={(e) => updateFilter("model", e.target.value)}
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="price" className="border-border/50 rounded-xl px-2">
                  <AccordionTrigger className="hover:no-underline font-semibold py-3 text-base">Prix (DA)</AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <div className="space-y-6 pt-2">
                      <Slider
                        defaultValue={[0, 10000000]}
                        max={20000000}
                        step={100000}
                        value={priceRange}
                        onValueChange={setPriceRange}
                        onValueCommit={(val) => {
                          updateFilter("priceMin", val[0]);
                          updateFilter("priceMax", val[1]);
                        }}
                        className="w-full"
                      />
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>{formatPrice(priceRange[0])}</span>
                        <span>{formatPrice(priceRange[1])}</span>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="location" className="border-border/50 rounded-xl px-2">
                  <AccordionTrigger className="hover:no-underline font-semibold py-3 text-base">Localisation</AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4">
                    <Select value={filters.wilaya || "all"} onValueChange={(v) => updateFilter("wilaya", v)}>
                      <SelectTrigger className="rounded-lg">
                        <SelectValue placeholder="Toute l'Algérie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toute l'Algérie</SelectItem>
                        {MOCK_WILAYAS.map(w => (
                          <SelectItem key={w.code} value={w.name}>{w.code} - {w.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </AccordionContent>
                </AccordionItem>

                <AccordionItem value="specs" className="border-border/50 rounded-xl px-2">
                  <AccordionTrigger className="hover:no-underline font-semibold py-3 text-base">Caractéristiques</AccordionTrigger>
                  <AccordionContent className="pt-2 pb-4 space-y-4">
                    <div className="space-y-2">
                      <Label>Carburant</Label>
                      <Select value={filters.fuelType || "all"} onValueChange={(v) => updateFilter("fuelType", v)}>
                        <SelectTrigger className="rounded-lg"><SelectValue placeholder="Tous" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Tous</SelectItem>
                          <SelectItem value="Essence">Essence</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="GPL">GPL</SelectItem>
                          <SelectItem value="Hybride">Hybride</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Boîte de vitesse</Label>
                      <Select value={filters.transmission || "all"} onValueChange={(v) => updateFilter("transmission", v)}>
                        <SelectTrigger className="rounded-lg"><SelectValue placeholder="Toutes" /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Toutes</SelectItem>
                          <SelectItem value="Manuelle">Manuelle</SelectItem>
                          <SelectItem value="Automatique">Automatique</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </AccordionContent>
                </AccordionItem>

              </Accordion>

              {isMobileFiltersOpen && (
                <Button className="w-full mt-6" size="lg" onClick={() => setIsMobileFiltersOpen(false)}>
                  Voir {total} résultats
                </Button>
              )}
            </div>
          </aside>

          {/* Main Content */}
          <main className="flex-1">
            
            {/* Sort & active filters */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
              <div className="flex flex-wrap gap-2">
                {Object.entries(filters).map(([key, value]) => {
                  if (!value || key === 'sort' || key === 'page' || key === 'limit') return null;
                  return (
                    <span key={key} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium border border-primary/20">
                      {key === 'priceMin' ? 'Prix Min: ' : ''}
                      {key === 'priceMax' ? 'Prix Max: ' : ''}
                      {value}
                      <button onClick={() => updateFilter(key as any, undefined)} className="hover:text-primary-foreground hover:bg-primary rounded-full p-0.5 ml-1 transition-colors">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  );
                })}
              </div>

              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm font-medium text-muted-foreground">Trier par:</span>
                <Select value={filters.sort || "newest"} onValueChange={(v) => updateFilter("sort", v)}>
                  <SelectTrigger className="w-[180px] bg-card">
                    <SelectValue placeholder="Plus récentes" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Plus récentes</SelectItem>
                    <SelectItem value="price_asc">Prix croissant</SelectItem>
                    <SelectItem value="price_desc">Prix décroissant</SelectItem>
                    <SelectItem value="year_desc">Année (plus récente)</SelectItem>
                    <SelectItem value="mileage_asc">Kilométrage croissant</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Grid */}
            {isLoading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array(6).fill(0).map((_, i) => (
                  <div key={i} className="animate-pulse bg-card rounded-2xl h-96 border border-border"></div>
                ))}
              </div>
            ) : listings.length === 0 ? (
              <div className="text-center py-20 bg-card rounded-2xl border border-border">
                <Search className="w-16 h-16 text-muted-foreground/30 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-foreground">Aucun résultat trouvé</h3>
                <p className="text-muted-foreground mt-2">Essayez de modifier vos critères de recherche.</p>
                <Button variant="outline" className="mt-6" onClick={clearFilters}>
                  Effacer les filtres
                </Button>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {listings.map((listing) => (
                    <CarCard key={listing.id} listing={listing} />
                  ))}
                </div>
                
                {/* Pagination (Mock) */}
                <div className="mt-12 flex justify-center">
                  <div className="flex gap-2">
                    <Button variant="outline" disabled>Précédent</Button>
                    <Button variant="default" className="bg-primary text-white">1</Button>
                    <Button variant="outline">2</Button>
                    <Button variant="outline">3</Button>
                    <Button variant="outline">Suivant</Button>
                  </div>
                </div>
              </>
            )}

          </main>
        </div>
      </div>
    </div>
  );
}
