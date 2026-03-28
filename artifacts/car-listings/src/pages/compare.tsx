import { Link } from "wouter";
import { Plus, X, ArrowLeft, Check, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCompareStore } from "@/lib/store";

export default function ComparePage() {
  const { selectedCars, removeCar, clearCars } = useCompareStore();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-DZ', {
      style: 'currency',
      currency: 'DZD',
      maximumFractionDigits: 0
    }).format(price).replace('DZD', 'DA');
  };

  const getFeatureStatus = (features: string[] | undefined, featureToFind: string) => {
    if (!features) return <Minus className="w-5 h-5 mx-auto text-muted-foreground/30" />;
    return features.includes(featureToFind) ? (
      <Check className="w-5 h-5 mx-auto text-green-500" />
    ) : (
      <Minus className="w-5 h-5 mx-auto text-muted-foreground/30" />
    );
  };

  const commonFeatures = [
    "Climatisation automatique", "Toit ouvrant", "Radar de recul", 
    "Caméra de recul", "Sièges en cuir", "Écran tactile", 
    "Bluetooth", "Régulateur de vitesse"
  ];

  return (
    <div className="min-h-screen bg-muted/20 pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Link href="/listings" className="text-sm text-muted-foreground hover:text-primary flex items-center">
                <ArrowLeft className="w-4 h-4 mr-1" /> Retour aux annonces
              </Link>
            </div>
            <h1 className="text-3xl font-display font-black text-foreground">Comparer des véhicules</h1>
            <p className="text-muted-foreground mt-1">Sélectionnez jusqu'à 3 véhicules pour les comparer côte à côte.</p>
          </div>
          
          {selectedCars.length > 0 && (
            <Button variant="outline" onClick={clearCars} className="text-destructive hover:bg-destructive/10 hover:text-destructive border-destructive/20">
              Tout effacer
            </Button>
          )}
        </div>

        {selectedCars.length === 0 ? (
          <div className="bg-card rounded-3xl border border-border border-dashed p-16 text-center shadow-sm">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
              <Plus className="w-10 h-10 text-muted-foreground" />
            </div>
            <h3 className="text-2xl font-bold font-display text-foreground mb-3">Aucun véhicule sélectionné</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-8">
              Parcourez nos annonces et cliquez sur "Comparer" pour ajouter des véhicules ici.
            </p>
            <Link href="/listings">
              <Button size="lg" className="rounded-xl font-bold bg-primary text-white shadow-lg shadow-primary/25 hover:bg-primary/90 hover:-translate-y-0.5 transition-transform">
                Trouver des véhicules
              </Button>
            </Link>
          </div>
        ) : (
          <div className="bg-card rounded-3xl border border-border shadow-sm overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="w-1/4 p-6 border-b border-border bg-muted/30 align-bottom">
                    <div className="font-bold text-lg text-foreground">Caractéristiques</div>
                  </th>
                  {selectedCars.map((car) => (
                    <th key={car.id} className="w-1/4 p-6 border-b border-l border-border relative align-top">
                      <button 
                        onClick={() => removeCar(car.id)}
                        className="absolute top-4 right-4 w-8 h-8 bg-background border border-border rounded-full flex items-center justify-center text-muted-foreground hover:text-destructive hover:border-destructive hover:bg-destructive/10 transition-colors z-10 shadow-sm"
                      >
                        <X className="w-4 h-4" />
                      </button>
                      <div className="aspect-[4/3] rounded-xl overflow-hidden bg-muted mb-4">
                        <img 
                          src={car.images[0] || `${import.meta.env.BASE_URL}images/placeholder-car.png`} 
                          alt={car.title} 
                          className="w-full h-full object-cover" 
                        />
                      </div>
                      <div className="font-bold font-display text-lg text-foreground mb-1 leading-tight line-clamp-2">{car.title}</div>
                      <div className="text-xl font-black text-primary mb-4">{formatPrice(car.price)}</div>
                      <Link href={`/listings/${car.id}`}>
                        <Button className="w-full rounded-lg h-10 shadow-md shadow-primary/10">Voir l'annonce</Button>
                      </Link>
                    </th>
                  ))}
                  {/* Fill empty columns if less than 3 cars */}
                  {Array.from({ length: 3 - selectedCars.length }).map((_, i) => (
                    <th key={`empty-${i}`} className="w-1/4 p-6 border-b border-l border-border border-dashed align-middle text-center bg-muted/5">
                      <div className="flex flex-col items-center opacity-50">
                        <div className="w-16 h-16 rounded-full border-2 border-dashed border-muted-foreground flex items-center justify-center mb-3">
                          <Plus className="w-6 h-6 text-muted-foreground" />
                        </div>
                        <span className="font-medium text-muted-foreground">Ajouter un véhicule</span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="text-sm">
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-b border-border font-medium text-muted-foreground bg-muted/30">Marque & Modèle</td>
                  {selectedCars.map(car => <td key={car.id} className="p-4 border-b border-l border-border font-semibold">{car.brand} {car.model}</td>)}
                  {Array.from({ length: 3 - selectedCars.length }).map((_, i) => <td key={`e1-${i}`} className="p-4 border-b border-l border-border border-dashed"></td>)}
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-b border-border font-medium text-muted-foreground bg-muted/30">Année</td>
                  {selectedCars.map(car => <td key={car.id} className="p-4 border-b border-l border-border">{car.year}</td>)}
                  {Array.from({ length: 3 - selectedCars.length }).map((_, i) => <td key={`e2-${i}`} className="p-4 border-b border-l border-border border-dashed"></td>)}
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-b border-border font-medium text-muted-foreground bg-muted/30">Kilométrage</td>
                  {selectedCars.map(car => <td key={car.id} className="p-4 border-b border-l border-border">{car.mileage.toLocaleString('fr-DZ')} km</td>)}
                  {Array.from({ length: 3 - selectedCars.length }).map((_, i) => <td key={`e3-${i}`} className="p-4 border-b border-l border-border border-dashed"></td>)}
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-b border-border font-medium text-muted-foreground bg-muted/30">Carburant</td>
                  {selectedCars.map(car => <td key={car.id} className="p-4 border-b border-l border-border">{car.fuelType}</td>)}
                  {Array.from({ length: 3 - selectedCars.length }).map((_, i) => <td key={`e4-${i}`} className="p-4 border-b border-l border-border border-dashed"></td>)}
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-b border-border font-medium text-muted-foreground bg-muted/30">Boîte de vitesse</td>
                  {selectedCars.map(car => <td key={car.id} className="p-4 border-b border-l border-border">{car.transmission}</td>)}
                  {Array.from({ length: 3 - selectedCars.length }).map((_, i) => <td key={`e5-${i}`} className="p-4 border-b border-l border-border border-dashed"></td>)}
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-b border-border font-medium text-muted-foreground bg-muted/30">État</td>
                  {selectedCars.map(car => <td key={car.id} className="p-4 border-b border-l border-border">{car.condition}</td>)}
                  {Array.from({ length: 3 - selectedCars.length }).map((_, i) => <td key={`e6-${i}`} className="p-4 border-b border-l border-border border-dashed"></td>)}
                </tr>
                <tr className="hover:bg-muted/10 transition-colors">
                  <td className="p-4 border-b border-border font-medium text-muted-foreground bg-muted/30">Moteur / Puissance</td>
                  {selectedCars.map(car => <td key={car.id} className="p-4 border-b border-l border-border">{car.engineSize || '-'} {car.power ? `(${car.power}ch)` : ''}</td>)}
                  {Array.from({ length: 3 - selectedCars.length }).map((_, i) => <td key={`e7-${i}`} className="p-4 border-b border-l border-border border-dashed"></td>)}
                </tr>
                
                {/* Options section header */}
                <tr>
                  <td colSpan={4} className="p-4 bg-muted/50 font-bold text-foreground text-center border-b border-border">Équipements</td>
                </tr>

                {commonFeatures.map((feature) => (
                  <tr key={feature} className="hover:bg-muted/10 transition-colors">
                    <td className="p-4 border-b border-border font-medium text-muted-foreground bg-muted/30">{feature}</td>
                    {selectedCars.map(car => (
                      <td key={`${car.id}-${feature}`} className="p-4 border-b border-l border-border text-center">
                        {getFeatureStatus(car.features, feature)}
                      </td>
                    ))}
                    {Array.from({ length: 3 - selectedCars.length }).map((_, i) => (
                      <td key={`ef-${feature}-${i}`} className="p-4 border-b border-l border-border border-dashed text-center">
                         <Minus className="w-5 h-5 mx-auto text-muted-foreground/10" />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}
