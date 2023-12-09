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
  first_name: z
    .string({
      required_error: "first_name is required.",
    })
    .trim()
    .min(2, {
      message: "First Name must be at least 1 characters.",
    }),
  last_name: z
    .string({
      required_error: "last_name is required.",
    })
    .trim()
    .min(2, {
      message: "Last Name must be at least 1 characters.",
    }),
  hometownCity: z
    .string({
      required_error: "hometownCity is required.",
    })
    .trim()
    .min(2, {
      message: "hometownCity must be at least 1 characters.",
    }),
  hometownState: z
    .string({
      required_error: "hometownState is required.",
    })
    .trim()
    .min(2, {
      message: "hometownCity must be at least 1 characters.",
    }),
  date_of_birth: z
    .date()
    .min(new Date("1900-01-01"), {
      message: "Date of birth must be after 1900.",
    })
    .max(new Date(), {
      message: "Date of birth must be after 1900.",
    }),
});

const getAllAuthors = gql`
  query Query {
    authors {
      _id
      first_name
      last_name
      numOfBooks
      hometownCity
      hometownState
      date_of_birth
    }
  }
`;

const deleteAuthorMutation = gql`
  mutation RemoveAuthor($id: String!) {
    removeAuthor(_id: $id) {
      _id
    }
  }
`;

const editAuthorMutation = gql`
  mutation Mutation(
    $id: String!
    $firstName: String
    $lastName: String
    $dateOfBirth: String
    $hometownCity: String
    $hometownState: String
  ) {
    editAuthor(
      _id: $id
      first_name: $firstName
      last_name: $lastName
      date_of_birth: $dateOfBirth
      hometownCity: $hometownCity
      hometownState: $hometownState
    ) {
      _id
      date_of_birth
      first_name
      hometownCity
      hometownState
      last_name
      numOfBooks
    }
  }
`;

const addAuthorMutation = gql`
  mutation Mutation(
    $firstName: String!
    $lastName: String!
    $dateOfBirth: String!
    $hometownCity: String!
    $hometownState: String!
  ) {
    addAuthor(
      first_name: $firstName
      last_name: $lastName
      date_of_birth: $dateOfBirth
      hometownCity: $hometownCity
      hometownState: $hometownState
    ) {
      _id
    }
  }
`;

function useFetchAuthors() {
  const { data, error, loading, refetch } = useQuery(getAllAuthors);
  return { data, error, loading };
}

