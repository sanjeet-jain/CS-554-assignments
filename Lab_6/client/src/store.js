import { configureStore } from "@reduxjs/toolkit";
import comicReducer from "@/features/comicSlice.js";

export default configureStore({
  reducer: {
    comics: comicReducer,
  },
});
