import {
  users,
  profile,
  portfolioItems,
  services,
  settings,
  contacts,
  type User,
  type InsertUser,
  type Profile,
  type InsertProfile,
  type PortfolioItem,
  type InsertPortfolioItem,
  type Service,
  type InsertService,
  type Setting,
  type InsertSetting,
  type Contact,
  type InsertContact,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Profile
  getProfile(): Promise<Profile | undefined>;
  updateProfile(profile: InsertProfile): Promise<Profile>;

  // Portfolio
  getPortfolioItems(): Promise<PortfolioItem[]>;
  createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem>;
  updatePortfolioItem(id: string, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem>;
  deletePortfolioItem(id: string): Promise<void>;

  // Services
  getServices(): Promise<Service[]>;
  createService(service: InsertService): Promise<Service>;
  updateService(id: string, service: Partial<InsertService>): Promise<Service>;
  deleteService(id: string): Promise<void>;

  // Settings
  getSetting(key: string): Promise<Setting | undefined>;
  updateSetting(setting: InsertSetting): Promise<Setting>;

  // Contacts
  getContacts(): Promise<Contact | undefined>;
  updateContacts(contacts: InsertContact): Promise<Contact>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user || undefined;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async getProfile(): Promise<Profile | undefined> {
    try {
      const [profileData] = await db.select().from(profile).limit(1);
      return profileData || undefined;
    } catch (error) {
      console.error("Error getting profile:", error);
      return undefined;
    }
  }

  async updateProfile(profileData: InsertProfile): Promise<Profile> {
    const existing = await this.getProfile();
    if (existing) {
      const [updated] = await db
        .update(profile)
        .set(profileData)
        .where(eq(profile.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(profile).values(profileData).returning();
      return created;
    }
  }

  async getPortfolioItems(): Promise<PortfolioItem[]> {
    return await db.select().from(portfolioItems).orderBy(portfolioItems.order, portfolioItems.createdAt);
  }

  async createPortfolioItem(item: InsertPortfolioItem): Promise<PortfolioItem> {
    const [created] = await db.insert(portfolioItems).values(item).returning();
    return created;
  }

  async updatePortfolioItem(id: string, item: Partial<InsertPortfolioItem>): Promise<PortfolioItem> {
    const [updated] = await db
      .update(portfolioItems)
      .set(item)
      .where(eq(portfolioItems.id, id))
      .returning();
    return updated;
  }

  async deletePortfolioItem(id: string): Promise<void> {
    await db.delete(portfolioItems).where(eq(portfolioItems.id, id));
  }

  async getServices(): Promise<Service[]> {
    return await db.select().from(services).orderBy(services.order, services.createdAt);
  }

  async createService(service: InsertService): Promise<Service> {
    const [created] = await db.insert(services).values(service).returning();
    return created;
  }

  async updateService(id: string, service: Partial<InsertService>): Promise<Service> {
    const [updated] = await db
      .update(services)
      .set(service)
      .where(eq(services.id, id))
      .returning();
    return updated;
  }

  async deleteService(id: string): Promise<void> {
    await db.delete(services).where(eq(services.id, id));
  }

  async getSetting(key: string): Promise<Setting | undefined> {
    const [setting] = await db.select().from(settings).where(eq(settings.key, key));
    return setting || undefined;
  }

  async updateSetting(setting: InsertSetting): Promise<Setting> {
    const existing = await this.getSetting(setting.key);
    if (existing) {
      const [updated] = await db
        .update(settings)
        .set({ value: setting.value, updatedAt: new Date() })
        .where(eq(settings.key, setting.key))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(settings).values(setting).returning();
      return created;
    }
  }

  async getContacts(): Promise<Contact | undefined> {
    const [contactData] = await db.select().from(contacts).limit(1);
    return contactData || undefined;
  }

  async updateContacts(contactData: InsertContact): Promise<Contact> {
    const existing = await this.getContacts();
    if (existing) {
      const [updated] = await db
        .update(contacts)
        .set({ ...contactData, updatedAt: new Date() })
        .where(eq(contacts.id, existing.id))
        .returning();
      return updated;
    } else {
      const [created] = await db.insert(contacts).values(contactData).returning();
      return created;
    }
  }
}

export const storage = new DatabaseStorage();
