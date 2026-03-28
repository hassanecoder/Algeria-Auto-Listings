import { Link } from "wouter";
import { ArrowRight, Search } from "lucide-react";
import { useGetBrands } from "@workspace/api-client-react";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { MOCK_BRANDS } from "@/lib/mock-data";

export default function BrandsPage() {
  const { data, isLoading } = useGetBrands();
  const [searchTerm, setSearchTerm] = useState("");

  const brands = data || MOCK_BRANDS;
  
  const filteredBrands = brands.filter(b => 
    b.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (b.country && b.country.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-muted/20 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-display font-black text-foreground mb-3">Toutes les marques</h1>
            <p className="text-muted-foreground text-lg">Parcourez notre catalogue par constructeur automobile.</p>
          </div>
          
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input 
              placeholder="Rechercher une marque..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-12 rounded-xl bg-card shadow-sm border-border"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array(15).fill(0).map((_, i) => (
              <div key={i} className="animate-pulse bg-card rounded-2xl h-32 border border-border"></div>
            ))}
          </div>
        ) : filteredBrands.length === 0 ? (
          <div className="text-center py-20 bg-card rounded-3xl border border-border">
            <h3 className="text-xl font-bold text-foreground">Aucune marque trouvée</h3>
            <p className="text-muted-foreground mt-2">Essayez un autre terme de recherche.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
            {filteredBrands.map((brand) => (
              <Link key={brand.slug} href={`/listings?brand=${brand.name}`}>
                <div className="bg-card border border-border/50 rounded-3xl p-6 flex flex-col items-center justify-center gap-4 hover:shadow-xl hover:shadow-black/5 hover:border-primary/30 hover:-translate-y-1 transition-all duration-300 cursor-pointer group h-full">
                  <div className="w-20 h-20 bg-muted/50 rounded-2xl flex items-center justify-center group-hover:bg-primary/10 transition-colors shadow-inner">
                    <span className="font-display font-black text-3xl group-hover:text-primary transition-colors">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-center w-full">
                    <div className="font-bold text-foreground text-lg mb-1 truncate">{brand.name}</div>
                    <div className="text-sm text-primary font-medium bg-primary/10 px-2 py-0.5 rounded-full inline-block">
                      {brand.count.toLocaleString('fr-DZ')} véhicules
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
