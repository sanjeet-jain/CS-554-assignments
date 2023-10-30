import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { TextField, Button, Box } from "@mui/material";

function SearchInput() {
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const searchQueryParam = query.get("q") || "";

  const [searchQuery, setSearchQuery] = useState(searchQueryParam);

  const handleSearch = () => {
    if (searchQuery) {
      navigate(`/search?page=1&q=${encodeURIComponent(searchQuery)}`);
    }
  };

  return (
    <Box>
      <TextField
        label="Search"
        variant="outlined"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
      <Button variant="contained" onClick={handleSearch}>
        Search
      </Button>
    </Box>
  );
}

export default SearchInput;
