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
  try {
    helpers.checkObjectIdString(req?.params?.id);
  } catch (e) {
    return res.status(e.status ?? 500).json({ error: e.message });
  }

  try {
    const recipeList = await recipesData.getRecipesById(req?.params?.id);
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
});
router.post("/:id/reviews", async (req, res) => {});
router.delete("/:recipeId/:reviewId", async (req, res) => {});
router.post("/:id/likes", async (req, res) => {});
export default router;
