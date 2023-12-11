"use client";
import React, { useState } from "react";
import dayjs from "dayjs";
import Loading from "@/components/ui/loading";
import { DocumentNode, gql, useMutation } from "@apollo/client";
import { useQuery } from "@apollo/experimental-nextjs-app-support/ssr";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Calendar as CalendarIcon } from "lucide-react";
import { format, set } from "date-fns";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const formSchema = z.object({
  searchTerm: z.string(),
});
const booksByGenre_searchQuery = gql`
  query Query($genre: String!) {
    booksByGenre(genre: $genre) {
      _id
      author {
        first_name
        _id
        last_name
      }
      format
      genres
      isbn
      language
      pageCount
      price
      publicationDate
      publisher
      summary
      title
    }
  }
`;

interface BooksByGenreSearchProps {
  searchTerm: string;
}

const BooksByGenreSearch: React.FC<BooksByGenreSearchProps> = ({
  searchTerm,
}) => {
  const { data, loading, error, refetch } = useQuery(booksByGenre_searchQuery, {
    fetchPolicy: "no-cache",
    variables: {
      genre: searchTerm,
    },
  });
  if (loading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="grid grid-cols-4 gap-4">
      {data?.booksByGenre?.map((book: any) => (
        <Card key={book._id}>
          <CardHeader>
            <CardTitle>{book.title}</CardTitle>
            <CardDescription>{book.summary}</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Author: {book.author.first_name}</p>
            <p>Format: {book.format}</p>
            <p>Genres: {book.genres.join(", ")}</p>
            <p>ISBN: {book.isbn}</p>
            <p>Language: {book.language}</p>
            <p>Page Count: {book.pageCount}</p>
            <p>Price: {book.price}</p>
            <p>
              Publication Date:{" "}
              {format(new Date(book.publicationDate), "MM/dd/yyyy")}
            </p>
            <p>Publisher: {book.publisher}</p>
          </CardContent>
          <CardFooter>
            <Link href={`/books/${book._id}`}>
              <Button>View</Button>
            </Link>
          </CardFooter>
        </Card>
      ))}
    </div>
  );
};
export default BooksByGenreSearch;
