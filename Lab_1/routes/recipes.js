import { Router } from "express";
import { recipesData } from "../data/index.js";
import helpers from "../helpers.js";

const router = Router();

router.get("/", async (req, res) => {
  //?page=n
  let page = 1;
  try {
    page = helpers.validateInputIsNumber(req?.query.page ?? page, "Page");
  } catch (e) {
    return res.status(400).json({ error: e.message });
  }
  try {
    const recipeList = await recipesData.getRecipes(page);
    return res.status(200).json(recipeList);
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message });
  }
});
router.get("/:id", async (req, res) => {
  try {
    helpers.checkObjectIdString(req?.params?.id);
  } catch (e) {
    return res.status(e.status ?? 500).json({ error: e.message });
  }

  try {
    const recipeList = await recipesData.getRecipes(1, req?.params?.id);
    return res.status(200).json(recipeList[0]);
  } catch (e) {
    res.status(e.status ?? 500).json({ error: e.message });
  }
});

router.post("/", async (req, res) => {});
router.patch("/:id", async (req, res) => {});
router.post("/:id/reviews", async (req, res) => {});
router.delete("/:recipeId/:reviewId", async (req, res) => {});
router.post("/:id/likes", async (req, res) => {});
export default router;
