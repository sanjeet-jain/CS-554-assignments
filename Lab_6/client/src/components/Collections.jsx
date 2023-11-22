import { useSelector, useDispatch } from "react-redux";
import {
  next,
  addToCollection,
  giveUpCollection,
  previous,
} from "@/features/comicSlice.js";
import { Button } from "@/components/ui/button.jsx";

const Collections = () => {
  const collections = useSelector((state) => state?.comic);
  console.log(collections);

  const dispatch = useDispatch();

  return (
    <div>
      <h1>Collections - |{JSON.stringify(collections)}|</h1>
      <div>
        <Button onClick={() => dispatch(next())}>Next</Button>
        <Button onClick={() => dispatch(previous())}>Previous</Button>
        <Button onClick={() => dispatch(addToCollection(2))}>
          Add to Collection
        </Button>
        <Button onClick={() => dispatch(giveUpCollection())}>
          Give up Collection
        </Button>
      </div>
    </div>
  );
};

export default Collections;
