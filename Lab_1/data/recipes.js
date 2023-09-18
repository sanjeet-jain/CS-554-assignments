import { ObjectId } from "mongodb";
import helpers from "../helpers.js";
import { recipes } from "../config/mongoCollections.js";

export const getRecipesById = async (id = "") => {
  const recipesCollection = await recipes();

  helpers.checkObjectIdString(id);
  const recipesList = await recipesCollection
    .find({ _id: new ObjectId(id) })
    .toArray();
  if (recipesList.length < 1) {
    let error = new Error("no more recipe found for that id");
    error.status = 404;
    throw error;
  }
  return recipesList;
};
export const getRecipesByPage = async (page = 1) => {
  helpers.validateInputIsNumber(page);
  if (page < 1) {
    const error = new Error("page number cant be below 1");
    error.status = 400;
    throw error;
  }
  const skip = 50 * (page - 1);
  const limit = 50 * page;
  const recipesList = await recipesCollection
    .find({})
    .skip(skip)
    .limit(limit)
    .toArray();
  if (recipesList.length < 1) {
    let error = new Error("no more recipes");
    error.status = 404;
    throw error;
  }
  return recipesList;
};

export const createRecipe = async (
  title,
  ingredients,
  steps,
  skillLevel,
  userId,
  userName
) => {
  helpers.checkObjectIdString(userId);
  let errorMessages = {};
  ({ errorMessages, title, ingredients, steps, skillLevel } =
    helpers.validateRecipeUserInput(title, ingredients, steps, skillLevel));
  if (Object.keys(errorMessages).length > 0) {
    let error = {};
    error.status = 400;
    error.errorMessages = errorMessages;
    throw error;
  }
  let reviews = [];
  let likes = [];
  const recipesCollection = await recipes();
  const newRecipe = {
    _id: new ObjectId(),
    title,
    ingredients,
    steps,
    skillLevel,
    user: { _id: new ObjectId(userId), userName },
    reviews,
    likes,
  };
  let insertedRecipe = await recipesCollection.insertOne(newRecipe);
  if (insertedRecipe.insertedCount === 0) {
    const error = Error("insertion of new Recipe failed");
    error.status = 500;
    throw error;
  }
  return newRecipe;
};
