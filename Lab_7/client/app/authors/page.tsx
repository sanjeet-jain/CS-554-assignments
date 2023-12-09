"use client";
import Loading from "@/components/ui/loading";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const query = gql`
  query Query {
    authors {
      _id
      first_name
      last_name
      numOfBooks
    }
  }
`;

function useFetchAuthors() {
  const { data, error, loading } = useQuery(query);
  return { data, error, loading };
}

const Authors = () => {
  // const { data } = await getClient().query({ query: userQuery });
  const { data, error, loading } = useFetchAuthors();
  if (error) {
    return <div>Error</div>;
  }
  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="grid grid-cols-5">
        {data?.authors?.map((author: any) => (
          <Card key={author?._id} className="flex flex-col justify-center">
            <CardHeader>
              <Link href={`/authors/${author?._id}`}>
                <CardTitle className="text-2xl">
                  {author?.first_name} {author?.last_name}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent></CardContent>
            <CardFooter>lorem ipsum</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Authors;
