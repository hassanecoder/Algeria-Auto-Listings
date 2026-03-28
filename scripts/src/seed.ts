import { db, listingsTable } from "@workspace/db";

const CAR_IMAGES = [
  "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800&q=80",
  "https://images.unsplash.com/photo-1550355291-bbee04a92027?w=800&q=80",
  "https://images.unsplash.com/photo-1542362567-b07e54358753?w=800&q=80",
  "https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800&q=80",
  "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800&q=80",
  "https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800&q=80",
  "https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800&q=80",
  "https://images.unsplash.com/photo-1536700503339-1e4b06520771?w=800&q=80",
  "https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800&q=80",
  "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=800&q=80",
  "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80",
  "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80",
  "https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=800&q=80",
  "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=800&q=80",
  "https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=800&q=80",
];

const WILAYAS = [
  "Alger", "Oran", "Constantine", "Annaba", "Blida",
  "Batna", "Sétif", "Tizi Ouzou", "Béjaïa", "Tlemcen",
  "Sidi Bel Abbès", "Biskra", "Guelma", "Mostaganem", "M'Sila",
  "Mascara", "Ouargla", "El Bayadh", "Médéa", "Tiaret",
  "Aïn Témouchent", "Chlef", "Jijel", "Skikda", "Boumerdès", "Tipaza",
];

const SELLERS = [
  { name: "Ahmed Benali", phone: "+213 770 12 34 56", type: "particulier" },
  { name: "Auto Expert Alger", phone: "+213 21 45 67 89", type: "professionnel" },
  { name: "Mohamed Khelifa", phone: "+213 661 98 76 54", type: "particulier" },
  { name: "Garage El Watan", phone: "+213 41 23 45 67", type: "professionnel" },
  { name: "Karim Boussaid", phone: "+213 555 44 33 22", type: "particulier" },
  { name: "Auto Flash Oran", phone: "+213 41 87 65 43", type: "professionnel" },
  { name: "Youcef Amrani", phone: "+213 772 11 22 33", type: "particulier" },
  { name: "Star Motors DZ", phone: "+213 21 98 76 54", type: "professionnel" },
];

const COLORS = ["Blanc", "Noir", "Gris", "Rouge", "Bleu", "Vert", "Beige", "Argent", "Orange"];
const FUEL_TYPES = ["Essence", "Diesel", "GPL", "Hybride"];
const TRANSMISSIONS = ["Manuelle", "Automatique"];
const CONDITIONS = ["Neuf", "Très bon état", "Bon état", "Correct"];

