import marvelApiRoutes from "./marvelApis.js";

const constructorMethod = (app) => {
  app.use("/api", marvelApiRoutes);
  app.use("*", (req, res) => {
    res.status(404).json({ error: "Not found" });
  });
};

export default constructorMethod;
