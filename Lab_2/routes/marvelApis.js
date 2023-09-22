import { Router } from "express";
import axios from "axios";
import md5 from "blueimp-md5";
import dayjs from "dayjs";
import * as redis from "redis";
const client = redis.createClient();
client.on("error", (err) => {
  console.log("Redis Client Error", err);
});
client.connect().then(() => {});
const router = Router();

const publickey = "201a00742a8f2665b99947c66827f686";
const privatekey = "c2e2351bdd4b822d1e613d0f9b932f1fc24eabcf";
const ts = dayjs().toDate().getTime();
const stringToHash = ts + privatekey + publickey;
const hash = md5(stringToHash);
const baseUrl = "https://gateway.marvel.com:443/v1/public";

const generateUrl = (reqPath = "") => {
  const url =
    baseUrl + reqPath + "?ts=" + ts + "&apikey=" + publickey + "&hash=" + hash;
  return url;
};

const callMarvelUrl = async (url) => {
  const result = await axios
    .get(url)
    .then((response) => {
      return {
        code: response.data.code,
        status: response.data.status,
        results: response.data.data.results,
      };
    })
    .catch((error) => {
      // This block is executed for network errors and custom exceptions.
      return {
        code: error.response.status,
        status:
          error.response.data.status ??
          error.response.data.message ??
          error.response.statusText,
        results: [],
      };
    });
  return result;
};

const cacheHandler = async (req, res) => {
  try {
    let id = req?.params?.id;

    if (await client.exists(id)) {
      if (req.path.split("/")[1] === "characters") {
        await client.lPush("visitedCharactersId", id);
      }
      const unflatData = JSON.parse(await client.get(id));
      return res.status(200).json(unflatData);
    } else {
      const marvelUrl = generateUrl(req.path.trim());
      const { code, status, results } = await callMarvelUrl(marvelUrl);

      if (results && results.length != 0) {
        if (req.path.split("/")[1] === "characters") {
          await client.lPush("visitedCharactersId", id);
        }
        await client.set(id, JSON.stringify(results[0]));
      }
      return res.status(code).json(results[0] ?? { error: status });
    }
  } catch (e) {
    return res.status(500).json({ error: "Some Error has occured" });
  }
};

router.get("/characters/history", async (req, res) => {
  try {
    let history = [];
    const visitedCharactersId = await client.lRange(
      "visitedCharactersId",
      0,
      -1
    );
    for (
      let index = 0;
      index < visitedCharactersId.length && index < 20;
      index++
    ) {
      const marvelUrl = generateUrl(
        "/characters/" + visitedCharactersId[index]
      );
      const { code, status, results } = await callMarvelUrl(marvelUrl);
      history.push(results[0]);
    }
    if (history.length == 0) {
      return res
        .status(404)
        .json({ error: "There is no history of characters" });
    }
    return res.status(200).json(history);
  } catch (e) {
    return res.status(500).json({ error: "Some Error has occured" });
  }
});

router.get("/characters/:id", cacheHandler);
router.get("/comics/:id", cacheHandler);
router.get("/stories/:id", cacheHandler);

export default router;
