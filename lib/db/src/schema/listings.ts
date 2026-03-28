import { pgTable, text, serial, integer, boolean, decimal, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const listingsTable = pgTable("listings", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  year: integer("year").notNull(),
  price: integer("price").notNull(),
  mileage: integer("mileage").notNull(),
  fuelType: text("fuel_type").notNull(),
  transmission: text("transmission").notNull(),
  condition: text("condition").notNull(),
  wilaya: text("wilaya").notNull(),
  city: text("city").notNull(),
  description: text("description").notNull(),
  color: text("color").notNull(),
  doors: integer("doors").notNull().default(4),
  seats: integer("seats").notNull().default(5),
  power: integer("power"),
  engineSize: text("engine_size"),
  features: jsonb("features").$type<string[]>().default([]),
  images: jsonb("images").$type<string[]>().default([]),
  sellerName: text("seller_name").notNull(),
  sellerPhone: text("seller_phone").notNull(),
  sellerType: text("seller_type").notNull().default("particulier"),
  isFeatured: boolean("is_featured").notNull().default(false),
  views: integer("views").notNull().default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertListingSchema = createInsertSchema(listingsTable).omit({ id: true, views: true, createdAt: true });
export type InsertListing = z.infer<typeof insertListingSchema>;
export type Listing = typeof listingsTable.$inferSelect;
