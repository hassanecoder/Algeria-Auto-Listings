import { Listing } from "@workspace/api-client-react";
import { MapPin, Calendar, Gauge, Fuel, Check } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/lib/store";

interface CarCardProps {
  listing: Listing;
}

export function CarCard({ listing }: CarCardProps) {
  const { selectedCars, addCar, removeCar } = useCompareStore();
  const isCompared = selectedCars.some((c) => c.id === listing.id);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(price).replace('DZD', 'DA');
  };

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent navigating to detail page
    if (isCompared) {
      removeCar(listing.id);
    } else {
      addCar(listing);
    }
  };

  return (
    <Link href={`/listings/${listing.id}`}>
      <div className="group bg-card rounded-2xl overflow-hidden border border-border/50 shadow-sm hover:shadow-xl hover:border-primary/30 transition-all duration-300 flex flex-col h-full cursor-pointer">
        
        {/* Image Section */}
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img 
            src={listing.images[0] || `${import.meta.env.BASE_URL}images/placeholder-car.png`} 
            alt={`${listing.brand} ${listing.model}`}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `${import.meta.env.BASE_URL}images/placeholder-car.png`;
            }}
          />
          
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {listing.isFeatured && (
              <Badge className="bg-primary text-white hover:bg-primary font-bold shadow-md">
                En vedette
              </Badge>
            )}
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-md text-foreground shadow-sm">
              {listing.condition}
            </Badge>
          </div>

          <div className="absolute bottom-3 right-3">
            <Button 
              size="sm" 
              variant={isCompared ? "default" : "secondary"}
              className={`h-8 rounded-full shadow-md backdrop-blur-md ${!isCompared ? 'bg-background/90 text-foreground hover:bg-primary hover:text-white' : ''}`}
              onClick={handleCompareClick}
            >
              {isCompared ? <Check className="w-3 h-3 mr-1" /> : <Plus className="w-3 h-3 mr-1" />}
              {isCompared ? "Comparé" : "Comparer"}
            </Button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-5 flex flex-col flex-grow">
          <div className="flex justify-between items-start gap-2 mb-2">
            <h3 className="font-display font-bold text-lg text-foreground line-clamp-2 leading-tight group-hover:text-primary transition-colors">
              {listing.brand} {listing.model}
            </h3>
          </div>
          
          <div className="text-xl font-black text-primary mb-4">
            {formatPrice(listing.price)}
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4 mt-auto">
            <div className="flex items-center text-sm text-muted-foreground gap-1.5">
              <Calendar className="w-4 h-4 text-muted-foreground/70" />
              <span>{listing.year}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-1.5">
              <Gauge className="w-4 h-4 text-muted-foreground/70" />
              <span>{listing.mileage.toLocaleString('fr-DZ')} km</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-1.5">
              <Fuel className="w-4 h-4 text-muted-foreground/70" />
              <span className="truncate">{listing.fuelType}</span>
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-1.5">
              <MapPin className="w-4 h-4 text-muted-foreground/70" />
              <span className="truncate">{listing.wilaya}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-border flex justify-between items-center mt-auto">
            <span className="text-xs text-muted-foreground truncate">
              {listing.sellerType}
            </span>
            <span className="text-xs text-muted-foreground/70">
              il y a 2 j
            </span>
          </div>
        </div>

      </div>
    </Link>
  );
}

// Dummy Plus icon since it wasn't imported at the top
import { Plus } from "lucide-react";
