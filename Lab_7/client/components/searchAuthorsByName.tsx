"use client";
import dayjs from "dayjs";
import * as React from "react";
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
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import BooksByGenreSearch from "@/components/booksByGenre";
import BooksByPriceRange from "@/components/booksByPriceRange";

const searchAuthorsByName_searchQuery = gql`
  query Query($searchTerm: String!) {
    searchAuthorsByName(searchTerm: $searchTerm) {
      _id
      books {
        _id
        genres
        format
        isbn
        language
        pageCount
        price
        publicationDate
        publisher
        title
        summary
      }
      date_of_birth
      first_name
      hometownCity
      hometownState
      last_name
      numOfBooks
    }
  }
`;
interface SearchAuthorsByNameProps {
  searchTerm: string;
}
const SearchAuthorsByName = ({ searchTerm }: SearchAuthorsByNameProps) => {
  const { data, loading, error } = useQuery(searchAuthorsByName_searchQuery, {
    variables: { searchTerm },
  });
  if (loading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  return (
    <div className="grid grid-cols-6 gap-4">
      {data.searchAuthorsByName.map((author: any) => (
        <Card key={author?._id} className="flex flex-col justify-center">
          <CardHeader>
            <Link href={`/authors/${author?._id}`}>
              <CardTitle className="text-2xl">
                {author?.first_name} {author?.last_name}
              </CardTitle>
            </Link>
          </CardHeader>
          <CardContent className=" gap-2">
            <div>first_name: {author.first_name}</div>
            <div>last_name: {author.last_name}</div>
            <div>date_of_birth: {author.date_of_birth}</div>
            <div>hometownCity: {author.hometownCity}</div>
            <div>hometownState: {author.hometownState}</div>
            <div>numOfBooks: {author.numOfBooks}</div>
            <div>
              books:{"  "}
              {author.books.map((book: any) => {
                return <div key={book._id}>{book.title}</div>;
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
export default SearchAuthorsByName;
