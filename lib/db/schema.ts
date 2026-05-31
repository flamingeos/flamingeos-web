import {
  pgTable,
  serial,
  text,
  integer,
  boolean,
  timestamp,
} from 'drizzle-orm/pg-core'

export const contactInquiries = pgTable('contact_inquiries', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  brand: text('brand'),
  email: text('email').notNull(),
  message: text('message').notNull(),
  budget: text('budget'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const products = pgTable('products', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  priceCents: integer('price_cents').notNull(),
  description: text('description'),
  imageUrl: text('image_url'),
  stock: integer('stock').default(0),
  active: boolean('active').default(false),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})

export const orders = pgTable('orders', {
  id: serial('id').primaryKey(),
  productId: integer('product_id').references(() => products.id),
  buyerEmail: text('buyer_email').notNull(),
  quantity: integer('quantity').notNull().default(1),
  status: text('status').default('pending'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
})
