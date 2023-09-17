import { ObjectId } from "mongodb";
import helpers from "../helpers.js";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
const pwrounds = 10;

export const create = async (name, username, password) => {
  let errorMessages = {};
  ({ errorMessages, name, username, password } =
    helpers.validateUserCreateInput(name, username, password));
  if (Object.keys(errorMessages).length > 0) {
    errorMessages.status = 400;
    throw errorMessages;
  }
  const usersCollection = await users();
  const existUser = await usersCollection.findOne({ username });
  if (existUser) {
    const error = Error("Already a user registered with that username");
    error.status = 400;
    throw error;
  }
  const hashedPw = await bcrypt.hash(password, pwrounds);

  const newUser = {
    _id: new ObjectId(),
    name,
    username,
    password: hashedPw,
  };
  const insertedUser = await usersCollection.insertOne(newUser);
  if (insertedUser.insertedCount === 0) {
    const error = Error("insertion of user failed");
    error.status = 500;
    throw error;
  }
  delete newUser.password;
  return newUser;
};

export const login = async (username, password) => {
  let errorMessages = {};
  ({ errorMessages, username, password } = helpers.validateUserLoginInput(
    username,
    password
  ));
  if (Object.keys(errorMessages).length > 0) {
    errorMessages.status = 400;
    throw errorMessages;
  }
  const usersCollection = await users();
  const existUser = await usersCollection.findOne({ username });
  if (!existUser) {
    const error = Error("Either the email address or password is invalid");
    error.status = 400;
    throw error;
  }

  const isPassValid = await bcrypt.compare(password, existUser.password);
  if (!isPassValid) {
    const error = Error("Either the email address or password is invalid");
    error.status = 400;
    throw error;
  }
  delete existUser.password;
  return existUser;
};
