import { createSlice, current } from "@reduxjs/toolkit";

const comicSlice = createSlice({
  name: "comics",
  initialState: {
    // Array of inactive collections
    inactiveCollections: [],

    // Active collection
    selectedCollection: {
      id: 1,
      name: "defaultCollection",
      comics: [],
    },
  },
  reducers: {
    setCurrentCollection: (state, action) => {
      // store the selected collection in the state to a variable
      const selectedCollection = state.inactiveCollections.find(
        (collection) => collection.id === action.payload
      );
      // remove the selected collection from the inactive collections
      state.inactiveCollections = state.inactiveCollections.filter(
        (collection) => collection.id !== action.payload
      );
      // add the selected collection to the inactive collections
      state.inactiveCollections.push(state.selectedCollection);
      // set the selected collection to the active collection
      state.selectedCollection = selectedCollection;
    },
    createCollection: (state, action) => {
      const newCollection = {
        id: (state.inactiveCollections.length + 1).toString(),
        name: action.payload.name,
        comics: [],
      };
      state.inactiveCollections.push(newCollection);
    },
    addToCollection: (state, action) => {
      state.selectedCollection.comics.push(action.payload);
    },
    giveUpCollection: (state, action) => {
      state.selectedCollection.comics = state.selectedCollection.comics.filter(
        (comic) => comic.id !== action.payload.id
      );
    },
  },
});

// Action creators are generated for each case reducer function
export const {
  createCollection,
  setCurrentCollection,
  addToCollection,
  giveUpCollection,
} = comicSlice.actions;

export default comicSlice.reducer;
