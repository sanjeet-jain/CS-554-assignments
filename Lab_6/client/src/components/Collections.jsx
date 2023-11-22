import { useSelector, useDispatch } from "react-redux";
import React, { useState } from "react";
import {
  createCollection,
  setCurrentCollection,
  addToCollection,
  giveUpCollection,
} from "@/features/comicSlice.js";
import { Button } from "@/components/ui/button.jsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.jsx";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

  return (
    <div>
      <div>
        <h2>Create a Collection</h2>
        <input
          type="text"
          placeholder="Collection Name"
          value={collectionName}
          onChange={(e) => setCollectionName(e.target.value)}
        />
        <button onClick={handleCreateCollection}>Create Collection</button>
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
              <div className="grid grid-cols-5">
                {selectedCollection?.comics?.map((comic) => (
                  <Card key={comic.id}>
                    <CardHeader>
                      <CardTitle>{comic.title}</CardTitle>
                      <CardDescription>{comic.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4">
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
                  </CardTitle>
                </CardHeader>

                <div className="grid grid-cols-5">
                  {collection?.comics?.map((comic) => (
                    <Card key={collection.id + "-" + comic.id}>
                      <CardHeader>
                        <CardTitle>{comic.title}</CardTitle>
                        <CardDescription>{comic.description}</CardDescription>
                      </CardHeader>
                      <CardContent></CardContent>
                    </Card>
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
