"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Post } from "@server/database";
import { queryAPI } from "@utils/queryAPI";
import LoadOrRetry from "@components/LoadOrRetry";
import PostCard from "@components/PostCard";
import MiiverseSymbol from "@components/MiiverseSymbol";
import useSWR from "swr";

export default function RandomPosts({ randomPosts: pulledRandomPosts }) {
  const [randomPosts, setRandomPosts] = useState<{
    data: Post[];
    currentIndex: number;
    fetching: boolean;
    error: string;
  }>({
    data: pulledRandomPosts,
    currentIndex: 0,
    fetching: false,
    error: null,
  });

  const fetchRandomPosts = async () => {
    if (randomPosts.fetching) {
      return;
    }
    setRandomPosts((prevState) => ({
      ...prevState,
      fetching: true,
      data: [],
      currentIndex: 0,
    }));

    const response = await fetch("/api/posts_random");
    const data = await response.json();
    // if (error) {
    //   setRandomPosts((prevState) => ({
    //     ...prevState,
    //     fetching: false,
    //     error: error,
    //   }));
    //   return;
    // }
    setRandomPosts((prevState) => ({
      ...prevState,
      fetching: false,
      error: null,
      data: data,
      currentIndex: 0,
    }));
  };

  const handleGenerate = () => {
    if (randomPosts.currentIndex < randomPosts.data.length - 1) {
      setRandomPosts((prevState) => ({
        ...prevState,
        currentIndex: prevState.currentIndex + 1,
      }));
    } else {
      fetchRandomPosts();
    }
  };

  return (
    <div>
      <div className="mt-4 flex justify-between border-b-4 mx-[-16px] px-4 py-2 border-green mb-3 items-end">
        <div className="flex items-end">
          <MiiverseSymbol
            symbol={"star_fill"}
            className="fill-green sm:h-5 sm:w-5 h-4 w-4 mr-2 sm:mb-[6px] mb-1"
          />
          <h1 className="text-green font-bold sm:text-lg text-sm">
            Random Post
          </h1>
        </div>
        <button
          onClick={handleGenerate}
          className="md:ml-2 hover:brightness-95 inline-flex justify-center items-center bg-gradient-to-b from-white border-[1px] rounded-md border-gray text-neutral-600 to-neutral-200 font-medium py-[2px] px-4 mt-4 md:mt-0 md:text-base text-sm"
        >
          <h1 className="">Generate</h1>
        </button>
      </div>

      {!randomPosts.data.length || randomPosts.fetching ? (
        <div className="flex justify-center items-center h-[280px]">
          <LoadOrRetry
            fetching={randomPosts.fetching}
            error={randomPosts.error}
            refetch={fetchRandomPosts}
          />
        </div>
      ) : (
        <div className="w-full">
          <Link
            href={`/posts/${randomPosts.data[randomPosts.currentIndex].ID}`}
          >
            <PostCard
              key={randomPosts.data[randomPosts.currentIndex].ID}
              post={randomPosts.data[randomPosts.currentIndex]}
              variant={"list"}
            />
          </Link>
        </div>
      )}
    </div>
  );
}
