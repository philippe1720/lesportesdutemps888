import { z } from 'zod';
import { insertInquirySchema, services, testimonials, tarotReadings } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const tarotInputSchema = z.object({
  email: z.string().email(),
  question: z.string().min(5),
});

export const api = {
  services: {
    list: {
      method: 'GET' as const,
      path: '/api/services',
      responses: {
        200: z.array(z.custom<typeof services.$inferSelect>()),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/services/:id',
      responses: {
        200: z.custom<typeof services.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
  testimonials: {
    list: {
      method: 'GET' as const,
      path: '/api/testimonials',
      responses: {
        200: z.array(z.custom<typeof testimonials.$inferSelect>()),
      },
    },
  },
  inquiries: {
    create: {
      method: 'POST' as const,
      path: '/api/inquiries',
      input: insertInquirySchema,
      responses: {
        201: z.object({ success: z.boolean(), message: z.string() }),
        400: errorSchemas.validation,
      },
    },
  },
  tarot: {
    draw: {
      method: 'POST' as const,
      path: '/api/tarot/draw',
      input: tarotInputSchema,
      responses: {
        200: z.object({
          cards: z.array(z.object({
            name: z.string(),
            image: z.string(),
            meaning: z.string(),
            reversed: z.boolean(),
          })),
          interpretation: z.string(),
          readingCount: z.number(),
          showConsultationLink: z.boolean(),
        }),
        400: errorSchemas.validation,
        429: z.object({ message: z.string() }),
      },
    },
    checkCount: {
      method: 'GET' as const,
      path: '/api/tarot/count/:email',
      responses: {
        200: z.object({ count: z.number() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
