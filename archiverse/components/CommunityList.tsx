"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Community } from "@server/database";
import { queryAPI } from "@utils/queryAPI";
import { numberWithCommas } from "@utils/utils";
import LoadOrRetry from "@components/LoadOrRetry";
import MiiverseSymbol from "@components/MiiverseSymbol";

export default function CommunityList() {
  const searchQuery = useRef("");
  const currentPage = useRef(1);

  const [communityList, setCommunityList] = useState<{
    data: Community[];
    fetching: boolean;
    error: string;
    canPullMore: boolean;
  }>({
    data: [],
    fetching: false,
    error: null,
    canPullMore: true,
  });

  const [searchedCommunities, setSearchedCommunities] = useState<{
    data: Community[];
    fetching: boolean;
    error: string;
  }>({
    data: [],
    fetching: false,
    error: null,
  });

  const [displaySearchResults, setDisplaySearchResults] =
    useState<boolean>(false);
  const fetchNewCommunities = async () => {
    if (communityList.fetching) {
      return;
    }
    setCommunityList((prevState) => ({
      ...prevState,
      fetching: true,
    }));
    const { data, error } = await queryAPI<Community[]>(
      `communities?page=${currentPage.current}`
    );
    if (error) {
      console.log(error);
      setCommunityList((prevState) => ({
        ...prevState,
        fetching: false,
        error: error,
      }));
      return;
    }
    if (data?.length === 0) {
      setCommunityList((prevState) => ({
        ...prevState,
        canPullMore: false,
      }));
    }
    setCommunityList((prevState) => ({
      ...prevState,
      fetching: false,
      data: [...prevState.data, ...data],
    }));
    currentPage.current = currentPage.current + 1;
  };

  const fetchSearchCommunities = async () => {
    if (searchedCommunities.fetching) {
      return;
    }
    setSearchedCommunities((prevState) => ({
      ...prevState,
      fetching: true,
    }));
    const encodedSearch = encodeURIComponent(searchQuery.current);
    const { data, error } = await queryAPI<Community[]>(
      `communities?search=${encodedSearch}`
    );
    if (error) {
      console.log(error);
      setSearchedCommunities((prevState) => ({
        ...prevState,
        fetching: false,
        error: error,
      }));
      return;
    }
    setSearchedCommunities((prevState) => ({
      ...prevState,
      fetching: false,
      data: data,
    }));
  };

  return (
    <>
      {(displaySearchResults
        ? searchedCommunities.data
        : communityList.data
      )?.map((community, index) => {
        return (
          <Link
            key={
              "community " +
              community.GameID +
              community.TitleID +
              "index " +
              index
            }
            className={`flex py-2 ${
              index ===
              (displaySearchResults
                ? searchedCommunities.data
                : communityList.data
              ).length -
                1
                ? "mb-2"
                : "border-b-[1px]"
            } border-gray hover:brightness-95 bg-white cursor-pointer`}
            href={"/titles/" + community.TitleID + "/" + community.GameID}
          >
            <img
              src={community.CommunityIconUrl ?? community.CommunityBanner}
              alt={community.GameTitle + " Icon"}
              className="w-[54px] h-[54px] rounded-md border-gray border-[1px] mr-4"
            />
            <div>
              <h2 className="font-bold sm:text-base text-sm mt-1">
                {community.CommunityTitle}
              </h2>
              <div className="flex mt-1">
                <h3 className="flex items-center justify-center font-normal text-xs sm:text-sm text-neutral-500 mr-4">
                  <MiiverseSymbol
                    className="mr-[6px] h-4 w-4 fill-neutral-500 "
                    symbol={"silhouette_people"}
                  />
                  {numberWithCommas(community.NumPosts)}
                </h3>
                <h3 className="flex items-center justify-center font-normal text-xs sm:text-sm text-neutral-500">
                  <MiiverseSymbol
                    className="mr-[6px] h-4 w-4 fill-neutral-500 "
                    symbol={"globe"}
                  />
                  {community.Region}
                </h3>
              </div>
            </div>
          </Link>
        );
      })}

      {communityList.canPullMore &&
        !communityList.fetching &&
        !displaySearchResults &&
        !communityList.error && (
          <div className="flex justify-center items-center">
            <button
              onClick={fetchNewCommunities}
              className="md:ml-2 hover:brightness-95 inline-flex justify-center items-center bg-gradient-to-b from-white border-[1px] rounded-md border-gray text-neutral-600 to-neutral-200 font-medium py-2 px-8 mt-4 md:mt-0 md:text-base text-small"
            >
              <h1 className="">Show More</h1>
            </button>
          </div>
        )}
      <div className="flex justify-center items-center">
        <LoadOrRetry
          fetching={
            displaySearchResults
              ? searchedCommunities.fetching
              : communityList.fetching
          }
          error={
            displaySearchResults
              ? searchedCommunities.error
              : communityList.error
          }
          refetch={fetchNewCommunities}
          className="mt-4"
        />

        {(displaySearchResults
          ? searchedCommunities.data?.length === 0 &&
            !searchedCommunities.error &&
            !searchedCommunities.fetching
          : communityList.data?.length === 0 &&
            !communityList.error &&
            !communityList.fetching) && (
          <h3 className="text-neutral-400 mt-[15px] mb-[6px] font-normal text-base">
            No communities found.
          </h3>
        )}
      </div>
    </>
  );
}
