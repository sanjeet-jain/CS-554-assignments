import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { Link, useParams, useNavigate } from "react-router-dom";
import noImage from "../assets/placeholder.svg";

function SearchResultsCardsList({ id }) {
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
      } catch (error) {
        if (error.response && error.response.status === 404) {
          // Handle 404 error (Not Found) by not rendering anything
          setLoading(false);
        } else {
          // Handle other errors
          console.error(error);
        }
      }
    }
    fetchData();
  }, [id, id_param, navigate]);

  if (loading) {
    return <div>Loading....</div>;
  }

  if (!objectData) {
    return null; // Skip rendering when no object data is available
  }

  return (
    <>
      <Link to={"/collection/" + (id ?? id_param)}>
        <Card>
          <CardActionArea>
            <CardMedia
              component="img"
              alt={objectData.title}
              image={
                objectData.primaryImage === ""
                  ? noImage
                  : objectData.primaryImage
              }
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {objectData.title}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Artist: {objectData.artistDisplayName || "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Object Date: {objectData.objectDate || "N/A"}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </Link>
    </>
  );
}

export default SearchResultsCardsList;
