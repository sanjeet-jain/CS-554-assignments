import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import noImage from "../assets/placeholder.svg";

function CollectionIdCardList({ id }) {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [objectData, setObjectData] = useState(undefined);
  const id_param = useParams().id;
  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects/${
            id ?? id_param
          }`
        );
        setObjectData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        navigate(`/error/${e.response.status}`);
      }
    }
    fetchData();
  }, []);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }

  return (
    <>
      <Card>
        <CardActionArea>
          <CardMedia
            component="img"
            alt={objectData.title}
            image={
              objectData.primaryImage === "" ? noImage : objectData.primaryImage
            }
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {objectData.title}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Artist: {objectData.artistDisplayName}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Object Date: {objectData.objectDate}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Department: {objectData.department}
            </Typography>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

export default CollectionIdCardList;
