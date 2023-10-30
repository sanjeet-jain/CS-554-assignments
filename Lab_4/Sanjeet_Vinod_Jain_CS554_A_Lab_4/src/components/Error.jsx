import React from "react";
import Button from "@mui/material/Button";
import { useParams } from "react-router-dom";

function Home(props) {
  const { status } = useParams();
  console.log(status);
  return (
    <div>
      <p>{status} Not found</p>
    </div>
  );
}

export default Home;
