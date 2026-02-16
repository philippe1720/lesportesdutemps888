import { db } from "./db";
import {
  services,
  testimonials,
  inquiries,
  tarotReadings,
  availabilityRules,
  bookings,
  type Service,
  type InsertService,
  type Testimonial,
  type InsertTestimonial,
  type InsertInquiry,
  type Inquiry,
  type TarotReading,
  type InsertTarotReading,
  type AvailabilityRule,
  type InsertAvailabilityRule,
  type Booking,
  type InsertBooking,
} from "@shared/schema";
import { eq, and, sql } from "drizzle-orm";

export interface IStorage {
  getServices(): Promise<Service[]>;
  getService(id: number): Promise<Service | undefined>;
  getTestimonials(): Promise<Testimonial[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  createTarotReading(reading: InsertTarotReading): Promise<TarotReading>;
  getTarotReadingCountByEmail(email: string): Promise<number>;
  createService(service: InsertService): Promise<Service>;
  createTestimonial(testimonial: InsertTestimonial): Promise<Testimonial>;
  getAvailabilityRules(): Promise<AvailabilityRule[]>;
  createAvailabilityRule(rule: InsertAvailabilityRule): Promise<AvailabilityRule>;
  getBookingsByDate(date: string): Promise<Booking[]>;
  createBooking(booking: InsertBooking): Promise<Booking>;
}

export class DatabaseStorage implements IStorage {
  async getServices(): Promise<Service[]> {
    return await db.select().from(services);
  }

  async getService(id: number): Promise<Service | undefined> {
    const [service] = await db.select().from(services).where(eq(services.id, id));
    return service;
  }

  async getTestimonials(): Promise<Testimonial[]> {
    return await db.select().from(testimonials);
  }

  async createInquiry(insertInquiry: InsertInquiry): Promise<Inquiry> {
    const [inquiry] = await db.insert(inquiries).values(insertInquiry).returning();
    return inquiry;
  }

  async createTarotReading(insertReading: InsertTarotReading): Promise<TarotReading> {
    const [reading] = await db.insert(tarotReadings).values(insertReading).returning();
    return reading;
  }

  async getTarotReadingCountByEmail(email: string): Promise<number> {
    const result = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(tarotReadings)
      .where(eq(tarotReadings.email, email));
    return result[0]?.count ?? 0;
  }

  async createService(insertService: InsertService): Promise<Service> {
    const [service] = await db.insert(services).values(insertService).returning();
    return service;
  }

  async createTestimonial(insertTestimonial: InsertTestimonial): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(insertTestimonial).returning();
    return testimonial;
  }

  async getAvailabilityRules(): Promise<AvailabilityRule[]> {
    return await db.select().from(availabilityRules).where(eq(availabilityRules.isActive, true));
  }

  async createAvailabilityRule(rule: InsertAvailabilityRule): Promise<AvailabilityRule> {
    const [created] = await db.insert(availabilityRules).values(rule).returning();
    return created;
  }

  async getBookingsByDate(date: string): Promise<Booking[]> {
    return await db.select().from(bookings).where(eq(bookings.bookingDate, date));
  }

  async createBooking(booking: InsertBooking): Promise<Booking> {
    const [created] = await db.insert(bookings).values(booking).returning();
    return created;
  }
}

export const storage = new DatabaseStorage();
