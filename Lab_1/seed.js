import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { usersData } from "./data/index.js";
export async function runSetup() {
  try {
    const insertedUser = await usersData.create(
      "sanjeet",
      "sanjeetjain123",
      "Sanjeet1!"
    );
    console.log(insertedUser);
  } catch (e) {
    console.log(e);
  }
  console.log("Done seeding database");
}
export async function seed() {
  const db = await dbConnection();
  await db.dropDatabase();
  await runSetup();
  await closeConnection();
}
