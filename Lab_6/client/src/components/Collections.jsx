import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import {
  createCollection,
  setCurrentCollection,
  giveUpCollection,
  deleteCollection,
} from "@/features/comicSlice.js";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";
import { Label } from "@/components/ui/label.jsx";
import { Input } from "@/components/ui/input.jsx";
import { Link } from "react-router-dom";
import noimg from "@/assets/noimg.svg";
const Collections = () => {
  const inactiveCollections = useSelector(
    (state) => state?.comics.inactiveCollections
  );
  const selectedCollection = useSelector(
    (state) => state?.comics.selectedCollection
  );

  const [collectionName, setCollectionName] = useState("");

  const dispatch = useDispatch();

  const handleCreateCollection = () => {
    dispatch(createCollection({ name: collectionName }));
    setCollectionName("");
  };

  const handleSelectedCollection = (collectionId) => {
    dispatch(setCurrentCollection(collectionId));
  };

  const handleCollectionDeletion = (collectionId) => {
    dispatch(deleteCollection(collectionId));
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <div>
        <div className="text-lg"> Create a Collection</div>
        <div>
          <div className="flex items-center space-x-2">
            <Label htmlFor="createCollectionInput">Collection Name</Label>
            <Input
              className="w-full"
              id="createCollectionInput"
              type="text"
              placeholder="Collection Name"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
            />
            <Button onClick={handleCreateCollection}>Create Collection</Button>
          </div>
        </div>
      </div>
      <br />
      <div>
        <div>
          <h1>Selected Collection : {selectedCollection?.name} </h1>
        </div>
        <div>
          <Card key={selectedCollection?.id}>
            <CardHeader>
              <CardTitle>{selectedCollection?.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-5 gap-4">
                {selectedCollection?.comics?.map((comic) => (
                  <Card
                    className="h-50 overflow-hidden"
                    key={selectedCollection.id + "-" + comic.id}
                  >
                    <Link to={`/marvel-comics/${comic.id}`}>
                      <CardHeader>
                        <img
                          src={
                            comic.images.map((x) => {
                              if (
                                x.__typename === "Image" &&
                                x.path &&
                                x.extension
                              )
                                return `${x.path}.${x.extension}`;
                            })[0] ?? noimg
                          }
                          alt={comic.title}
                        />
                        <CardTitle>{comic.title}</CardTitle>
                      </CardHeader>
                    </Link>
                    <CardContent>
                      <div className="grid grid-cols-1 gap-4 ">
                        <Button
                          onClick={() => dispatch(giveUpCollection(comic))}
                        >
                          Give up
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div>
        <h2>My Collections</h2>
        <div>
          {inactiveCollections
            ?.filter((collection) => collection.id !== selectedCollection?.id)
            ?.map((collection) => (
              <Card key={collection.id}>
                <CardHeader>
                  <CardTitle>
                    {collection.name}{" "}
                    <Button
                      onClick={() => handleSelectedCollection(collection.id)}
                    >
                      Set as Current Collection
                    </Button>
                    <Button
                      className="bg-red-500"
                      onClick={() => handleCollectionDeletion(collection.id)}
                    >
                      Delete
                    </Button>
                  </CardTitle>
                </CardHeader>

                <div className="grid grid-cols-5 gap-4">
                  {collection?.comics?.map((comic) => (
                    <Link
                      key={collection.id + "-" + comic.id}
                      to={`/marvel-comics/${comic.id}`}
                    >
                      <Card>
                        <CardHeader>
                          <img
                            src={
                              comic.images.map((x) => {
                                if (
                                  x.__typename === "Image" &&
                                  x.path &&
                                  x.extension
                                )
                                  return `${x.path}.${x.extension}`;
                              })[0] ?? noimg
                            }
                            alt={comic.title}
                          />
                          <CardTitle>{comic.title}</CardTitle>
                        </CardHeader>
                        <CardContent></CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Collections;
