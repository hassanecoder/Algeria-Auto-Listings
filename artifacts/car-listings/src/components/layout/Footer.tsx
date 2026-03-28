import { Car, Facebook, Instagram, Twitter, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "wouter";

export function Footer() {
  return (
    <footer className="bg-secondary text-secondary-foreground pt-16 pb-8 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 group inline-flex">
              <div className="bg-primary p-2 rounded-xl">
                <Car className="w-6 h-6 text-white" />
              </div>
              <span className="text-2xl font-display font-black tracking-tight text-white">
                DZ<span className="text-primary">Cars</span>
              </span>
            </Link>
            <p className="text-secondary-foreground/70 text-sm leading-relaxed mt-4">
              Le premier portail automobile en Algérie. Achetez, vendez et comparez des véhicules neufs et d'occasion en toute sécurité.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-primary transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-white">Liens rapides</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="text-secondary-foreground/70 hover:text-white transition-colors">Accueil</Link></li>
              <li><Link href="/listings" className="text-secondary-foreground/70 hover:text-white transition-colors">Toutes les annonces</Link></li>
              <li><Link href="/brands" className="text-secondary-foreground/70 hover:text-white transition-colors">Marques populaires</Link></li>
              <li><Link href="/post-ad" className="text-secondary-foreground/70 hover:text-white transition-colors">Déposer une annonce</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-white">Catégories</h3>
            <ul className="space-y-3">
              <li><Link href="/listings?condition=Neuf" className="text-secondary-foreground/70 hover:text-white transition-colors">Voitures Neuves</Link></li>
              <li><Link href="/listings?condition=Occasion" className="text-secondary-foreground/70 hover:text-white transition-colors">Voitures d'occasion</Link></li>
              <li><Link href="/listings?bodyType=SUV" className="text-secondary-foreground/70 hover:text-white transition-colors">SUV & 4x4</Link></li>
              <li><Link href="/listings?bodyType=Utilitaire" className="text-secondary-foreground/70 hover:text-white transition-colors">Véhicules utilitaires</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-display font-bold text-lg mb-6 text-white">Contact</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-secondary-foreground/70 text-sm">15 Rue des Frères Bouadou, Hydra, Alger, Algérie</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary shrink-0" />
                <span className="text-secondary-foreground/70 text-sm">+213 555 00 00 00</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary shrink-0" />
                <span className="text-secondary-foreground/70 text-sm">contact@dzcars.dz</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-secondary-foreground/50 text-sm">
            &copy; {new Date().getFullYear()} DZ Cars. Tous droits réservés.
          </p>
          <div className="flex gap-6 text-sm text-secondary-foreground/50">
            <a href="#" className="hover:text-white transition-colors">Conditions d'utilisation</a>
            <a href="#" className="hover:text-white transition-colors">Politique de confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
