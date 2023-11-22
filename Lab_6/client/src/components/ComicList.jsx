import { useParams } from "react-router-dom";

const ComicList = () => {
  let { page } = useParams();

  return <div>ComicList - Viewing Page {page}</div>;
};

export default ComicList;
