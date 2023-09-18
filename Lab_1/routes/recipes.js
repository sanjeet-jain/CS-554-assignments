import { Router } from "express";
import { recipesData } from "../data/index.js";
import helpers from "../helpers.js";

const router = Router();
function validateUser(req, res, next) {
  if (!req?.session?.user) {
    return res.status(403).json({ error: "You are not logged in." });
  }
  next();
}

router.get("/", async (req, res) => {
  let page = 1;
  try {
    page = helpers.validateInputIsNumber(req?.query.page ?? page, "Page");
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  try {
    const recipeList = await recipesData.getRecipesByPage(page);
    return res.status(200).json(recipeList);
  } catch (e) {
    return res.status(e.status ?? 500).json({ error: e.message });
  }
});
router.get("/:id", async (req, res) => {
  let id = "";
  try {
    id = helpers.checkObjectIdString(req?.params?.id);
  } catch (e) {
    return res.status(e.status ?? 500).json({ error: e.message });
  }

  try {
    const recipeList = await recipesData.getRecipesById(id);
    return res.status(200).json(recipeList[0]);
  } catch (e) {
    return res.status(e.status ?? 500).json({ error: e.message });
  }
});

router.post("/", validateUser, async (req, res) => {
  const { errorMessages, title, ingredients, steps, skillLevel } =
    helpers.validateRecipeUserInput(
      req?.body?.title,
      req?.body?.ingredients,
      req?.body?.steps,
      req?.body?.skillLevel
    );
  if (Object.keys(errorMessages).length > 0) {
    return res.status(400).json({ error: errorMessages });
  }
  try {
    const insertedRecipe = await recipesData.createRecipe(
      title,
      ingredients,
      steps,
      skillLevel,
      req.session.user._id,
      req.session.user.userName
    );
    return res.status(200).json(insertedRecipe);
  } catch (e) {
    return res
      .status(e.status ?? 500)
      .json({ error: e.errorMessages ?? e.message });
  }
});
router.patch("/:id", validateUser, async (req, res) => {
  let id = "";
  try {
    id = helpers.checkObjectIdString(req?.params?.id);
  } catch (e) {
    return res.status(e.status ?? 500).json({ error: e.message });
  }
  const { errorMessages, title, ingredients, steps, skillLevel } =
    helpers.validateRecipeUserInput(
      req?.body?.title,
      req?.body?.ingredients,
      req?.body?.steps,
      req?.body?.skillLevel
    );
  if (Object.keys(errorMessages).length > 0) {
    return res.status(400).json({ error: errorMessages });
  }
  try {
    const updatedRecipe = await recipesData.updateRecipe(
      title,
      ingredients,
      steps,
      skillLevel,
      req.session.user._id,
      req.session.user.userName,
      id
    );
    return res.status(200).json(updatedRecipe);
  } catch (e) {
    return res
      .status(e.status ?? 500)
      .json({ error: e.errorMessages ?? e.message });
  }
});
router.post("/:id/reviews", validateUser, async (req, res) => {
  let id = "";
  try {
    id = helpers.checkObjectIdString(req?.params?.id);
  } catch (e) {
    return res.status(e.status ?? 500).json({ error: e.message });
  }

  const { errorMessages, rating, review } = helpers.validateReviewUserInput(
    req?.body?.rating,
    req?.body?.review
  );
  if (Object.keys(errorMessages).length > 0) {
    return res.status(400).json({ error: errorMessages });
  }

  try {
    const updatedRecipe = await recipesData.addReview(
      rating,
      review,
      req.session.user._id,
      req.session.user.userName,
      id
    );
    return res.status(200).json(updatedRecipe);
  } catch (e) {
    return res
      .status(e.status ?? 500)
      .json({ error: e.errorMessages ?? e.message });
  }
});
router.delete("/:recipeId/:reviewId", validateUser, async (req, res) => {
  let recipeId = "";
  let reviewId = "";
  try {
    recipeId = helpers.checkObjectIdString(req?.params?.recipeId);
    reviewId = helpers.checkObjectIdString(req?.params?.reviewId);
  } catch (e) {
    return res.status(e.status ?? 500).json({ error: e.message });
  }
  try {
    let updatedRecipe = await recipesData.removeReview(
      recipeId,
      reviewId,
      req.session.user._id,
      req.session.user.userName
    );
    return res.status(200).json(updatedRecipe);
  } catch (e) {
    return res
      .status(e.status ?? 500)
      .json({ error: e.errorMessages ?? e.message });
  }
});
router.post("/:id/likes", validateUser, async (req, res) => {
  let recipeId = "";
  try {
    recipeId = helpers.checkObjectIdString(req?.params?.id);
  } catch (e) {
    return res.status(e.status ?? 500).json({ error: e.message });
  }
  try {
    const updatedRecipe = await recipesData.toggleLike(
      req.session.user._id,
      recipeId
    );
    return res.status(200).json(updatedRecipe);
  } catch (e) {
    return res.status(e.status ?? 500).json({ error: e.message });
  }
});
export default router;
