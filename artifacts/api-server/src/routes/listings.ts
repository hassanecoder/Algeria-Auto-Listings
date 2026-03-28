import { Router, type IRouter } from "express";
import { db, listingsTable } from "@workspace/db";
import { eq, and, gte, lte, ilike, desc, asc, count, sql } from "drizzle-orm";
import {
  GetListingsQueryParams,
  CreateListingBody,
  GetListingByIdParams,
  GetSimilarListingsParams,
  GetBrandModelsParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

const WILAYAS = [
  { code: 1, name: "Adrar", nameAr: "أدرار" },
  { code: 2, name: "Chlef", nameAr: "الشلف" },
  { code: 3, name: "Laghouat", nameAr: "الأغواط" },
  { code: 4, name: "Oum El Bouaghi", nameAr: "أم البواقي" },
  { code: 5, name: "Batna", nameAr: "باتنة" },
  { code: 6, name: "Béjaïa", nameAr: "بجاية" },
  { code: 7, name: "Biskra", nameAr: "بسكرة" },
  { code: 8, name: "Béchar", nameAr: "بشار" },
  { code: 9, name: "Blida", nameAr: "البليدة" },
  { code: 10, name: "Bouira", nameAr: "البويرة" },
  { code: 11, name: "Tamanrasset", nameAr: "تمنراست" },
  { code: 12, name: "Tébessa", nameAr: "تبسة" },
  { code: 13, name: "Tlemcen", nameAr: "تلمسان" },
  { code: 14, name: "Tiaret", nameAr: "تيارت" },
  { code: 15, name: "Tizi Ouzou", nameAr: "تيزي وزو" },
  { code: 16, name: "Alger", nameAr: "الجزائر" },
  { code: 17, name: "Djelfa", nameAr: "الجلفة" },
  { code: 18, name: "Jijel", nameAr: "جيجل" },
  { code: 19, name: "Sétif", nameAr: "سطيف" },
  { code: 20, name: "Saïda", nameAr: "سعيدة" },
  { code: 21, name: "Skikda", nameAr: "سكيكدة" },
  { code: 22, name: "Sidi Bel Abbès", nameAr: "سيدي بلعباس" },
  { code: 23, name: "Annaba", nameAr: "عنابة" },
  { code: 24, name: "Guelma", nameAr: "قالمة" },
  { code: 25, name: "Constantine", nameAr: "قسنطينة" },
  { code: 26, name: "Médéa", nameAr: "المدية" },
  { code: 27, name: "Mostaganem", nameAr: "مستغانم" },
  { code: 28, name: "M'Sila", nameAr: "المسيلة" },
  { code: 29, name: "Mascara", nameAr: "معسكر" },
  { code: 30, name: "Ouargla", nameAr: "ورقلة" },
  { code: 31, name: "Oran", nameAr: "وهران" },
  { code: 32, name: "El Bayadh", nameAr: "البيض" },
  { code: 33, name: "Illizi", nameAr: "إليزي" },
  { code: 34, name: "Bordj Bou Arréridj", nameAr: "برج بوعريريج" },
  { code: 35, name: "Boumerdès", nameAr: "بومرداس" },
  { code: 36, name: "El Tarf", nameAr: "الطارف" },
  { code: 37, name: "Tindouf", nameAr: "تندوف" },
  { code: 38, name: "Tissemsilt", nameAr: "تيسمسيلت" },
  { code: 39, name: "El Oued", nameAr: "الوادي" },
  { code: 40, name: "Khenchela", nameAr: "خنشلة" },
  { code: 41, name: "Souk Ahras", nameAr: "سوق أهراس" },
  { code: 42, name: "Tipaza", nameAr: "تيبازة" },
  { code: 43, name: "Mila", nameAr: "ميلة" },
  { code: 44, name: "Aïn Defla", nameAr: "عين الدفلى" },
  { code: 45, name: "Naâma", nameAr: "النعامة" },
  { code: 46, name: "Aïn Témouchent", nameAr: "عين تموشنت" },
  { code: 47, name: "Ghardaïa", nameAr: "غرداية" },
  { code: 48, name: "Relizane", nameAr: "غليزان" },
];

const BRANDS: Record<string, { models: string[]; country: string; logo: string }> = {
  peugeot: { models: ["208", "308", "3008", "5008", "508", "2008", "Partner", "Expert", "Boxer"], country: "France", logo: "🦁" },
  renault: { models: ["Clio", "Mégane", "Kadjar", "Duster", "Symbol", "Logan", "Sandero", "Captur", "Talisman", "Kangoo"], country: "France", logo: "💎" },
  volkswagen: { models: ["Golf", "Polo", "Passat", "Tiguan", "Touareg", "T-Roc", "T-Cross", "Arteon"], country: "Allemagne", logo: "🔵" },
  toyota: { models: ["Corolla", "Camry", "Land Cruiser", "RAV4", "Yaris", "Hilux", "Prado", "Fortuner", "Rush"], country: "Japon", logo: "⭕" },
  hyundai: { models: ["i10", "i20", "i30", "Tucson", "Santa Fe", "Creta", "Elantra", "Sonata", "H-1", "Accent"], country: "Corée", logo: "🔷" },
  dacia: { models: ["Sandero", "Logan", "Duster", "Spring", "Jogger", "Dokker", "Lodgy"], country: "Roumanie", logo: "🔶" },
  kia: { models: ["Sportage", "Picanto", "Rio", "Sorento", "Stinger", "Ceed", "Niro", "K5"], country: "Corée", logo: "⚡" },
  suzuki: { models: ["Swift", "Baleno", "Vitara", "Jimny", "Celerio", "Ignis", "S-Cross", "Ertiga"], country: "Japon", logo: "🔴" },
  citroen: { models: ["C3", "C4", "C5 Aircross", "Berlingo", "SpaceTourer", "Jumper", "Dispatch"], country: "France", logo: "⬆️" },
  ford: { models: ["Focus", "Fiesta", "Mustang", "F-150", "Ranger", "Explorer", "Edge", "Transit"], country: "USA", logo: "🔵" },
  mercedes: { models: ["Classe A", "Classe C", "Classe E", "GLC", "GLE", "Sprinter", "Vito", "Classe S"], country: "Allemagne", logo: "⭐" },
  bmw: { models: ["Série 1", "Série 3", "Série 5", "X1", "X3", "X5", "X6", "M3"], country: "Allemagne", logo: "🔵" },
  audi: { models: ["A3", "A4", "A6", "Q3", "Q5", "Q7", "TT", "RS3"], country: "Allemagne", logo: "⚪" },
  nissan: { models: ["Micra", "Juke", "Qashqai", "X-Trail", "Navara", "Patrol", "Altima"], country: "Japon", logo: "🔵" },
  mitsubishi: { models: ["L200", "Pajero", "Outlander", "Eclipse Cross", "ASX", "Colt"], country: "Japon", logo: "♦️" },
  seat: { models: ["Ibiza", "Leon", "Ateca", "Arona", "Tarraco", "Alhambra"], country: "Espagne", logo: "🔴" },
  skoda: { models: ["Octavia", "Fabia", "Superb", "Kodiaq", "Kamiq", "Scala", "Karoq"], country: "Tchéquie", logo: "🔲" },
  chevrolet: { models: ["Spark", "Cruze", "Malibu", "Tahoe", "Captiva", "Camaro", "Trax"], country: "USA", logo: "🏁" },
  fiat: { models: ["500", "Panda", "Tipo", "Punto", "Doblo", "Ducato", "Linea"], country: "Italie", logo: "🔴" },
  honda: { models: ["Civic", "Accord", "CR-V", "HR-V", "Jazz", "Pilot", "Fit"], country: "Japon", logo: "🔴" },
};

router.get("/brands", async (req, res) => {
  const counts = await db
    .select({ brand: listingsTable.brand, count: count() })
    .from(listingsTable)
    .groupBy(listingsTable.brand);

  const countMap: Record<string, number> = {};
  for (const row of counts) {
    countMap[row.brand.toLowerCase()] = Number(row.count);
  }

  const brands = Object.entries(BRANDS).map(([slug, info]) => ({
    name: slug.charAt(0).toUpperCase() + slug.slice(1).replace("citroen", "Citroën").replace("mercedes", "Mercedes-Benz"),
    slug,
    count: countMap[slug] || 0,
    logo: info.logo,
    country: info.country,
  }));

  const displayNames: Record<string, string> = {
    peugeot: "Peugeot",
    renault: "Renault",
    volkswagen: "Volkswagen",
    toyota: "Toyota",
    hyundai: "Hyundai",
    dacia: "Dacia",
    kia: "Kia",
    suzuki: "Suzuki",
    citroen: "Citroën",
    ford: "Ford",
    mercedes: "Mercedes-Benz",
    bmw: "BMW",
    audi: "Audi",
    nissan: "Nissan",
    mitsubishi: "Mitsubishi",
    seat: "Seat",
    skoda: "Skoda",
    chevrolet: "Chevrolet",
    fiat: "Fiat",
    honda: "Honda",
  };

  const formattedBrands = Object.entries(BRANDS).map(([slug, info]) => ({
    name: displayNames[slug] || slug,
    slug,
    count: countMap[slug] || 0,
    logo: info.logo,
    country: info.country,
  }));

  res.json(formattedBrands.sort((a, b) => b.count - a.count));
});

router.get("/brands/:slug/models", async (req, res) => {
  const { slug } = GetBrandModelsParams.parse(req.params);
  const brandInfo = BRANDS[slug.toLowerCase()];
  if (!brandInfo) {
    res.json([]);
    return;
  }
  res.json(brandInfo.models);
});

router.get("/wilayas", async (req, res) => {
  const counts = await db
    .select({ wilaya: listingsTable.wilaya, count: count() })
    .from(listingsTable)
    .groupBy(listingsTable.wilaya);

  const countMap: Record<string, number> = {};
  for (const row of counts) {
    countMap[row.wilaya] = Number(row.count);
  }

  const wilayasWithCount = WILAYAS.map((w) => ({
    ...w,
    count: countMap[w.name] || 0,
  })).sort((a, b) => b.count - a.count);

  res.json(wilayasWithCount);
});

router.get("/stats", async (req, res) => {
  const [totalResult] = await db.select({ count: count() }).from(listingsTable);
  const [brandsResult] = await db
    .select({ count: sql<number>`count(distinct ${listingsTable.brand})` })
    .from(listingsTable);
  const [wilayasResult] = await db
    .select({ count: sql<number>`count(distinct ${listingsTable.wilaya})` })
    .from(listingsTable);

  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const [weekResult] = await db
    .select({ count: count() })
    .from(listingsTable)
    .where(gte(listingsTable.createdAt, oneWeekAgo));

  res.json({
    totalListings: Number(totalResult?.count || 0),
    totalBrands: Number(brandsResult?.count || 0),
    totalWilayas: Number(wilayasResult?.count || 0),
    newThisWeek: Number(weekResult?.count || 0),
  });
});

router.get("/listings/featured", async (req, res) => {
  const featured = await db
    .select()
    .from(listingsTable)
    .where(eq(listingsTable.isFeatured, true))
    .orderBy(desc(listingsTable.createdAt))
    .limit(8);
  res.json(featured.map(formatListing));
});

router.get("/listings", async (req, res) => {
  const query = GetListingsQueryParams.parse(req.query);

  const page = query.page || 1;
  const limit = query.limit || 12;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (query.brand) conditions.push(eq(listingsTable.brand, query.brand));
  if (query.model) conditions.push(ilike(listingsTable.model, `%${query.model}%`));
  if (query.yearMin) conditions.push(gte(listingsTable.year, query.yearMin));
  if (query.yearMax) conditions.push(lte(listingsTable.year, query.yearMax));
  if (query.priceMin) conditions.push(gte(listingsTable.price, query.priceMin));
  if (query.priceMax) conditions.push(lte(listingsTable.price, query.priceMax));
  if (query.wilaya) conditions.push(eq(listingsTable.wilaya, query.wilaya));
  if (query.fuelType) conditions.push(eq(listingsTable.fuelType, query.fuelType));
  if (query.transmission) conditions.push(eq(listingsTable.transmission, query.transmission));
  if (query.condition) conditions.push(eq(listingsTable.condition, query.condition));
  if (query.mileageMax) conditions.push(lte(listingsTable.mileage, query.mileageMax));
  if (query.search) {
    conditions.push(
      sql`(${listingsTable.title} ilike ${`%${query.search}%`} or ${listingsTable.brand} ilike ${`%${query.search}%`} or ${listingsTable.model} ilike ${`%${query.search}%`})`
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderBy;
  switch (query.sort) {
    case "price_asc":
      orderBy = asc(listingsTable.price);
      break;
    case "price_desc":
      orderBy = desc(listingsTable.price);
      break;
    case "year_desc":
      orderBy = desc(listingsTable.year);
      break;
    case "mileage_asc":
      orderBy = asc(listingsTable.mileage);
      break;
    case "views_desc":
      orderBy = desc(listingsTable.views);
      break;
    default:
      orderBy = desc(listingsTable.createdAt);
  }

  const [totalResult] = await db
    .select({ count: count() })
    .from(listingsTable)
    .where(whereClause);

  const listings = await db
    .select()
    .from(listingsTable)
    .where(whereClause)
    .orderBy(orderBy)
    .limit(limit)
    .offset(offset);

  const total = Number(totalResult?.count || 0);

  res.json({
    listings: listings.map(formatListing),
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  });
});

router.get("/listings/:id/similar", async (req, res) => {
  const { id } = GetSimilarListingsParams.parse(req.params);
  const listing = await db.select().from(listingsTable).where(eq(listingsTable.id, id)).limit(1);

  if (!listing.length) {
    res.json([]);
    return;
  }

  const similar = await db
    .select()
    .from(listingsTable)
    .where(and(eq(listingsTable.brand, listing[0].brand), sql`${listingsTable.id} != ${id}`))
    .orderBy(desc(listingsTable.createdAt))
    .limit(4);

  res.json(similar.map(formatListing));
});

router.get("/listings/:id", async (req, res) => {
  const { id } = GetListingByIdParams.parse(req.params);
  const [listing] = await db.select().from(listingsTable).where(eq(listingsTable.id, id)).limit(1);

  if (!listing) {
    res.status(404).json({ error: "Listing not found" });
    return;
  }

  await db
    .update(listingsTable)
    .set({ views: sql`${listingsTable.views} + 1` })
    .where(eq(listingsTable.id, id));

  res.json(formatListing(listing));
});

router.post("/listings", async (req, res) => {
  const data = CreateListingBody.parse(req.body);
  const [listing] = await db.insert(listingsTable).values(data).returning();
  res.status(201).json(formatListing(listing));
});

function formatListing(listing: any) {
  return {
    ...listing,
    features: listing.features || [],
    images: listing.images || [],
    createdAt: listing.createdAt instanceof Date ? listing.createdAt.toISOString() : listing.createdAt,
  };
}

export default router;
