import { useState, useEffect } from "react";
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
  }, [id, id_param, navigate]);

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }
  if (id === undefined) {
    return (
      <>
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
                Artist Bio: {objectData.artistDisplayBio || "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Artist Gender: {objectData.artistGender || "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Object Date: {objectData.objectDate || "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Department: {objectData.department || "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Medium: {objectData.medium || "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Classification: {objectData.classification || "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Culture: {objectData.culture || "N/A"}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Dimensions: {objectData.dimensions || "N/A"}
              </Typography>
            </CardContent>
          </CardActionArea>
        </Card>
      </>
    );
  } else {
    return (
      <>
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
      </>
    );
  }
}

export default CollectionIdCardList;
