CREATE TABLE `conversions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64),
	`email` varchar(320),
	`name` varchar(255),
	`type` enum('main_offer','order_bump','upsell_1','downsell_1','upsell_2') NOT NULL,
	`amount` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `conversions_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_answers` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`questionIndex` int NOT NULL,
	`questionText` text,
	`answerIndex` int NOT NULL,
	`answerText` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `quiz_answers_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `quiz_sessions` (
	`id` int AUTO_INCREMENT NOT NULL,
	`sessionId` varchar(64) NOT NULL,
	`name` varchar(255),
	`email` varchar(320),
	`country` varchar(64),
	`utmSource` varchar(255),
	`utmMedium` varchar(255),
	`utmCampaign` varchar(255),
	`status` enum('started','completed','converted') NOT NULL DEFAULT 'started',
	`currentQuestion` int NOT NULL DEFAULT 0,
	`completedAt` timestamp,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `quiz_sessions_id` PRIMARY KEY(`id`),
	CONSTRAINT `quiz_sessions_sessionId_unique` UNIQUE(`sessionId`)
);
