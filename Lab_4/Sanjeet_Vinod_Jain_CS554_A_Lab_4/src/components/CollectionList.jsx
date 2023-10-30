import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { Grid, Button } from "@mui/material";
import CollectionIdCardList from "./CollectionIdCardList";

function CollectionList(props) {
  let navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [museumData, setMuseumData] = useState(undefined);
  const { page } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const departmentIds = query.get("departmentIds") ?? "";
  const paginatedDataRef = useRef([]);

  useEffect(() => {
    async function fetchData() {
      try {
        const { data } = await axios.get(
          `https://collectionapi.metmuseum.org/public/collection/v1/objects?departmentIds=${departmentIds}`
        );

        const itemsPerPage = 50;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        paginatedDataRef.current = data.objectIDs.slice(startIndex, endIndex);
        setMuseumData(data);
        setLoading(false);
      } catch (e) {
        console.log(e);
        navigate(`/error/${e.response.status}`);
      }
    }
    fetchData();
  }, [page, departmentIds, navigate]);

  const nextPage = () => {
    const currentPage = parseInt(page);
    if (currentPage < Math.ceil(museumData.objectIDs.length / 50)) {
      const nextPage = currentPage + 1;
      navigate(`/collection/page/${nextPage}?departmentIds=${departmentIds}`);
    }
  };

  const prevPage = () => {
    const currentPage = parseInt(page);
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      navigate(`/collection/page/${prevPage}?departmentIds=${departmentIds}`);
    }
  };

  if (loading) {
    return (
      <div>
        <h2>Loading....</h2>
      </div>
    );
  }

  const cardsData = paginatedDataRef.current.map((id) => (
    <Grid item xs={2} key={id}>
      <Link to={`/collection/${id}`}>
        <CollectionIdCardList id={id}></CollectionIdCardList>
      </Link>
    </Grid>
  ));

  const currentPage = parseInt(page);
  const totalPages = Math.ceil(museumData.objectIDs.length / 50);

  return (
    <div>
      <p>Welcome to the Collections Page</p>
      <div>
        <br />
        <br />
        <Grid container spacing={1}>
          {cardsData}
        </Grid>
      </div>
      <div>
        {currentPage > 1 && <Button onClick={prevPage}>Previous Page</Button>}
        {currentPage < totalPages && (
          <Button onClick={nextPage}>Next Page</Button>
        )}
      </div>
    </div>
  );
}

export default CollectionList;