const CAR_DATA = [
  { brand: "peugeot", model: "208", yearRange: [2018, 2024], priceRange: [900000, 2200000], mileageRange: [5000, 120000], power: 100, engineSize: "1.2L" },
  { brand: "peugeot", model: "308", yearRange: [2016, 2023], priceRange: [1200000, 2800000], mileageRange: [10000, 150000], power: 130, engineSize: "1.5L" },
  { brand: "peugeot", model: "3008", yearRange: [2017, 2024], priceRange: [2000000, 4500000], mileageRange: [5000, 100000], power: 130, engineSize: "1.6L" },
  { brand: "renault", model: "Clio", yearRange: [2018, 2024], priceRange: [850000, 2000000], mileageRange: [5000, 130000], power: 90, engineSize: "1.0L" },
  { brand: "renault", model: "Mégane", yearRange: [2016, 2023], priceRange: [1100000, 2500000], mileageRange: [15000, 160000], power: 115, engineSize: "1.3L" },
  { brand: "renault", model: "Duster", yearRange: [2016, 2024], priceRange: [1800000, 3500000], mileageRange: [10000, 120000], power: 115, engineSize: "1.5L" },
  { brand: "dacia", model: "Sandero", yearRange: [2019, 2024], priceRange: [700000, 1600000], mileageRange: [5000, 100000], power: 90, engineSize: "1.0L" },
  { brand: "dacia", model: "Logan", yearRange: [2018, 2023], priceRange: [650000, 1400000], mileageRange: [10000, 130000], power: 90, engineSize: "1.0L" },
  { brand: "volkswagen", model: "Golf", yearRange: [2015, 2023], priceRange: [1500000, 3500000], mileageRange: [10000, 180000], power: 130, engineSize: "1.5L" },
  { brand: "volkswagen", model: "Polo", yearRange: [2017, 2024], priceRange: [1200000, 2800000], mileageRange: [5000, 130000], power: 95, engineSize: "1.0L" },
  { brand: "toyota", model: "Corolla", yearRange: [2017, 2024], priceRange: [2000000, 4000000], mileageRange: [5000, 100000], power: 122, engineSize: "1.8L" },
  { brand: "toyota", model: "Hilux", yearRange: [2016, 2024], priceRange: [3500000, 6000000], mileageRange: [10000, 150000], power: 150, engineSize: "2.4L" },
  { brand: "toyota", model: "Land Cruiser", yearRange: [2015, 2023], priceRange: [7000000, 15000000], mileageRange: [20000, 200000], power: 200, engineSize: "4.0L" },
  { brand: "hyundai", model: "Tucson", yearRange: [2017, 2024], priceRange: [2500000, 5000000], mileageRange: [5000, 120000], power: 150, engineSize: "1.6L" },
  { brand: "hyundai", model: "i10", yearRange: [2018, 2024], priceRange: [750000, 1800000], mileageRange: [5000, 100000], power: 67, engineSize: "1.0L" },
  { brand: "kia", model: "Sportage", yearRange: [2017, 2024], priceRange: [2800000, 5500000], mileageRange: [5000, 110000], power: 150, engineSize: "2.0L" },
  { brand: "kia", model: "Picanto", yearRange: [2018, 2024], priceRange: [700000, 1600000], mileageRange: [5000, 90000], power: 67, engineSize: "1.0L" },
  { brand: "suzuki", model: "Swift", yearRange: [2018, 2024], priceRange: [900000, 2000000], mileageRange: [5000, 110000], power: 83, engineSize: "1.2L" },
  { brand: "mercedes", model: "Classe C", yearRange: [2016, 2023], priceRange: [3500000, 7000000], mileageRange: [10000, 150000], power: 184, engineSize: "1.5L" },
  { brand: "bmw", model: "Série 3", yearRange: [2015, 2023], priceRange: [3000000, 7500000], mileageRange: [10000, 200000], power: 184, engineSize: "2.0L" },
  { brand: "ford", model: "Ranger", yearRange: [2016, 2023], priceRange: [3000000, 5500000], mileageRange: [15000, 180000], power: 160, engineSize: "2.0L" },
  { brand: "audi", model: "A4", yearRange: [2016, 2023], priceRange: [3000000, 6500000], mileageRange: [10000, 160000], power: 150, engineSize: "2.0L" },
  { brand: "nissan", model: "Qashqai", yearRange: [2016, 2023], priceRange: [2200000, 4500000], mileageRange: [10000, 140000], power: 140, engineSize: "1.3L" },
  { brand: "mitsubishi", model: "L200", yearRange: [2016, 2024], priceRange: [3200000, 6000000], mileageRange: [10000, 200000], power: 150, engineSize: "2.4L" },
  { brand: "citroen", model: "C3", yearRange: [2018, 2024], priceRange: [900000, 2000000], mileageRange: [5000, 120000], power: 83, engineSize: "1.2L" },
  { brand: "skoda", model: "Octavia", yearRange: [2016, 2023], priceRange: [1800000, 3800000], mileageRange: [10000, 160000], power: 150, engineSize: "1.5L" },
  { brand: "seat", model: "Ibiza", yearRange: [2017, 2024], priceRange: [1000000, 2200000], mileageRange: [5000, 130000], power: 95, engineSize: "1.0L" },
  { brand: "fiat", model: "Tipo", yearRange: [2016, 2022], priceRange: [800000, 1800000], mileageRange: [10000, 150000], power: 95, engineSize: "1.4L" },
  { brand: "honda", model: "CR-V", yearRange: [2017, 2023], priceRange: [2800000, 5500000], mileageRange: [10000, 130000], power: 154, engineSize: "1.5L" },
  { brand: "chevrolet", model: "Spark", yearRange: [2017, 2022], priceRange: [600000, 1300000], mileageRange: [10000, 130000], power: 75, engineSize: "1.0L" },
];

