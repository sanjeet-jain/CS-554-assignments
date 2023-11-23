import dayjs from "dayjs";
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
import { Label } from "@radix-ui/react-label";
const Comic = () => {
  let { id } = useParams();
  id = parseInt(id);
  const dispatch = useDispatch();
  const selectedCollection = useSelector(
    (state) => state?.comics.selectedCollection
  );

  const handleAddToCollection = (comic) => {
    if (selectedCollection.comics.length < 20) dispatch(addToCollection(comic));
    else alert("You can only have 20 comics in a collection");
  };

  const { loading, error, data } = useQuery(GET_COMIC, {
    variables: { id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error : {error.message}</p>;

  return (
    <div>
      {/* <div>
        <h1>{data?.comic?.title}</h1>
        <p>{data?.comic?.description}</p>
      </div>
      <div>
        <img src={data?.comic?.thumbnail} alt={data?.comic?.title} />
      </div> */}
      <Card key={data.comic.id} className="grid grid-cols-2">
        <CardHeader>
          <img
            className="w-3/4 h-3/4"
            src={
              data.comic.thumbnail.path +
                "." +
                data.comic.thumbnail.extension ??
              data.comic.images.map((x) => {
                if (x.__typename === "Image" && x.path && x.extension)
                  return `${x.path}.${x.extension}`;
              })[0] ??
              noimg
            }
            alt={data.comic.title}
          />
        </CardHeader>
        <CardContent>
          <CardTitle>{data.comic.title}</CardTitle>
          <Label>
            Print Price :{" "}
            {data.comic.prices.find((x) => x.type === "printPrice")?.price}
          </Label>
          <br></br>
          <Label>
            On Sale Date :{" "}
            {data.comic.dates.find((x) => x.type === "onsaleDate")?.date
              ? dayjs(
                  data.comic.dates.find((x) => x.type === "onsaleDate")?.date
                ).format("DD/MM/YYYY")
              : "N/A"}
          </Label>

          <div className="grid grid-cols-2 gap-4">
            {selectedCollection?.comics?.find(
              (collectionComic) => collectionComic.id === data.comic.id
            ) ? (
              <Button onClick={() => dispatch(giveUpCollection(data.comic))}>
                Give up Collection
              </Button>
            ) : (
              <Button onClick={() => handleAddToCollection(data.comic)}>
                Add to Collection
              </Button>
            )}
          </div>
          <CardDescription>{data.comic.description}</CardDescription>
        </CardContent>
      </Card>
    </div>
  );
};

export default Comic;
