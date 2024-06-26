import { ObjectId } from "mongodb";
import helpers from "../helpers.js";
import { users } from "../config/mongoCollections.js";
import bcrypt from "bcrypt";
const pwrounds = 10;

export const create = async (name, userName, password) => {
  let errorMessages = {};
  ({ errorMessages, name, userName, password } =
    helpers.validateUserCreateInput(name, userName, password));
  if (Object.keys(errorMessages).length > 0) {
    let error = {};
    error.status = 400;
    error.errorMessages = errorMessages;
    throw error;
  }
  const usersCollection = await users();
  const existUser = await usersCollection.findOne({ userName });
  if (existUser) {
    const error = Error("Already a user registered with that userName");
    error.status = 400;
    throw error;
  }
  const hashedPw = await bcrypt.hash(password, pwrounds);

  const newUser = {
    _id: new ObjectId(),
    name,
    userName,
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

export const login = async (userName, password) => {
  let errorMessages = {};
  ({ errorMessages, userName, password } = helpers.validateUserLoginInput(
    userName,
    password
  ));
  if (Object.keys(errorMessages).length > 0) {
    let error = {};
    error.status = 400;
    error.errorMessages = errorMessages;
    throw error;
  }
  const usersCollection = await users();
  const existUser = await usersCollection.findOne({ userName });
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
