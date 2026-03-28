import { useParams, Link } from "wouter";
import useEmblaCarousel from "embla-carousel-react";
import { 
  ChevronLeft, ChevronRight, MapPin, Calendar, Gauge, Fuel, 
  Settings, PaintBucket, DoorClosed, Users, Zap, Phone, 
  Heart, Share2, AlertTriangle, ShieldCheck
} from "lucide-react";
import { useGetListingById, useGetSimilarListings } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CarCard } from "@/components/car/CarCard";
import { MOCK_LISTINGS } from "@/lib/mock-data";
import { useState, useCallback } from "react";

export default function ListingDetail() {
  const { id } = useParams();
  const listingId = parseInt(id || "1", 10);
  
  const { data, isLoading, isError } = useGetListingById(listingId);
  const { data: similarData } = useGetSimilarListings(listingId);

  const listing = data || MOCK_LISTINGS.find(l => l.id === listingId) || MOCK_LISTINGS[0];
  const similarListings = similarData || MOCK_LISTINGS.filter(l => l.id !== listingId).slice(0, 3);

  const [mainViewportRef, emblaMainApi] = useEmblaCarousel({ loop: true });
  const [thumbViewportRef, emblaThumbApi] = useEmblaCarousel({ containScroll: "keep", dragFree: true });
  const [selectedIndex, setSelectedIndex] = useState(0);

  const scrollPrev = useCallback(() => emblaMainApi && emblaMainApi.scrollPrev(), [emblaMainApi]);
  const scrollNext = useCallback(() => emblaMainApi && emblaMainApi.scrollNext(), [emblaMainApi]);
  const scrollTo = useCallback((index: number) => emblaMainApi && emblaMainApi.scrollTo(index), [emblaMainApi]);

  const onSelect = useCallback(() => {
    if (!emblaMainApi || !emblaThumbApi) return;
    setSelectedIndex(emblaMainApi.selectedScrollSnap());
    emblaThumbApi.scrollTo(emblaMainApi.selectedScrollSnap());
  }, [emblaMainApi, emblaThumbApi, setSelectedIndex]);

  // Attach event listener
  if (emblaMainApi) emblaMainApi.on("select", onSelect);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(price).replace('DZD', 'DA');
  };

  const images = listing.images.length > 0 ? listing.images : [`${import.meta.env.BASE_URL}images/placeholder-car.png`];

  if (isLoading) {
    return <div className="min-h-screen pt-24 pb-12 flex items-center justify-center">Chargement...</div>;
  }

  return (
    <div className="min-h-screen bg-muted/20 pt-20 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Breadcrumbs */}
        <div className="flex items-center text-sm text-muted-foreground mb-6 overflow-x-auto whitespace-nowrap pb-2">
          <Link href="/" className="hover:text-primary transition-colors">Accueil</Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0" />
          <Link href="/listings" className="hover:text-primary transition-colors">Annonces</Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0" />
          <Link href={`/listings?brand=${listing.brand}`} className="hover:text-primary transition-colors">{listing.brand}</Link>
          <ChevronRight className="w-4 h-4 mx-2 shrink-0" />
          <span className="text-foreground font-medium truncate">{listing.title}</span>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Main Content (Left) */}
          <div className="w-full lg:w-2/3 space-y-6">
            
            {/* Header Mobile */}
            <div className="lg:hidden mb-4">
              <div className="flex gap-2 mb-2">
                <Badge variant="outline" className="bg-card">{listing.year}</Badge>
                <Badge className="bg-primary hover:bg-primary">{listing.condition}</Badge>
              </div>
              <h1 className="text-2xl font-display font-black text-foreground">{listing.title}</h1>
              <div className="text-2xl font-black text-primary mt-2">{formatPrice(listing.price)}</div>
            </div>

            {/* Carousel */}
            <div className="bg-card p-2 rounded-3xl border border-border shadow-sm">
              <div className="relative rounded-2xl overflow-hidden bg-muted aspect-[4/3] md:aspect-[16/9]">
                <div className="overflow-hidden h-full" ref={mainViewportRef}>
                  <div className="flex h-full">
                    {images.map((img, index) => (
                      <div className="flex-[0_0_100%] min-w-0 h-full relative" key={index}>
                        <img 
                          src={img} 
                          alt={`${listing.title} - Image ${index + 1}`} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                
                {images.length > 1 && (
                  <>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10 backdrop-blur-sm border border-white/20"
                      onClick={scrollPrev}
                    >
                      <ChevronLeft className="w-6 h-6" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white rounded-full h-10 w-10 backdrop-blur-sm border border-white/20"
                      onClick={scrollNext}
                    >
                      <ChevronRight className="w-6 h-6" />
                    </Button>
                    <div className="absolute bottom-4 left-1/2 -translate-y-1/2 flex gap-1.5 bg-black/30 px-3 py-1.5 rounded-full backdrop-blur-sm">
                      {images.map((_, i) => (
                        <div key={i} className={`w-2 h-2 rounded-full transition-all ${i === selectedIndex ? 'bg-white w-4' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
              
              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="overflow-hidden mt-2" ref={thumbViewportRef}>
                  <div className="flex gap-2">
                    {images.map((img, index) => (
                      <button
                        key={index}
                        onClick={() => scrollTo(index)}
                        className={`flex-[0_0_20%] min-w-0 aspect-[4/3] rounded-xl overflow-hidden relative cursor-pointer transition-all ${
                          index === selectedIndex ? 'ring-2 ring-primary ring-offset-2' : 'opacity-60 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Quick Specs Grid */}
            <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
              <h2 className="text-xl font-bold font-display mb-4">Caractéristiques principales</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted/50">
                  <Calendar className="w-5 h-5 text-primary mb-1" />
                  <span className="text-sm text-muted-foreground">Année</span>
                  <span className="font-bold text-foreground">{listing.year}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted/50">
                  <Gauge className="w-5 h-5 text-primary mb-1" />
                  <span className="text-sm text-muted-foreground">Kilométrage</span>
                  <span className="font-bold text-foreground">{listing.mileage.toLocaleString('fr-DZ')} km</span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted/50">
                  <Fuel className="w-5 h-5 text-primary mb-1" />
                  <span className="text-sm text-muted-foreground">Carburant</span>
                  <span className="font-bold text-foreground">{listing.fuelType}</span>
                </div>
                <div className="flex flex-col gap-1 p-3 rounded-xl bg-muted/50">
                  <Settings className="w-5 h-5 text-primary mb-1" />
                  <span className="text-sm text-muted-foreground">Boîte</span>
                  <span className="font-bold text-foreground">{listing.transmission}</span>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-card rounded-3xl p-6 md:p-8 border border-border shadow-sm">
              <h2 className="text-xl font-bold font-display mb-4">Description</h2>
              <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                {listing.description}
              </div>
              
              <Separator className="my-8" />

              <h2 className="text-xl font-bold font-display mb-6">Spécifications techniques</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-2"><PaintBucket className="w-4 h-4"/> Couleur</span>
                  <span className="font-medium">{listing.color}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-2"><DoorClosed className="w-4 h-4"/> Portes</span>
                  <span className="font-medium">{listing.doors}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-2"><Users className="w-4 h-4"/> Places</span>
                  <span className="font-medium">{listing.seats}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-2"><Zap className="w-4 h-4"/> Puissance</span>
                  <span className="font-medium">{listing.power ? `${listing.power} ch` : '-'}</span>
                </div>
                <div className="flex justify-between py-2 border-b border-border/50">
                  <span className="text-muted-foreground flex items-center gap-2"><Settings className="w-4 h-4"/> Moteur</span>
                  <span className="font-medium">{listing.engineSize || '-'}</span>
                </div>
              </div>

              {listing.features && listing.features.length > 0 && (
                <>
                  <h3 className="font-bold text-foreground mt-8 mb-4">Équipements & Options</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {listing.features.map((feature, i) => (
                      <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                        {feature}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

          </div>

          {/* Sidebar (Right) */}
          <div className="w-full lg:w-1/3">
            <div className="sticky top-28 space-y-6">
              
              {/* Price & Title Desktop */}
              <div className="hidden lg:block bg-card rounded-3xl p-6 border border-border shadow-lg shadow-black/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-bl-full -z-10" />
                <div className="flex gap-2 mb-3">
                  <Badge variant="outline">{listing.year}</Badge>
                  <Badge className="bg-primary hover:bg-primary">{listing.condition}</Badge>
                </div>
                <h1 className="text-2xl font-display font-black text-foreground mb-4 leading-tight">{listing.title}</h1>
                <div className="text-3xl font-black text-primary mb-6">{formatPrice(listing.price)}</div>
                
                <div className="flex gap-3">
                  <Button className="flex-1 rounded-xl h-12 text-md font-bold shadow-lg shadow-primary/25">
                    <Phone className="w-5 h-5 mr-2" /> Contacter
                  </Button>
                  <Button variant="outline" size="icon" className="h-12 w-12 rounded-xl shrink-0">
                    <Heart className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Seller Card */}
              <div className="bg-card rounded-3xl p-6 border border-border shadow-sm">
                <h3 className="font-bold mb-4 font-display text-lg">Informations du vendeur</h3>
                
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 rounded-full bg-primary/10 text-primary flex items-center justify-center font-display font-bold text-xl uppercase border-2 border-primary/20">
                    {listing.sellerName.charAt(0)}
                  </div>
                  <div>
                    <div className="font-bold text-foreground text-lg">{listing.sellerName}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      {listing.sellerType === 'Professionnel' ? <ShieldCheck className="w-4 h-4 text-green-500" /> : null}
                      {listing.sellerType}
                    </div>
                  </div>
                </div>

                <div className="space-y-4 bg-muted/30 p-4 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0 border border-border shadow-sm">
                      <Phone className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Numéro de téléphone</div>
                      <div className="font-bold text-foreground text-lg tracking-wide">{listing.sellerPhone}</div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-background flex items-center justify-center shrink-0 border border-border shadow-sm">
                      <MapPin className="w-4 h-4 text-primary" />
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Localisation</div>
                      <div className="font-medium text-foreground">{listing.city}, {listing.wilaya}</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    <Share2 className="w-4 h-4 mr-2" /> Partager
                  </Button>
                  <Button variant="ghost" size="sm" className="text-destructive hover:bg-destructive/10 hover:text-destructive">
                    <AlertTriangle className="w-4 h-4 mr-2" /> Signaler
                  </Button>
                </div>
              </div>

              {/* Safety Tips */}
              <div className="bg-primary/5 rounded-3xl p-6 border border-primary/10">
                <h4 className="font-bold text-primary flex items-center gap-2 mb-3">
                  <ShieldCheck className="w-5 h-5" /> Conseils de sécurité
                </h4>
                <ul className="text-sm text-muted-foreground space-y-2 list-disc list-inside pl-1">
                  <li>Ne payez jamais d'avance par transfert d'argent.</li>
                  <li>Vérifiez toujours l'état du véhicule en personne.</li>
                  <li>Exigez les documents originaux (Carte grise, contrôle technique).</li>
                </ul>
              </div>

            </div>
          </div>
        </div>

        {/* Similar Listings */}
        {similarListings.length > 0 && (
          <div className="mt-20">
            <h2 className="text-2xl font-display font-bold text-foreground mb-6">Annonces similaires</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similarListings.map(l => (
                <CarCard key={l.id} listing={l} />
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
