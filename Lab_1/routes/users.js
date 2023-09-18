import { Router } from "express";
import { usersData } from "../data/index.js";
import helpers from "../helpers.js";

const router = Router();

router.route("/signup").post(userAlreadyLoggedIn, async (req, res) => {
  const { errorMessages, name, userName, password } =
    helpers.validateUserCreateInput(
      req?.body?.name,
      req?.body?.userName,
      req?.body?.password
    );

  if (Object.keys(errorMessages).length > 0) {
    return res.status(400).json({ error: errorMessages });
  }
  try {
    const insertedUser = await usersData.create(name, userName, password);
    insertedUser._id = insertedUser._id.toString();
    return res.status(200).json({ insertedUser });
  } catch (e) {
    return res
      .status(e.status ?? 500)
      .json({ error: e.errorMessages ?? e.message });
  }
});

router.route("/login").post(userAlreadyLoggedIn, async (req, res) => {
  const { errorMessages, name, userName, password } =
    helpers.validateUserLoginInput(req?.body?.userName, req?.body?.password);

  if (Object.keys(errorMessages).length > 0) {
    return res.status(400).json({ error: errorMessages });
  }
  try {
    const checkUser = await usersData.login(userName, password);
    checkUser._id = checkUser._id.toString();

    req.session.user = { ...checkUser };
    delete req.session.user.name;

    return res.status(200).json({ ...checkUser });
  } catch (e) {
    return res
      .status(e.status ?? 500)
      .json({ error: e.errorMessages ?? e.message });
  }
});

router.route("/logout").get(async (req, res) => {
  if (!req?.session?.user) {
    return res.status(403).json({ error: "You need to login first" });
  }
  res.clearCookie("AuthCookie");
  req.session.destroy();
  return res.status(200).json({ message: "You have been logged out" });
});

function userAlreadyLoggedIn(req, res, next) {
  if (req?.session?.user) {
    return res.status(403).json({ error: "You are already logged in." });
  }
  next();
}

export default router;
