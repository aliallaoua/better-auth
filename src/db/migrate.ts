import { config } from "dotenv";
import { migrate } from "drizzle-orm/neon-http/migrator";

import { db } from "./drizzle";

config({ path: ".env" });

// Check if migration flag is set
if (process.env.DB_MIGRATING !== "true") {
	throw new Error(
		'You must set DB_MIGRATING to "true" when running migrations'
	);
}

const main = async () => {
	console.log("Running migrations...");

	try {
		await migrate(db, {
			migrationsFolder: "./migrations", // Adjust path to your migrations folder
		});
		console.log("Migration completed");
	} catch (error) {
		console.error("Error during migration:", error);
		process.exit(1);
	}
};

main();
