-- Migration: Make product_id nullable in subscriptions table
-- Since subscriptions now apply to all products under a profile, product_id is optional

ALTER TABLE subscriptions ALTER COLUMN product_id DROP NOT NULL;

