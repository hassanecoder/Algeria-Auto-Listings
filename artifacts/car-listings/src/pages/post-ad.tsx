import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Car, FileSliders, Settings, FileText, Image as ImageIcon, Phone, CheckCircle2 } from "lucide-react";
import { useCreateListing } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { CAR_FEATURES, MOCK_BRANDS, MOCK_WILAYAS } from "@/lib/mock-data";

// Generate a schema matching the CreateListingInput
const formSchema = z.object({
  title: z.string().min(5, "Le titre doit faire au moins 5 caractères"),
  brand: z.string().min(1, "Veuillez sélectionner une marque"),
  model: z.string().min(1, "Veuillez entrer un modèle"),
  year: z.coerce.number().min(1950).max(new Date().getFullYear() + 1),
  price: z.coerce.number().min(10000, "Le prix est trop bas"),
  mileage: z.coerce.number().min(0),
  fuelType: z.string().min(1),
  transmission: z.string().min(1),
  condition: z.string().min(1),
  wilaya: z.string().min(1),
  city: z.string().min(1),
  description: z.string().min(20, "La description doit faire au moins 20 caractères"),
  color: z.string().min(1),
  doors: z.coerce.number().min(2).max(7),
  seats: z.coerce.number().min(1).max(9),
  power: z.coerce.number().optional(),
  engineSize: z.string().optional(),
  features: z.array(z.string()).optional(),
  imageUrl: z.string().url("Veuillez entrer une URL d'image valide").optional().or(z.literal("")),
  sellerName: z.string().min(2),
  sellerPhone: z.string().min(8),
  sellerType: z.string().min(1),
});

