CREATE TABLE `product_like` (
	`id` text PRIMARY KEY NOT NULL,
	`product_id` text NOT NULL,
	`user_id` text NOT NULL,
	`created_at` integer NOT NULL,
	FOREIGN KEY (`product_id`) REFERENCES `product`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX `product_like_product_user_idx` ON `product_like` (`product_id`,`user_id`);--> statement-breakpoint
CREATE INDEX `product_like_user_idx` ON `product_like` (`user_id`);--> statement-breakpoint
ALTER TABLE `product` ADD `like_count` integer DEFAULT 0 NOT NULL;