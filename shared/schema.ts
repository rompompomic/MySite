import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const profile = pgTable("profile", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  firstName: text("firstName").notNull(),
  lastName: text("lastName").notNull(),
  description: text("description").notNull(),
});

export const portfolioItems = pgTable("portfolio_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description").notNull(),
  imageUrl: text("imageUrl").notNull(),
  order: varchar("order").notNull(),
  hasLink: boolean("hasLink").default(false),
  linkUrl: text("linkUrl"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const services = pgTable("services", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  includes: text("includes").array().notNull(),
  targetAudience: text("targetAudience").notNull(),
  workFormat: text("workFormat").notNull(),
  price: text("price").notNull(),
  order: varchar("order").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const settings = pgTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const contacts = pgTable("contacts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  telegram: text("telegram"),
  github: text("github"),
});

export const videoFiles = pgTable("video_files", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fileName: text("filename").notNull(),
  originalName: text("originalname").notNull(),
  mimeType: text("mimetype").notNull(),
  fileSize: varchar("filesize").notNull(),
  filePath: text("filepath").notNull(),
  isActive: boolean("isactive").default(false),
  createdAt: timestamp("createdat").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const insertProfileSchema = createInsertSchema(profile).omit({
  id: true,
});

export const insertPortfolioItemSchema = createInsertSchema(portfolioItems).omit({
  id: true,
  createdAt: true,
});

export const insertServiceSchema = createInsertSchema(services).omit({
  id: true,
  createdAt: true,
});

export const insertSettingSchema = createInsertSchema(settings);

export const insertContactSchema = createInsertSchema(contacts).omit({
  id: true,
});

export const insertVideoFileSchema = createInsertSchema(videoFiles).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type Profile = typeof profile.$inferSelect;
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type PortfolioItem = typeof portfolioItems.$inferSelect;
export type InsertPortfolioItem = z.infer<typeof insertPortfolioItemSchema>;
export type Service = typeof services.$inferSelect;
export type InsertService = z.infer<typeof insertServiceSchema>;
export type Setting = typeof settings.$inferSelect;
export type InsertSetting = z.infer<typeof insertSettingSchema>;
export type Contact = typeof contacts.$inferSelect;
export type InsertContact = z.infer<typeof insertContactSchema>;
export type VideoFile = typeof videoFiles.$inferSelect;
export type InsertVideoFile = z.infer<typeof insertVideoFileSchema>;
