import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { usersData } from "./data/index.js";
import { recipesData } from "./data/index.js";
export async function runSetup() {
  console.log("Done seeding database");
}
export async function seed() {
  const db = await dbConnection();
  await db.dropDatabase();
  await runSetup();
  await closeConnection();
}
