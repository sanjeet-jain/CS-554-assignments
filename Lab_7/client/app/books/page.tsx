"use client";
import dayjs from "dayjs";
import * as React from "react";
import Loading from "@/components/ui/loading";
import { gql, useMutation } from "@apollo/client";
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
import { format } from "date-fns";
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
const formSchema = z.object({
  id: z.string().readonly(),
  authorId: z.string().readonly(),
  title: z.string().trim().min(1, {
    message: "title must be at least 1 characters.",
  }),
  genres: z.string().min(1),
  format: z.string().min(1),
  publicationDate: z.date(),
  publisher: z.string().trim().min(1, {
    message: "publisher must be at least 1 characters.",
  }),
  summary: z.string().trim().min(1, {
    message: "summary must be at least 1 characters.",
  }),
  isbn: z.string().trim().min(1, {
    message: "isbn must be at least 1 characters.",
  }),
  language: z.string().trim().min(1, {
    message: "language must be at least 1 characters.",
  }),
  pageCount: z.number(),
  price: z.number(),
});

const getAllBooks = gql`
  query Query {
    books {
      _id
      author {
        _id
        first_name
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

const deletebookMutation = gql`
  mutation RemoveBook($id: String!) {
    removeBook(_id: $id) {
      _id
    }
  }
`;

const editbookMutation = gql`
  mutation Mutation(
    $id: String!
    $title: String
    $genres: [String]
    $publicationDate: String
    $publisher: String
    $summary: String
    $isbn: String
    $language: String
    $pageCount: Int
    $price: Float
    $format: [String]
    $authorId: String
  ) {
    editBook(
      _id: $id
      title: $title
      genres: $genres
      publicationDate: $publicationDate
      publisher: $publisher
      summary: $summary
      isbn: $isbn
      language: $language
      pageCount: $pageCount
      price: $price
      format: $format
      authorId: $authorId
    ) {
      _id
    }
  }
`;

const addbookMutation = gql`
  mutation Mutation(
    $title: String!
    $genres: [String!]!
    $publicationDate: String!
    $publisher: String!
    $summary: String!
    $isbn: String!
    $language: String!
    $pageCount: Int!
    $price: Float!
    $format: [String!]!
    $authorId: String!
  ) {
    addBook(
      title: $title
      genres: $genres
      publicationDate: $publicationDate
      publisher: $publisher
      summary: $summary
      isbn: $isbn
      language: $language
      pageCount: $pageCount
      price: $price
      format: $format
      authorId: $authorId
    ) {
      _id
    }
  }
`;

function useFetchBooks() {
  const { data, error, loading, refetch } = useQuery(getAllBooks, {
    fetchPolicy: "no-cache",
  });
  return { data, error, loading };
}

const Books = () => {
  const { data, error, loading } = useFetchBooks();
  const [removebook] = useMutation(deletebookMutation, {
    refetchQueries: [
      getAllBooks, // DocumentNode object parsed with gql
      "getAllBooks", // Query name
    ],
  });
  const [editbook] = useMutation(editbookMutation, {
    refetchQueries: [
      getAllBooks, // DocumentNode object parsed with gql
      "getAllBooks", // Query name
    ],
  });
  const [addbook] = useMutation(addbookMutation, {
    refetchQueries: [
      getAllBooks, // DocumentNode object parsed with gql
      "getAllBooks", // Query name
    ],
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    // defaultValues: setFormData(),
  });
  function setFormData(book: any) {
    form.reset({
      id: book._id,
      title: book.title,
      genres: book.genres.join(","),
      publicationDate: dayjs(book.publicationDate).toDate(),
      publisher: book.publisher,
      summary: book.summary,
      isbn: book.isbn,
      language: book.language,
      pageCount: book.pageCount,
      price: book.price,
      format: book.format.join(","),
    });
  }

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleEditbook({
      id: values.id,
      authorId: values.authorId,
      title: values.title,
      publicationDate: dayjs(values.publicationDate).format("MM/DD/YYYY"),
      publisher: values.publisher,
      summary: values.summary,
      isbn: values.isbn,
      language: values.language,
      pageCount: Number(values.pageCount),
      price: Number(values.price),
      format: values.format.split(","),
      genres: values.genres.split(","),
    });
    alert("Success! Please close the form ");
    // form.reset();
  }

  if (error) {
    return <div>Error</div>;
  }
  if (loading) {
    return <Loading />;
  }

  const handleDeletebook = async (id: string) => {
    try {
      await removebook({ variables: { id } });
      alert("Deleted Book");
    } catch (error) {
      alert("Error deleting book:" + error);
    }
  };
  const handleEditbook = async (values: any) => {
    try {
      const result = await editbook({
        variables: {
          id: values.id,
          authorId: values.authorId,
          title: values.title,
          genres: values.genres,
          publicationDate: dayjs(values.publicationDate).format("MM/DD/YYYY"),
          publisher: values.publisher,
          summary: values.summary,
          isbn: values.isbn,
          language: values.language,
          pageCount: Number(values.pageCount),
          price: Number(values.price),
          format: values.format,
        },
      });
    } catch (error) {
      alert("Error editing book:" + error);
    }
  };
  const resetForm = (value: any) => {
    form.reset();
  };
  return (
    <div>
      <div className="p-0 m-10 grid grid-cols-6 gap-6">
        {data?.books?.map((book: any) => (
          <Card key={book?._id} className="flex flex-col justify-center">
            <CardHeader>
              <Link href={`/books/${book?._id}`}>
                <CardTitle className="text-2xl">{book?.title}</CardTitle>
              </Link>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              title: {book?.title}
              <br></br>
              genres: {book?.genres.join(", ")}
              <br></br>
              price: {book?.price}
              <br></br>
            </CardContent>
            <CardFooter>
              <Button
                className="border border-white text-white"
                onClick={() => handleDeletebook(book._id)}
              >
                DELETE
              </Button>
              <Dialog onOpenChange={resetForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setFormData(book)}>
                    EDIT
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] border border-white bg-black  h-3/4 overflow-x-auto">
                  <DialogHeader>
                    <DialogTitle>Edit book</DialogTitle>
                    <DialogDescription>
                      Make changes to book here. Click save when you are done.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <input
                        type="hidden"
                        value={book._id}
                        {...form.register("id")}
                      />
                      <input
                        type="hidden"
                        value={book.author._id}
                        {...form.register("authorId")}
                      />
                      <FormField
                        control={form.control}
                        name="title"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> title</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your title.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="publisher"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> publisher</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your publisher.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="summary"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> summary</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your summary.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="language"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> language</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your language.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="pageCount"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> pageCount</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                type="number"
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your pageCount.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="price"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> price</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your price.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="publicationDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>publicationDate</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "w-[240px] pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(field.value, "PPP")
                                    ) : (
                                      <span>Pick a date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  className="bg-black"
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  disabled={(date) =>
                                    date > new Date() ||
                                    date < new Date("1900-01-01")
                                  }
                                  initialFocus
                                />
                              </PopoverContent>
                            </Popover>
                            <FormDescription>
                              Your date of birth.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="genres"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Genres</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter genres separated by commas.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="format"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Format</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              Enter formats separated by commas.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isbn"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>ISBN</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>Enter ISBN.</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button className="border border-white" type="submit">
                        Submit
                      </Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Books;
