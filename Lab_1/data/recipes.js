import { ObjectId } from "mongodb";
import helpers from "../helpers.js";
import { recipes } from "../config/mongoCollections.js";

export const getRecipesById = async (id = "") => {
  id = helpers.checkObjectIdString(id);
  const recipesCollection = await recipes();
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
  const recipesCollection = await recipes();

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
  userId = helpers.checkObjectIdString(userId);
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

export const updateRecipe = async (
  title,
  ingredients,
  steps,
  skillLevel,
  userId,
  userName,
  id
) => {
  id = helpers.checkObjectIdString(id);
  userId = helpers.checkObjectIdString(userId);
  userName = helpers.checkUsername(userName, "UserName");
  let errorMessages = {};
  ({ errorMessages, title, ingredients, steps, skillLevel } =
    helpers.validateRecipeUserInput(title, ingredients, steps, skillLevel));
  if (Object.keys(errorMessages).length > 0) {
    let error = {};
    error.status = 400;
    error.errorMessages = errorMessages;
    throw error;
  }
  const recipesCollection = await recipes();
  const existingRecipe = await recipesCollection.findOne({
    _id: new ObjectId(id),
  });
  if (!existingRecipe) {
    const error = Error(`recipe with id  ${id} not found `);
    error.status = 404;
    throw error;
  }
  if (
    existingRecipe.user._id.toString() != userId &&
    existingRecipe.user.userName != userName
  ) {
    const error = Error(`recipe with id  ${id} doesnt belong to ${userName} `);
    error.status = 403;
    throw error;
  }
  const updatedRecipe = await recipesCollection.updateOne(
    { _id: existingRecipe._id },
    {
      $set: {
        title,
        ingredients,
        steps,
        skillLevel,
      },
    }
  );
  if (!updatedRecipe.acknowledged) {
    const error = Error("Issue with mongo DB");
    error.status = 503;
    throw error;
  }
  if (updatedRecipe.modifiedCount === 0) {
    const error = Error("No details were changed");
    error.status = 400;
    throw error;
  }

  const newRecipe = await getRecipesById(id);
  return newRecipe[0];
};

export const addReview = async (rating, review, userId, userName, recipeId) => {
  recipeId = helpers.checkObjectIdString(recipeId);
  userId = helpers.checkObjectIdString(userId);
  userName = helpers.checkUsername(userName, "UserName");
  let errorMessages = {};
  ({ errorMessages, rating, review } = helpers.validateReviewUserInput(
    rating,
    review
  ));
  if (Object.keys(errorMessages).length > 0) {
    let error = {};
    error.status = 400;
    error.errorMessages = errorMessages;
    throw error;
  }
  const recipesCollection = await recipes();
  const existingRecipe = await recipesCollection.findOne({
    _id: new ObjectId(recipeId),
  });
  if (!existingRecipe) {
    const error = Error(`recipe with id  ${recipeId} not found `);
    error.status = 404;
    throw error;
  }
  existingRecipe.reviews.forEach((review) => {
    if (
      review.user._id.toString() === userId &&
      review.user.userName === userName
    ) {
      let error = new Error(
        `User ${userName} already has a review for the recipe with id ${recipeId}, please delete the existing one to create a new one`
      );
      error.status = 400;
      throw error;
    }
  });
  let newReview = {
    _id: new ObjectId(),
    user: { _id: new ObjectId(userId), userName },
    rating,
    review,
  };
  existingRecipe.reviews.push(newReview);
  const updatedRecipe = await recipesCollection.updateOne(
    { _id: existingRecipe._id },
    {
      $set: {
        reviews: existingRecipe.reviews,
      },
    },
    {
      upsert: false,
    }
  );
  if (!updatedRecipe.acknowledged) {
    const error = Error("Issue with mongo DB");
    error.status = 503;
    throw error;
  }
  if (updatedRecipe.modifiedCount === 0) {
    const error = Error("No Review was added");
    error.status = 400;
    throw error;
  }

  const newRecipe = await getRecipesById(recipeId);
  return newRecipe[0];
};
export const removeReview = async (recipeId, reviewId, userId, userName) => {
  recipeId = helpers.checkObjectIdString(recipeId);
  reviewId = helpers.checkObjectIdString(reviewId);
  userId = helpers.checkObjectIdString(userId);
  userName = helpers.checkUsername(userName, "UserName");
  const recipesCollection = await recipes();
  const existingRecipe = await recipesCollection.findOne({
    _id: new ObjectId(recipeId),
  });
  if (!existingRecipe) {
    const error = Error(`recipe with id  ${recipeId} not found `);
    error.status = 404;
    throw error;
  }
  const indexToRemove = existingRecipe.reviews.findIndex(
    (review) => review._id.toString() === reviewId
  );
  if (indexToRemove === -1) {
    const error = Error(`review with id  ${reviewId} not found `);
    error.status = 404;
    throw error;
  }
  existingRecipe.reviews.splice(indexToRemove, 1);
  const updatedRecipe = await recipesCollection.updateOne(
    { _id: existingRecipe._id },
    {
      $set: {
        reviews: existingRecipe.reviews,
      },
    },
    {
      upsert: false,
    }
  );
  if (!updatedRecipe.acknowledged) {
    const error = Error("Issue with mongo DB");
    error.status = 503;
    throw error;
  }
  if (updatedRecipe.modifiedCount === 0) {
    const error = Error("No Review was added");
    error.status = 400;
    throw error;
  }

  const newRecipe = await getRecipesById(recipeId);
  return newRecipe[0];
};

export const toggleLike = async (userId, recipeId) => {
  recipeId = helpers.checkObjectIdString(recipeId);
  userId = helpers.checkObjectIdString(userId);

  const recipesCollection = await recipes();
  const existingRecipe = await recipesCollection.findOne({
    _id: new ObjectId(recipeId),
  });
  if (!existingRecipe) {
    const error = Error(`recipe with id  ${recipeId} not found `);
    error.status = 404;
    throw error;
  }

  const indexToRemove = existingRecipe.likes.findIndex(
    (likedUserId) => likedUserId === userId
  );

  if (indexToRemove === -1) {
    existingRecipe.likes.push(userId);
  } else {
    existingRecipe.likes.splice(indexToRemove, 1);
  }

  const updatedRecipe = await recipesCollection.updateOne(
    { _id: existingRecipe._id },
    {
      $set: {
        likes: existingRecipe.likes,
      },
    },
    {
      upsert: false,
    }
  );
  if (!updatedRecipe.acknowledged) {
    const error = Error("Issue with mongo DB");
    error.status = 503;
    throw error;
  }
  if (updatedRecipe.modifiedCount === 0) {
    const error = Error("No like was added");
    error.status = 400;
    throw error;
  }

  const newRecipe = await getRecipesById(recipeId);
  return newRecipe[0];
};
