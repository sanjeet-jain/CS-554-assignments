import { dbConnection, closeConnection } from "./config/mongoConnection.js";
import { usersData } from "./data/index.js";
import { recipesData } from "./data/index.js";
export async function runSetup() {
  const insertedUser = await usersData.create(
    "sanjeet",
    "sanjeetjain",
    "Sanjeet!1"
  );

  const newRecipe = {
    title: "!123!@#!@#",
    ingredients: [
      "One whole chicken",
      "2 cups of flour",
      "2 eggs",
      "salt",
      "pepper",
      "1 cup cooking oil",
      "3 lemons",
    ],
    skillLevel: " NOvice ",
    steps: [
      "First take the two eggs and mix them with the flour, the salt and the pepper",
      "Next, dip the chicken into the mix",
      "take 1 cup of oil and put in frier",
      "Fry the chicken on medium heat for 1 hour",
      "squeeze lemon juice on chicken and serve",
    ],
  };
  const insertedRecipe = await recipesData.createRecipe(
    newRecipe.title,
    newRecipe.ingredients,
    newRecipe.steps,
    newRecipe.skillLevel,
    insertedUser._id.toString(),
    insertedUser.userName
  );
  console.log(insertedRecipe);

  console.log("Done seeding database");
}
export async function seed() {
  const db = await dbConnection();
  await db.dropDatabase();
  await runSetup();
  await closeConnection();
}
