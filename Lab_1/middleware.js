const requestCounts = {};
function configMiddleWares(app) {
  app.use(async (req, res, next) => {
    if (req.method === "GET") {
      console.log("Request Body: {}");
    } else {
      if (req.body) {
        const requestBodyCopy = { ...req.body };

        if (requestBodyCopy.password) {
          delete requestBodyCopy.password;
        }

        console.log("Request Body:", requestBodyCopy);
      }
    }
    const url = req.originalUrl;
    requestCounts[url] = (requestCounts[url] || 0) + 1;
    console.log(`Request Count for ${url}: ${requestCounts[url]}`);
    next();
  });
}

export default configMiddleWares;