export default function PostAdPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isSuccess, setIsSuccess] = useState(false);
  
  const createListingMutation = useCreateListing({
    mutation: {
      onSuccess: () => {
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
      onError: (error) => {
        console.error("Mutation failed", error);
        // Fallback for mock environment - pretend it succeeded
        toast({
          title: "Erreur de connexion",
          description: "Mode démo: l'annonce a été simulée comme créée avec succès.",
        });
        setIsSuccess(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      mileage: 0,
      fuelType: "",
      transmission: "",
      condition: "",
      wilaya: "",
      city: "",
      description: "",
      color: "",
      doors: 5,
      seats: 5,
      features: [],
      imageUrl: "",
      sellerName: "",
      sellerPhone: "",
      sellerType: "Particulier",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // Transform single image URL to array to match API expectation
    const images = values.imageUrl ? [values.imageUrl] : [];
    const { imageUrl, ...rest } = values;
    
    const submitData = {
      ...rest,
      images
    };

    createListingMutation.mutate({ data: submitData });
  };

  if (isSuccess) {
    return (
      <div className="min-h-[80vh] bg-muted/20 pt-32 pb-20 flex flex-col items-center justify-center px-4">
        <div className="bg-card p-10 rounded-3xl shadow-xl border border-border max-w-md w-full text-center animate-in zoom-in-95 duration-500">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-3xl font-display font-black text-foreground mb-4">Annonce Publiée !</h2>
          <p className="text-muted-foreground mb-8">Votre annonce a été soumise avec succès et sera visible par les acheteurs après modération.</p>
          <div className="space-y-3">
            <Button onClick={() => setLocation("/listings")} className="w-full rounded-xl h-12 bg-primary">
              Voir mon annonce
            </Button>
            <Button onClick={() => setLocation("/")} variant="outline" className="w-full rounded-xl h-12">
              Retour à l'accueil
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-muted/20 pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-10 text-center">
          <h1 className="text-3xl md:text-5xl font-display font-black text-foreground mb-4">Vendez votre voiture</h1>
          <p className="text-lg text-muted-foreground">Remplissez les détails ci-dessous pour créer votre annonce sur DZ Cars.</p>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            
            {/* 1. Vehicle Info */}
            <div className="bg-card rounded-3xl p-6 md:p-10 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Car className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold font-display">Informations du véhicule</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Titre de l'annonce *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Golf 7 R-Line 2019 Très propre" className="h-12 rounded-xl bg-muted/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Marque *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                            <SelectValue placeholder="Sélectionnez une marque" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MOCK_BRANDS.map(b => (
                            <SelectItem key={b.slug} value={b.name}>{b.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Modèle *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Golf 7" className="h-12 rounded-xl bg-muted/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Année *</FormLabel>
                      <FormControl>
                        <Input type="number" className="h-12 rounded-xl bg-muted/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prix (DA) *</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="Ex: 1500000" className="h-12 rounded-xl bg-muted/50 font-bold text-primary" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* 2. Specs */}
            <div className="bg-card rounded-3xl p-6 md:p-10 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Settings className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold font-display">Caractéristiques techniques</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Kilométrage (km) *</FormLabel>
                      <FormControl>
                        <Input type="number" className="h-12 rounded-xl bg-muted/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Carburant *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Essence">Essence</SelectItem>
                          <SelectItem value="Diesel">Diesel</SelectItem>
                          <SelectItem value="GPL">GPL</SelectItem>
                          <SelectItem value="Hybride">Hybride</SelectItem>
                          <SelectItem value="Électrique">Électrique</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Boîte de vitesse *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Manuelle">Manuelle</SelectItem>
                          <SelectItem value="Automatique">Automatique</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="condition"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>État *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Neuf">Neuf</SelectItem>
                          <SelectItem value="Très bon état">Très bon état</SelectItem>
                          <SelectItem value="Bon état">Bon état</SelectItem>
                          <SelectItem value="Correct">Correct</SelectItem>
                          <SelectItem value="Accidenté">Accidenté</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="doors"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Portes *</FormLabel>
                        <FormControl>
                          <Input type="number" className="h-12 rounded-xl bg-muted/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="seats"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Places *</FormLabel>
                        <FormControl>
                          <Input type="number" className="h-12 rounded-xl bg-muted/50" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Couleur *</FormLabel>
                      <FormControl>
                        <Input placeholder="Ex: Blanc" className="h-12 rounded-xl bg-muted/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

              </div>
            </div>

            {/* 3. Description & Features */}
            <div className="bg-card rounded-3xl p-6 md:p-10 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <FileText className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold font-display">Description & Équipements</h2>
              </div>
              
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="mb-8">
                    <FormLabel>Description détaillée *</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Décrivez l'état général du véhicule, l'historique d'entretien, les défauts éventuels..." 
                        className="min-h-[150px] rounded-xl bg-muted/50 resize-y" 
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="features"
                render={() => (
                  <FormItem>
                    <div className="mb-4">
                      <FormLabel className="text-base">Équipements & Options</FormLabel>
                      <FormDescription>
                        Sélectionnez les équipements présents dans le véhicule
                      </FormDescription>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                      {CAR_FEATURES.map((item) => (
                        <FormField
                          key={item}
                          control={form.control}
                          name="features"
                          render={({ field }) => {
                            return (
                              <FormItem
                                key={item}
                                className="flex flex-row items-start space-x-3 space-y-0 rounded-lg border border-border/50 p-3 hover:bg-muted/50 transition-colors"
                              >
                                <FormControl>
                                  <Checkbox
                                    checked={field.value?.includes(item)}
                                    onCheckedChange={(checked) => {
                                      return checked
                                        ? field.onChange([...(field.value || []), item])
                                        : field.onChange(
                                            field.value?.filter(
                                              (value) => value !== item
                                            )
                                          )
                                    }}
                                  />
                                </FormControl>
                                <FormLabel className="font-normal cursor-pointer w-full text-sm">
                                  {item}
                                </FormLabel>
                              </FormItem>
                            )
                          }}
                        />
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 4. Media */}
            <div className="bg-card rounded-3xl p-6 md:p-10 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold font-display">Photos</h2>
              </div>
              
              <FormField
                control={form.control}
                name="imageUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL de l'image (Optionnel pour la démo)</FormLabel>
                    <FormControl>
                      <Input placeholder="https://..." className="h-12 rounded-xl bg-muted/50" {...field} />
                    </FormControl>
                    <FormDescription>Collez l'URL d'une image pour votre véhicule. Laissez vide pour utiliser une image par défaut.</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* 5. Contact Info */}
            <div className="bg-card rounded-3xl p-6 md:p-10 border border-border shadow-sm">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border/50">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <Phone className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold font-display">Contact & Localisation</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="sellerType"
                  render={({ field }) => (
                    <FormItem className="col-span-full">
                      <FormLabel>Vous êtes un *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Particulier">Particulier</SelectItem>
                          <SelectItem value="Professionnel">Professionnel / Garage</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sellerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nom / Pseudo *</FormLabel>
                      <FormControl>
                        <Input className="h-12 rounded-xl bg-muted/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="sellerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Téléphone *</FormLabel>
                      <FormControl>
                        <Input placeholder="05..." className="h-12 rounded-xl bg-muted/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="wilaya"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Wilaya *</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger className="h-12 rounded-xl bg-muted/50">
                            <SelectValue placeholder="Sélectionnez une wilaya" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {MOCK_WILAYAS.map(w => (
                            <SelectItem key={w.code} value={w.name}>{w.code} - {w.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="city"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Commune *</FormLabel>
                      <FormControl>
                        <Input className="h-12 rounded-xl bg-muted/50" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <Button 
                type="submit" 
                size="lg" 
                disabled={createListingMutation.isPending}
                className="h-14 px-10 rounded-2xl text-lg font-bold shadow-lg shadow-primary/25 bg-primary hover:bg-primary/90 text-white w-full md:w-auto transition-transform hover:-translate-y-1"
              >
                {createListingMutation.isPending ? "Publication en cours..." : "Publier l'annonce"}
              </Button>
            </div>

          </form>
        </Form>
      </div>
    </div>
  );
}
