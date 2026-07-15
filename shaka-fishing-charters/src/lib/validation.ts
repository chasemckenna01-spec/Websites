import { z } from "zod";

export const bookingRequestSchema = z.object({
  tripSlug: z.string().min(1),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  guests: z.coerce.number().int().min(1).max(6),
  customerName: z.string().trim().min(2, "Name is required").max(120),
  customerEmail: z.string().trim().email("Enter a valid email"),
  customerPhone: z.string().trim().min(7, "Enter a valid phone number").max(30),
  notes: z.string().trim().max(1000).optional().or(z.literal("")),
});

export type BookingRequestInput = z.infer<typeof bookingRequestSchema>;

export const contactRequestSchema = z.object({
  name: z.string().trim().min(2, "Name is required").max(120),
  email: z.string().trim().email("Enter a valid email"),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a bit more").max(2000),
});

export type ContactRequestInput = z.infer<typeof contactRequestSchema>;
