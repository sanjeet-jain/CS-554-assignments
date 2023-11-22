import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { addToCollection, giveUpCollection } from "@/features/comicSlice.js";
import { useQuery } from "@apollo/client";
import { GET_COMICS } from "@/lib/query.js";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const ComicList = () => {
  let { pageNum } = useParams();
  pageNum = parseInt(pageNum);
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const { loading, error, data } = useQuery(GET_COMICS, {
    variables: { pageNum },
  });

  const selectedCollection = useSelector(
    (state) => state?.comics.selectedCollection
  );

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  const totalPages = Math.ceil(data?.comics?.length / 20);

  const nextPage = () => {
    if (pageNum < totalPages) {
      const nextPage = pageNum + 1;
      navigate(`/collection/page/${nextPage}`);
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
      <div>ComicList - Viewing Page {pageNum}</div>
      <div className="grid grid-cols-5 gap-4">
        {data.comics.map((comic) => (
          <Card key={comic.id}>
            <CardHeader>
              <CardTitle>{comic.title}</CardTitle>
              <CardDescription>{comic.description}</CardDescription>
            </CardHeader>
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
            </CardContent>
          </Card>
        ))}
      </div>

      <div>
        {pageNum > 1 && <Button onClick={prevPage}>Previous Page</Button>}
        {pageNum < totalPages && <Button onClick={nextPage}>Next Page</Button>}
      </div>
    </div>
  );
};

export default ComicList;
