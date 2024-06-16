import Image from "next/image";
import SEO from "@/components/SEO";
import styles from "./index.module.css";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import useApi from "@hooks/useApi";
import { Community } from "@server/database";
import { BsFillPeopleFill, BsGlobe } from "react-icons/bs";
import { numberWithCommas } from "@utils/utils";
import Loading from "@components/Loading";
import { VscDebugRestart } from "react-icons/vsc";
import LoadOrRetry from "@components/LoadOrRetry";
import Wrapper from "@components/Wrapper";
import { useRef } from "react";

export default function Home() {
  const searchQuery = useRef("");
  const {
    data: communities,
    error: communitiesError,
    fetching: communitiesFetching,
    refetch: refetchCommunities,
  } = useApi<Community[]>("communities");

  const handleSearchChangeText = (event) => {
    searchQuery.current = event.target.value?.trim().toLowerCase();
    if (!searchQuery.current) {
      refetchCommunities();
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.current.trim()) {
      const encodedSearch = encodeURIComponent(searchQuery.current);
      refetchCommunities(`communities?search=${encodedSearch}`);
    } else {
      refetchCommunities();
    }
  };

  return (
    <>
      <SEO />
      <Wrapper>
        <h2 className="text-xl font-bold mb-4 text-center text-green mt-6">
          Welcome to Archiverse!
        </h2>
        <div className="flex justify-center mt-8">
          <Image
            src={"/welcome-image.png"}
            alt={"welcome image"}
            width={430}
            height={204}
          />
        </div>
        <p className="text-sm mt-6 text-neutral-700">
          Archiverse is an archive of Miiverse, a social media platform for the
          Nintendo Wii U and 3DS which ran from November 18, 2012 until November
          8, 2017. This archive stores millions of archived Miiverse users,
          posts, drawings, comments, and more, totaling over 17TB of data.
        </p>
        <div className="mt-4 flex justify-between border-b-4 mx-[-16px] px-4 py-2 border-green">
          <h1 className="text-green font-bold sm:text-lg text-sm">
            Communities
          </h1>
          <form
            onSubmit={handleSearch}
            className="flex items-center relative"
          >
            <input
              type="text"
              onChange={handleSearchChangeText}
              placeholder="Search Communities"
              className="rounded-md pl-2 sm:pr-10 pr-4 bg-neutral-200 sm:text-sm py-1 placeholder-neutral-500 text-xs"
            />
            <button
              type="submit"
              className="absolute right-2 bg-neutral-200 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
            >
              <FaSearch className="text-neutral-500 hover:text-neutral-700 sm:text-sm text-xs" />
            </button>
          </form>
        </div>

        {communities?.map((community) => {
          return (
            <Link
              key={"community " + community.GameID + community.TitleID}
              className="flex py-2 border-b-[1px] border-gray hover:brightness-95 bg-white cursor-pointer"
              href={"/title/" + community.TitleID + "/" + community.GameID}
            >
              <img
                src={
                  community.CommunityIconUrl ?? community.CommunityListIconUrl
                }
                alt={community.GameTitle + " Icon"}
                className="w-[54px] h-[54px] rounded-md border-gray border-[1px] mr-4"
              />
              <div>
                <h2 className="font-bold sm:text-base text-sm mt-1">
                  {community.CommunityTitle}
                </h2>
                <div className="flex mt-1">
                  <h3 className="flex items-center justify-center font-light text-xs sm:text-sm text-neutral-500 mr-4">
                    <BsFillPeopleFill className="mr-1 mb-[.5px]" />
                    {numberWithCommas(community.NumPosts)}
                  </h3>
                  <h3 className="flex items-center justify-center font-light text-xs sm:text-sm text-neutral-500">
                    <BsGlobe className="mr-1" />
                    {community.Region}
                  </h3>
                </div>
              </div>
            </Link>
          );
        })}
        <div className="flex justify-center items-center">
          <LoadOrRetry
            fetching={communitiesFetching}
            error={communitiesError}
            refetch={refetchCommunities}
            className="mt-4"
          />

          {!communitiesFetching && communities?.length === 0 && (
            <h3 className="text-neutral-400 mt-[15px] mb-[6px] font-light text-base">
              No communities found.
            </h3>
          )}
        </div>
      </Wrapper>
    </>
  );
}
