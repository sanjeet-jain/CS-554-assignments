import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
} from "@mui/material";
import React, { useState, useEffect } from "react";
import axios from "axios";

function CollectionId(objectId) {
  const [loading, setLoading] = useState(true);
  const [objectData, setObjectData] = useState(undefined);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${objectId}`
        );
        setObjectData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      <div>
        <p>Welcome to the Collections ID</p>
      </div>
    </>
  );
}

export default CollectionId;
