import { useQuery } from "@apollo/client";
import { GET_COMICS } from "@/lib/query.js";

const GeneralTestPage = () => {
  const { loading, error, data } = useQuery(GET_COMICS, {
    variables: { test: 1 },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :{error?.message}</p>;
  console.log(data);
  return <div>Test</div>;
};

export default GeneralTestPage;
