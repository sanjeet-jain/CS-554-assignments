import { createSlice, current } from "@reduxjs/toolkit";

const comicSlice = createSlice({
  name: "comic",
  initialState: {
    value: [],
  },
  reducers: {
    next: (state) => {
      // Redux Toolkit allows us to write "mutating" logic in reducers. It
      // doesn't actually mutate the state because it uses the Immer library,
      // which detects changes to a "draft state" and produces a brand new
      // immutable state based off those changes.
      // Also, no return statement is required from these functions.
      state.value.push("next");
      console.log("next", current(state));
    },
    previous: (state) => {
      state.value.push("previous");
      console.log("previous", current(state));
    },
    addToCollection: (state, action) => {
      console.log("addToCollection", action);
      state.value.push("addToCollection");
      console.log("addToCollection", current(state));
    },
    giveUpCollection: (state, action) => {
      state.value.push("giveUpCollection");
      console.log("giveUpCollection", current(state));
    },
  },
});

// Action creators are generated for each case reducer function
export const { next, previous, addToCollection, giveUpCollection } =
  comicSlice.actions;

export default comicSlice.reducer;