const FEATURES_OPTIONS = [
  "Climatisation", "Navigation GPS", "Bluetooth", "Caméra de recul",
  "Régulateur de vitesse", "Vitres électriques", "Rétroviseurs électriques",
  "Sièges chauffants", "Toit ouvrant", "Jantes alliage", "ABS",
  "ESP", "Airbags", "Capteurs de parking", "Verrouillage central",
  "Système audio premium", "Phares LED", "Démarrage sans clé",
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomFeatures(): string[] {
  const count = getRandomInt(3, 8);
  const shuffled = [...FEATURES_OPTIONS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function getRandomImages(): string[] {
  const count = getRandomInt(2, 4);
  const shuffled = [...CAR_IMAGES].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

async function seed() {
  console.log("🌱 Seeding database...");

  const existing = await db.select().from(listingsTable).limit(1);
  if (existing.length > 0) {
    console.log("✓ Database already has data. Skipping seed.");
    process.exit(0);
  }

  const listings = [];

  for (let i = 0; i < 120; i++) {
    const car = getRandomItem(CAR_DATA);
    const year = getRandomInt(car.yearRange[0], car.yearRange[1]);
    const price = getRandomInt(car.priceRange[0], car.priceRange[1]);
    const mileage = getRandomInt(car.mileageRange[0], car.mileageRange[1]);
    const wilaya = getRandomItem(WILAYAS);
    const color = getRandomItem(COLORS);
    const fuelType = getRandomItem(FUEL_TYPES);
    const transmission = getRandomItem(TRANSMISSIONS);
    const condition = year >= 2022 ? "Très bon état" : getRandomItem(CONDITIONS);
    const seller = getRandomItem(SELLERS);
    const isFeatured = Math.random() < 0.15;

    const brandDisplay: Record<string, string> = {
      peugeot: "Peugeot", renault: "Renault", volkswagen: "Volkswagen",
      toyota: "Toyota", hyundai: "Hyundai", dacia: "Dacia", kia: "Kia",
      suzuki: "Suzuki", citroen: "Citroën", ford: "Ford",
      mercedes: "Mercedes-Benz", bmw: "BMW", audi: "Audi", nissan: "Nissan",
      mitsubishi: "Mitsubishi", seat: "Seat", skoda: "Skoda",
      chevrolet: "Chevrolet", fiat: "Fiat", honda: "Honda",
    };

    const brandName = brandDisplay[car.brand] || car.brand;
    const title = `${brandName} ${car.model} ${year} - ${color}`;

    const descriptions = [
      `Véhicule en excellent état, entretien régulier chez le concessionnaire. Carnet d'entretien complet.`,
      `Voiture de qualité, premier propriétaire. Aucun accident, tous les contrôles à jour.`,
      `Très belle voiture, moteur impeccable. Idéale pour la ville et la route. Négociable légèrement.`,
      `Véhicule bien entretenu, double clé. Pneus récents, vidange faite récemment.`,
      `Bonne affaire, voiture fiable et économique. Consommation raisonnable en ville et sur autoroute.`,
      `Excellent rapport qualité-prix. Intérieur propre et soigné. À voir absolument.`,
    ];

    listings.push({
      title,
      brand: brandName,
      model: car.model,
      year,
      price,
      mileage,
      fuelType,
      transmission,
      condition,
      wilaya,
      city: wilaya,
      description: getRandomItem(descriptions),
      color,
      doors: 4,
      seats: 5,
      power: car.power,
      engineSize: car.engineSize,
      features: getRandomFeatures(),
      images: getRandomImages(),
      sellerName: seller.name,
      sellerPhone: seller.phone,
      sellerType: seller.type,
      isFeatured,
      views: getRandomInt(0, 500),
    });
  }

  await db.insert(listingsTable).values(listings);
  console.log(`✅ Seeded ${listings.length} listings successfully!`);
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
