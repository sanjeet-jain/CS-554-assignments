import { ObjectId } from "mongodb";
import helpers from "../helpers.js";
import { recipes } from "../config/mongoCollections.js";

export const getRecipes = async (page = 1, id = "") => {
  const recipesCollection = await recipes();
  if (id !== "") {
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
  } else {
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
  }
};
