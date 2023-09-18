// You can add and export any helper functions you want here. If you aren't using any, then you can just leave this file as is.
// /\*
// Created by https://sanjeet-jain.github.io/

// ```
//        _       _                   _____
//       | |     (_)                / ____|
//       | | __ _ _ _ __           | (___
//   _   | |/ _` | | '_ \           \___ \
//  | |__| | (_| | | | | |  ______  ____) |
//   \____/ \__,_|_|_| |_| |______||_____/
//
// ```

// \*/
import { ObjectId } from "mongodb";

const helpers = {
  validateStringInput(_input, inputname, trim = true) {
    if (typeof _input !== "string" || _input.trim() === "") {
      throw new Error(`${inputname} is not a valid text input`);
    }
    if (trim) {
      return _input.trim();
    } else return _input;
  },
  checkName(_input, inputName) {
    let input;
    try {
      input = this.validateStringInput(_input, inputName);
    } catch (e) {
      throw new Error(`${inputName} allows only alphabets without spaces`);
    }
    if (!input.match(/^(?![\d ])[\w]+$/i)) {
      throw new Error(
        `${inputName} allows only alphabets without spaces and  must be between 2 to 25 characters including spaces`
      );
    }

    return input;
  },
  checkUsername(_input, inputName) {
    let input;
    try {
      input = this.validateStringInput(_input, inputName);
    } catch (e) {
      throw new Error(
        `${inputName} allows only alphabets and or numbers without spaces`
      );
    }
    if (input.length < 5) {
      throw new Error(`${inputName} must be atleast 5 characters`);
    }
    if (!input.match(/^(?=.{5,}$)[\w]+$/i)) {
      throw new Error(
        `${inputName} allows only alphabets and numbers without spaces and must be atleast 5 characters `
      );
    }
    return input;
  },
  checkPassword(_input, inputName) {
    let input;
    try {
      input = this.validateStringInput(_input, inputName, false);
    } catch (e) {
      throw new Error(
        `${inputName} allows only alphabets or numbers without spaces`
      );
    }
    if (input.length < 8) {
      throw new Error(`${inputName} must be atleast 8 characters`);
    }
    if (
      !input.match(
        /^(?=.{8,})(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*_=+\.\/?<>\-])[^\s]*$/
      )
    ) {
      throw new Error(
        `${inputName} allows only alphabets and numbers without spaces and must have at least one lowercase letter, one uppercase letter, one number and one special character contained in it.`
      );
    }
    return input;
  },

  validateUserCreateInput(name, username, password) {
    const errorMessages = {};
    try {
      name = helpers.checkName(name, "Name");
    } catch (e) {
      errorMessages.name = e.message;
    }
    try {
      username = helpers.checkUsername(username, "Username");
    } catch (e) {
      errorMessages.username = e.message;
    }
    try {
      password = helpers.checkPassword(password, "Password");
    } catch (e) {
      errorMessages.password = e.message;
    }
    return { errorMessages, name, username, password };
  },
  validateUserLoginInput(username, password) {
    const errorMessages = {};
    try {
      username = helpers.checkUsername(username, "Username");
    } catch (e) {
      errorMessages.username = e.message;
    }
    try {
      password = helpers.checkPassword(password, "Password");
    } catch (e) {
      errorMessages.password = e.message;
    }
    return { errorMessages, username, password };
  },

  validateInputIsNumber(input, inputName) {
    if (typeof input === "string") {
      this.validateStringInput(input, inputName);
      input = Number(input.trim());
    }
    if (typeof input !== "number" || isNaN(input)) {
      let error = new Error(`${inputName} is not a number `);
      error.status = 400;
      throw error;
    }
    return input;
  },
  checkObjectIdString(stringObjectId) {
    this.validateStringInput(stringObjectId, "objectID");
    stringObjectId = stringObjectId.trim();
    if (!ObjectId.isValid(stringObjectId)) {
      let error = new Error("object id is not valid");
      error.status = 400;
      throw error;
    }
  },
  checkTitle(_input, inputName) {
    let input;
    try {
      input = this.validateStringInput(_input, inputName);
    } catch (e) {
      let error = new Error(`${inputName} allows only valid non empty strings`);
      error.status = 400;
      throw error;
    }
    if (input.length < 5) {
      let error = new Error(`${inputName} must be atleast 5 characters`);
      error.status = 400;
      throw error;
    }
    // if (!input.match(/^(?=.{5,}$)[\w]+$/i)) {
    //   throw new Error(
    //     `${inputName} allows only alphabets and numbers without spaces and must be atleast 5 characters `
    //   );
    // }
    return input;
  },
  areAllStrings(array, minLength, maxLength) {
    for (let i = 0; i < array.length; i++) {
      try {
        array[i] = this.validateStringInput(array[i]);
        if (
          (minLength && array[i].length < minLength) ||
          (maxLength && array[i].length > maxLength)
        ) {
          throw new Error(
            `${array[i]} at pos ${i} isnt withing the limits of ${minLength} and ${maxLength}`
          );
        }
      } catch (e) {
        return false;
      }
    }
    return { valid: true, array: array };
  },
  checkIngredients(_inputArray, inputName) {
    if (!Array.isArray(_inputArray)) {
      let error = new Error(`${inputName} must be an Array`);
      error.status = 400;
      throw error;
    }
    if (_inputArray.length < 4) {
      let error = new Error(`${inputName} must have atleast 4`);
      error.status = 400;
      throw error;
    }
    let validArray = this.areAllStrings(_inputArray, 4, 50);
    if (!validArray.valid) {
      let error = new Error(`${inputName} must only have strings in it`);
      error.status = 400;
      throw error;
    }
    return validArray.array;
  },
  checkSteps(_inputArray, inputName) {
    if (!Array.isArray(_inputArray)) {
      let error = new Error(`${inputName} must be an Array`);
      error.status = 400;
      throw error;
    }
    if (_inputArray.length < 5) {
      let error = new Error(`${inputName}  must have atleast 5`);
      error.status = 400;
      throw error;
    }
    let validArray = this.areAllStrings(_inputArray, 20);
    if (!validArray.valid) {
      let error = new Error(`${inputName} must only have strings in it`);
      error.status = 400;
      throw error;
    }
    return validArray.array;
  },
  checkSkillLevel(_input, inputName) {
    let input;
    try {
      input = this.validateStringInput(_input, inputName);
    } catch (e) {
      let error = new Error(`${inputName} allows only valid non empty strings`);
      error.status = 400;
      throw error;
    }
    if (!["novice", "intermediate", "advanced"].includes(input.toLowerCase())) {
      let error = new Error(
        `${inputName} allows only the following values : "novice", "intermediate", "advanced" `
      );
      error.status = 400;
      throw error;
    }
    input = input[0].toUpperCase() + input.toLowerCase().substring(1);
    return input;
  },
  validateRecipeUserInput(title, ingredients, steps, skillLevel) {
    const errorMessages = {};
    try {
      title = helpers.checkTitle(title, "Title");
    } catch (e) {
      errorMessages.title = e.message;
    }
    try {
      ingredients = helpers.checkIngredients(ingredients, "Ingredients");
    } catch (e) {
      errorMessages.ingredients = e.message;
    }
    try {
      steps = helpers.checkSteps(steps, "Steps");
    } catch (e) {
      errorMessages.steps = e.message;
    }
    try {
      skillLevel = helpers.checkSkillLevel(skillLevel, "SkillLevel");
    } catch (e) {
      errorMessages.skillLevel = e.message;
    }
    return { errorMessages, title, ingredients, steps, skillLevel };
  },
};
export { helpers as default };
