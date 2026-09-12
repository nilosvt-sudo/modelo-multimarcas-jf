import { pgTable, serial, text, integer, boolean, timestamp, numeric } from "drizzle-orm/pg-core";

export const vehicles = pgTable("vehicles", {
  id: serial("id").primaryKey(),
  brand: text("brand").notNull(),
  model: text("model").notNull(),
  version: text("version").notNull(),
  yearFabrication: integer("year_fabrication").notNull(),
  yearModel: integer("year_model").notNull(),
  price: numeric("price", { precision: 12, scale: 2 }).notNull(),
  fipePrice: numeric("fipe_price", { precision: 12, scale: 2 }),
  mileage: integer("mileage").notNull(),
  fuel: text("fuel").notNull(), // Flex, Gasolina, Diesel, Híbrido, Elétrico
  transmission: text("transmission").notNull(), // Automático, Manual, CVT, Automatizado
  color: text("color").notNull(),
  bodyType: text("body_type").notNull(), // Hatch, Sedan, SUV, Picape, Perua, Cupê
  plateEnd: text("plate_end"), // ex: '7'
  doors: integer("doors").default(4),
  coverImage: text("cover_image").notNull(),
  gallery: text("gallery").notNull(), // JSON array string of image URLs
  features: text("features").notNull(), // JSON array string of standard equipment & accessories
  description: text("description").notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  badge: text("badge").default("Seminovo"), // 'Seminovo', 'Destaque', 'Único Dono', 'Oportunidade', 'Garantia'
  hasInspectionReport: boolean("has_inspection_report").default(true).notNull(),
  singleOwner: boolean("single_owner").default(false).notNull(),
  ipvaPaid: boolean("ipva_paid").default(true).notNull(),
  status: text("status").default("available").notNull(), // 'available', 'reserved', 'sold'
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const leads = pgTable("leads", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id, { onDelete: "set null" }),
  vehicleName: text("vehicle_name"),
  name: text("name").notNull(),
  phone: text("phone").notNull(),
  email: text("email"),
  leadType: text("lead_type").default("general").notNull(), // 'general', 'financing', 'proposal', 'direct_contact'
  message: text("message"),
  entryAmount: numeric("entry_amount", { precision: 12, scale: 2 }),
  installments: integer("installments"),
  status: text("status").default("new").notNull(), // 'new', 'in_progress', 'contacted', 'completed', 'lost'
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const testDrives = pgTable("test_drives", {
  id: serial("id").primaryKey(),
  vehicleId: integer("vehicle_id").references(() => vehicles.id, { onDelete: "set null" }),
  vehicleName: text("vehicle_name").notNull(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  preferredDate: text("preferred_date").notNull(),
  preferredTime: text("preferred_time").notNull(),
  locationPreference: text("location_preference").default("dealership").notNull(), // 'dealership', 'home_delivery'
  notes: text("notes"),
  status: text("status").default("pending").notNull(), // 'pending', 'confirmed', 'completed', 'cancelled'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const appraisals = pgTable("appraisals", {
  id: serial("id").primaryKey(),
  customerName: text("customer_name").notNull(),
  customerPhone: text("customer_phone").notNull(),
  customerEmail: text("customer_email"),
  tradeBrand: text("trade_brand").notNull(),
  tradeModel: text("trade_model").notNull(),
  tradeYear: integer("trade_year").notNull(),
  tradeMileage: integer("trade_mileage").notNull(),
  tradeTransmission: text("trade_transmission"),
  tradeFuel: text("trade_fuel"),
  tradeColor: text("trade_color"),
  tradeCondition: text("trade_condition"), // 'Excelente', 'Bom', 'Regular', 'Com avarias'
  hasFinancing: boolean("has_financing").default(false),
  interestedVehicleId: integer("interested_vehicle_id").references(() => vehicles.id, { onDelete: "set null" }),
  interestedVehicleName: text("interested_vehicle_name"),
  photos: text("photos"), // optional JSON array
  notes: text("notes"),
  estimatedValue: numeric("estimated_value", { precision: 12, scale: 2 }),
  status: text("status").default("pending").notNull(), // 'pending', 'in_review', 'evaluated', 'closed'
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const reviews = pgTable("reviews", {
  id: serial("id").primaryKey(),
  authorName: text("author_name").notNull(),
  neighborhood: text("neighborhood").default("Juiz de Fora - MG"),
  rating: integer("rating").default(5).notNull(),
  comment: text("comment").notNull(),
  purchasedVehicle: text("purchased_vehicle"),
  isPublished: boolean("is_published").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
