import {
  pgTable,
  serial,
  text,
  timestamp,
  boolean,
  integer,
  numeric,
} from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  clerkId: text("clerk_id").notNull().unique(),
  email: text("email").notNull().unique(),
  name: text("name").notNull(),
  isAdmin: boolean("is_admin").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const pets = pgTable("pets", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  type: text("type").notNull(),
  age: text("age").notNull(),
  health: text("health"),
  inoculations: text("inoculations"),
  habits: text("habits"),
  imageUrl: text("image_url").notNull(),
  userId: text("user_id").notNull(),
  contactNumber: text("contact_number").notNull(),
  emailAddress: text("email_address").notNull(),
  isSelling: text("is_selling").notNull().default("free"),
  price: numeric("price", { precision: 10, scale: 2 }).default(null),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const likes = pgTable("likes", {
  id: serial("id").primaryKey(),
  userId: text("user_id").notNull(),
  petId: integer("pet_id")
    .notNull()
    .references(() => pets.id),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
