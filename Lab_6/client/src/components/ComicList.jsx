import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import {
  addToCollection,
  giveUpCollection,
  editSearchTerm,
} from "@/features/comicSlice.js";
import { useQuery } from "@apollo/client";
import { GET_COMICS } from "@/lib/query.js";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import noimg from "@/assets/noimg.svg";
import { useState } from "react";

import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/badge";
const ComicList = () => {
  let { pageNum } = useParams();

  pageNum = parseInt(pageNum);
  let navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchQueryParam, setSearchQueryParam] = useState("");

  const { loading, error, data } = useQuery(GET_COMICS, {
    variables: { pageNum, searchQuery: searchQueryParam },
  });

  const selectedCollection = useSelector(
    (state) => state?.comics.selectedCollection
  );
  const searchTerm = useSelector((state) => state?.comics.searchTerm);
  if (searchTerm && !searchQueryParam) setSearchQueryParam(searchTerm);

  const handleSearch = () => {
    dispatch(editSearchTerm(searchQuery));

    setSearchQueryParam(searchQuery);
    setSearchQuery("");
  };
  const handleClear = () => {
    dispatch(editSearchTerm(""));

    setSearchQueryParam("");
    setSearchQuery("");
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :{error?.message}</p>;

  const totalPages = Math.ceil(data?.comics.total ?? 0 / 20);
  const nextPage = () => {
    if (pageNum < totalPages) {
      const nextPage = pageNum + 1;
      navigate(`/marvel-comics/page/${nextPage}`);
    }
  };

  const prevPage = () => {
    if (pageNum > 1) {
      const prevPage = pageNum - 1;
      navigate(`/marvel-comics/page/${prevPage}`);
    }
  };
  return (
    <div>
      <div>
        <input
          type="text"
          placeholder={"Search comics title..."}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value.trim())}
        />
        <Button onClick={handleSearch}>Search</Button>
        <Button onClick={handleClear}>Clear</Button>
      </div>
      {searchTerm && (
        <>
          <br></br>
          <div>
            Showing Reslts for Search Term: <Badge>{searchTerm}</Badge>
          </div>
          <br></br>
        </>
      )}
      <br></br>
      <div>
        ComicList - Viewing Page <Badge>{pageNum}</Badge>
      </div>
      <br></br>
      <div>
        {pageNum > 1 && <Button onClick={prevPage}>Previous Page</Button>}
        {pageNum < totalPages && <Button onClick={nextPage}>Next Page</Button>}
      </div>
      <br></br>

      <div className="grid grid-cols-5 gap-4">
        {data.comics.comics.map((comic) => (
          <Card key={comic.id} className="h-full overflow-default">
            <Link to={`/marvel-comics/${comic.id}`}>
              <CardHeader>
                <img
                  src={
                    comic.thumbnail.path + "." + comic.thumbnail.extension ??
                    comic.images.map((x) => {
                      if (x.__typename === "Image" && x.path && x.extension)
                        return `${x.path}.${x.extension}`;
                    })[0] ??
                    noimg
                  }
                  alt={comic.title}
                />
                <CardTitle>{comic.title}</CardTitle>
              </CardHeader>
            </Link>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                {selectedCollection?.comics?.find(
                  (collectionComic) => collectionComic.id === comic.id
                ) ? (
                  <Button onClick={() => dispatch(giveUpCollection(comic))}>
                    Give up Collection
                  </Button>
                ) : (
                  <Button onClick={() => dispatch(addToCollection(comic))}>
                    Add to Collection
                  </Button>
                )}
              </div>
              <div></div>
            </CardContent>
          </Card>
        ))}
      </div>
      <br></br>
      <div>
        {pageNum > 1 && <Button onClick={prevPage}>Previous Page</Button>}
        {pageNum < totalPages && <Button onClick={nextPage}>Next Page</Button>}
      </div>
      <br></br>
    </div>
  );
};

export default ComicList;
