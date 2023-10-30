import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Grid, Button } from "@mui/material";
import SearchResultsCardsList from "./SearchResultsCardsList";

function SearchResults() {
  const [loading, setLoading] = useState(true);
  const [searchResults, setSearchResults] = useState([]);
  const paginatedDataRef = useRef([]);
  let navigate = useNavigate();

  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchQuery = query.get("q") || "";
  const page = query.get("page") || "";

  useEffect(() => {
    async function fetchSearchResults() {
      try {
        const { data } = await axios.get(
          `https://collectionapi.metmuseum.org/public/collection/v1/search?q=${searchQuery}`
        );
        const itemsPerPage = 50;
        const startIndex = (page - 1) * itemsPerPage;
        const endIndex = startIndex + itemsPerPage;
        paginatedDataRef.current = data.objectIDs.slice(startIndex, endIndex);
        setSearchResults(data.objectIDs);
        setLoading(false);
      } catch (e) {
        console.error(e);
        // Handle errors, e.g., show an error message to the user
      }
    }
    fetchSearchResults();
  }, [page, searchQuery]);

  const nextPage = () => {
    const currentPage = parseInt(page);
    if (currentPage < Math.ceil(searchResults.length / 50)) {
      const nextPage = currentPage + 1;
      navigate(`/search?q=${searchQuery}&page=${nextPage}`);
    }
  };

  const prevPage = () => {
    const currentPage = parseInt(page);
    if (currentPage > 1) {
      const prevPage = currentPage - 1;
      navigate(`/search?q=${searchQuery}&page=${prevPage}`);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const currentPage = parseInt(page);
  const totalPages = Math.ceil(searchResults.length / 50);
  const cardData = paginatedDataRef.current.map((id) => (
    <Grid item xs={2} key={id}>
      <SearchResultsCardsList id={id} />
    </Grid>
  ));
  console.log(cardData);
  return (
    <div>
      <h2>Search Results for "{searchQuery}"</h2>
      <Grid container spacing={1}>
        {cardData}
      </Grid>
      <div>
        {currentPage > 1 && <Button onClick={prevPage}>Previous Page</Button>}
        {currentPage < totalPages && (
          <Button onClick={nextPage}>Next Page</Button>
        )}
      </div>
    </div>
  );
}

export default SearchResults;
