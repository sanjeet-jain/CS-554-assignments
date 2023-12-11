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
import SearchAuthorsByName from "@/components/searchAuthorsByName";

const formSchema = z.object({
  searchTerm: z.string(),
});

const Search = () => {
  const [searchTerm_booksByGenre, setSearchTerm_booksByGenre] = useState("");

  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(0);
  function handleSetMinPrice(value: string) {
    SetminPrice_static(Number(value));
  }
  function handleSetMaxPrice(value: string) {
    SetmaxPrice_static(Number(value));
  }
  const [searchTerm_searchAuthorsByName, setSearchTerm_searchAuthorsByName] =
    useState("");

  const [searchTerm_booksByGenre_static, SetsearchTerm_booksByGenre_static] =
    useState("");
  const [
    searchTerm_searchAuthorsByName_static,
    SetsearchTerm_searchAuthorsByName_static,
  ] = useState("");
  const [minPrice_static, SetminPrice_static] = useState(0);
  const [maxPrice_static, SetmaxPrice_static] = useState(0);

  const [showBooksByGenre, setShowBooksByGenre] = useState(false);
  const [showBooksByPriceRange, setShowBooksByPriceRange] = useState(false);
  const [showSearchAuthorsByName, setShowSearchAuthorsByName] = useState(false);

  const handleToggleShowBooksByGenre = () => {
    setShowBooksByGenre(!showBooksByGenre);
    setShowBooksByPriceRange(false);
    setShowSearchAuthorsByName(false);
    setSearchTerm_booksByGenre(searchTerm_booksByGenre_static);
  };
  const handleToggleShowBooksByPriceRange = () => {
    setShowBooksByPriceRange(!showBooksByPriceRange);
    setShowBooksByGenre(false);
    setShowSearchAuthorsByName(false);
    setMinPrice(minPrice_static);
    setMaxPrice(maxPrice_static);
  };
  const handleToggleShowSearchAuthorsByName = () => {
    setShowSearchAuthorsByName(!showSearchAuthorsByName);
    setShowBooksByGenre(false);
    setShowBooksByPriceRange(false);
    setSearchTerm_searchAuthorsByName(searchTerm_searchAuthorsByName_static);
  };

  return (
    <div>
      <Tabs>
        <TabsList>
          <TabsTrigger value="booksByGenre">booksByGenre</TabsTrigger>
          <TabsTrigger value="booksByPriceRange">booksByPriceRange</TabsTrigger>
          <TabsTrigger value="searchAuthorsByName">
            searchAuthorsByName
          </TabsTrigger>
        </TabsList>
        <TabsContent value="booksByGenre">
          <div>
            <div className="w-[400px]">
              <Input
                value={searchTerm_booksByGenre_static}
                type="text"
                name="searchTerm"
                placeholder=""
                onChange={(e) =>
                  SetsearchTerm_booksByGenre_static(e.target.value)
                }
              />
              <Button onClick={() => handleToggleShowBooksByGenre()}>
                Search
              </Button>
            </div>
          </div>
          <div>
            booksByGenre Results
            <br />
            <br />
            <div>
              {showBooksByGenre && searchTerm_booksByGenre !== "" ? (
                <div>
                  <BooksByGenreSearch searchTerm={searchTerm_booksByGenre} />
                </div>
              ) : (
                <div>Please Enter a Search Query</div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="booksByPriceRange">
          <div>
            <div className="w-[400px]">
              <Input
                value={minPrice_static}
                type="number"
                name="minPrice"
                placeholder=""
                onChange={(e) => handleSetMinPrice(e.target.value)}
              />
              <Input
                value={maxPrice_static}
                type="number"
                name="maxPrice"
                placeholder=""
                onChange={(e) => handleSetMaxPrice(e.target.value)}
              />
              <Button onClick={() => handleToggleShowBooksByPriceRange()}>
                Search
              </Button>
            </div>
          </div>
          <div>
            booksByPriceRange Results
            <br />
            <br />
            <div>
              {showBooksByPriceRange && minPrice !== 0 && maxPrice !== 0 ? (
                <div>
                  <BooksByPriceRange min={minPrice} max={maxPrice} />
                </div>
              ) : (
                <div>Please Enter a Max or Min value</div>
              )}
            </div>
          </div>
        </TabsContent>
        <TabsContent value="searchAuthorsByName">
          <div>
            <div className="w-[400px]">
              <Input
                value={searchTerm_searchAuthorsByName_static}
                type="text"
                name="searchTerm"
                placeholder=""
                onChange={(e) =>
                  SetsearchTerm_searchAuthorsByName_static(e.target.value)
                }
              />
              <Button onClick={() => handleToggleShowSearchAuthorsByName()}>
                Search
              </Button>
            </div>
            <div>
              searchAuthorsByName Results
              <br />
              <br />
              <div>
                {showSearchAuthorsByName &&
                searchTerm_searchAuthorsByName !== "" ? (
                  <div>
                    <SearchAuthorsByName
                      searchTerm={searchTerm_searchAuthorsByName}
                    />
                  </div>
                ) : (
                  <div>Please Enter Author First or Last Name </div>
                )}
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Search;
