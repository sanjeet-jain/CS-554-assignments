import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Button } from "@/components/ui/button";
import { addToCollection, giveUpCollection } from "@/features/comicSlice.js";
import { useQuery } from "@apollo/client";
import { GET_COMIC } from "@/lib/query.js";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import noimg from "@/assets/noimg.svg";
const Comic = () => {
  let { id } = useParams();
  id = parseInt(id);
  const dispatch = useDispatch();
  const selectedCollection = useSelector(
    (state) => state?.comics.selectedCollection
  );

  const { loading, error, data } = useQuery(GET_COMIC, {
    variables: { id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;
  console.log(data.comic);
  return (
    <div>
      {/* <div>
        <h1>{data?.comic?.title}</h1>
        <p>{data?.comic?.description}</p>
      </div>
      <div>
        <img src={data?.comic?.thumbnail} alt={data?.comic?.title} />
      </div> */}
      <Card key={data.comic.id}>
        <CardHeader>
          <CardTitle>{data.comic.title}</CardTitle>
          <CardDescription>{data.comic.description}</CardDescription>
        </CardHeader>
        <CardContent>
          <img src={data.comic.thumbnail ?? noimg} alt={data.comic.title} />
          <div className="grid grid-cols-2 gap-4">
            {selectedCollection?.comics?.find(
              (collectionComic) => collectionComic.id === data.comic.id
            ) ? (
              <Button onClick={() => dispatch(giveUpCollection(data.comic))}>
                Give up Collection
              </Button>
            ) : (
              <Button onClick={() => dispatch(addToCollection(data.comic))}>
                Add to Collection
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
      <div>
        <Button onClick={() => dispatch(addToCollection(data?.comic))}>
          Add to Collection
        </Button>
      </div>
    </div>
  );
};

export default Comic;