const Authors = () => {
  const { data, error, loading } = useFetchAuthors();
  const [isDialogOpen, setOpen] = useState(false);
  const [removeAuthor] = useMutation(deleteAuthorMutation, {
    refetchQueries: [
      getAllAuthors, // DocumentNode object parsed with gql
      "getAllAuthors", // Query name
    ],
  });
  const [editAuthor] = useMutation(editAuthorMutation, {
    refetchQueries: [
      getAllAuthors, // DocumentNode object parsed with gql
      "getAllAuthors", // Query name
    ],
  });
  const [addAuthor] = useMutation(addAuthorMutation, {
    refetchQueries: [
      getAllAuthors, // DocumentNode object parsed with gql
      "getAllAuthors", // Query name
    ],
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      first_name: "",
      last_name: "",
      date_of_birth: undefined,
      hometownCity: "",
      hometownState: "",
    },
  });

  // 2. Define a submit handler.
  async function onSubmit(values: z.infer<typeof formSchema>) {
    await handleEditAuthor(values);
    alert("Success! Please close the form ");
    form.reset();
  }
  async function onSubmitADD(values: z.infer<typeof formSchema>) {
    console.log(values);
    await handleAddAuthor(values);
    alert("Success! Please close the form ");
    form.reset();
  }

  if (error) {
    return <div>Error</div>;
  }
  if (loading) {
    return <Loading />;
  }

  function setFormData(author: any) {
    console.log(author);
    form.reset({
      id: author?._id,
      first_name: author?.first_name,
      last_name: author?.last_name,
      date_of_birth: dayjs(author?.date_of_birth).toDate(),
      hometownCity: author?.hometownCity,
      hometownState: author?.hometownState,
    });
  }

  const handleDeleteAuthor = async (id: string) => {
    try {
      await removeAuthor({ variables: { id } });
    } catch (error) {
      alert("Error deleting author:" + error);
    }
  };
  const handleEditAuthor = async (values: any) => {
    try {
      const result = await editAuthor({
        variables: {
          id: values.id,
          firstName: values.first_name.toString().trim(),
          lastName: values.last_name.toString().trim(),
          dateOfBirth: dayjs(values.date_of_birth).format("DD/MM/YYYY"),
          hometownCity: values.hometownCity.toString().trim(),
          hometownState: values.hometownState.toString().trim(),
        },
      });
      console.log("result", result);
    } catch (error) {
      alert("Error editing author:" + error);
    }
  };
  const resetForm = (value: any) => {
    form.reset();
  };

  const handleAddAuthor = async (values: any) => {
    try {
      const result = await addAuthor({
        variables: {
          id: values.id,
          firstName: values.first_name.toString().trim(),
          lastName: values.last_name.toString().trim(),
          dateOfBirth: dayjs(values.date_of_birth).format("DD/MM/YYYY"),
          hometownCity: values.hometownCity.toString().trim(),
          hometownState: values.hometownState.toString().trim(),
        },
      });
      console.log("result", result);
    } catch (error) {
      alert("Error editing author:" + error);
    }
  };

  return (
    <div>
      <div className="p-0 m-10 grid grid-cols-6 gap-6">
        <Dialog onOpenChange={resetForm}>
          <DialogTrigger asChild>
            <Button variant="outline">ADD AUTHOR</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] border border-white bg-black">
            <DialogHeader>
              <DialogTitle>ADD Author</DialogTitle>
              <DialogDescription>
                Make changes to ADD Author here. Click save when you are done.
              </DialogDescription>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmitADD)}
                className="space-y-8"
              >
                <input type="hidden" value="" {...form.register("id")} />
                <FormField
                  control={form.control}
                  name="first_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your first name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="last_name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel> Last Name</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>This is your last name</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="date_of_birth"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>Date of birth</FormLabel>
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
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            className="bg-black"
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date > new Date() || date < new Date("1900-01-01")
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>Your date of birth.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hometownCity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>hometownCity</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your hometownCity.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="hometownState"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>hometownState</FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          value={field.value ?? ""}
                        />
                      </FormControl>
                      <FormDescription>
                        This is your hometownState.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit">Submit</Button>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
      <div className="p-0 m-10 grid grid-cols-6 gap-6">
        {data?.authors?.map((author: any) => (
          <Card key={author?._id} className="flex flex-col justify-center">
            <CardHeader>
              <Link href={`/authors/${author?._id}`}>
                <CardTitle className="text-2xl">
                  {author?.first_name} {author?.last_name}
                </CardTitle>
              </Link>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-2">
              <Button
                className="border border-white text-white"
                onClick={() => handleDeleteAuthor(author._id)}
              >
                DELETE
              </Button>

              <Dialog onOpenChange={resetForm}>
                <DialogTrigger asChild>
                  <Button variant="outline" onClick={() => setFormData(author)}>
                    EDIT
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px] border border-white bg-black">
                  <DialogHeader>
                    <DialogTitle>Edit Author</DialogTitle>
                    <DialogDescription>
                      Make changes to Author here. Click save when you are done.
                    </DialogDescription>
                  </DialogHeader>
                  <Form {...form}>
                    <form
                      onSubmit={form.handleSubmit(onSubmit)}
                      className="space-y-8"
                    >
                      <input
                        type="hidden"
                        value={author._id}
                        {...form.register("id")}
                      />
                      <FormField
                        control={form.control}
                        name="first_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> First Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your first name.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="last_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel> Last Name</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your last name
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="date_of_birth"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Date of birth</FormLabel>
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
                        name="hometownCity"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>hometownCity</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your hometownCity.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="hometownState"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>hometownState</FormLabel>
                            <FormControl>
                              <Input
                                placeholder=""
                                {...field}
                                value={field.value ?? ""}
                              />
                            </FormControl>
                            <FormDescription>
                              This is your hometownState.
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Submit</Button>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </CardContent>
            <CardFooter>Number of Books: {author.numOfBooks}</CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Authors;
