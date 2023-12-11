// similar to booksByGenre.tsx:
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

const booksByPriceRange_searchQuery = gql`
  query Query($min: Float!, $max: Float!) {
    booksByPriceRange(min: $min, max: $max) {
      _id
      genres
      isbn
      pageCount
      language
      price
      publicationDate
      publisher
      summary
      title
      author {
        _id
        first_name
        last_name
      }
      format
    }
  }
`;
interface BooksByPriceRangeProps {
  min: number;
  max: number;
}
const BooksByPriceRange = ({ min, max }: BooksByPriceRangeProps) => {
  const { data, loading, error } = useQuery(booksByPriceRange_searchQuery, {
    variables: { min, max },
  });
  if (loading) return <Loading />;
  if (error) return <p>Error: {error.message}</p>;
  console.log(data);
  return (
    <div className="grid grid-cols-6 gap-4">
      {data.booksByPriceRange.map((book: any) => (
        <Card key={book._id}>
          <CardContent>
            <CardTitle>{book.title}</CardTitle>
            <CardDescription>{book.summary}</CardDescription>
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
export default BooksByPriceRange;
