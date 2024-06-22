import Image from "next/image";
import SEO from "@/components/SEO";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { Community, Post, getHomepageDrawings } from "@server/database";
import { BsFillPeopleFill, BsGlobe } from "react-icons/bs";
import { numberWithCommas } from "@utils/utils";
import Loading from "@components/Loading";
import { VscDebugRestart } from "react-icons/vsc";
import LoadOrRetry from "@components/LoadOrRetry";
import Wrapper from "@components/Wrapper";
import { useEffect, useRef, useState } from "react";
import { queryAPI } from "@utils/queryAPI";
import HomepageDrawings from "@components/HomepageDrawings";

export default function Home({ drawings }) {
  const searchQuery = useRef("");
  const currentPage = useRef(1);

  const [communityList, setCommunityList] = useState<Community[]>(null);
  const [searchedCommunities, setSearchedCommunities] =
    useState<Community[]>(null);
  const [displaySearchResults, setDisplaySearchResults] =
    useState<boolean>(false);
  const [canPullMore, setCanPullMore] = useState(true);
  const [searchError, setSearchError] = useState<string>(null);
  const [communitiesError, setCommunitiesError] = useState(null);
  const [fetchingCommunities, setFetchingCommunities] = useState(false);

  const fetchNewCommunities = async () => {
    if (fetchingCommunities) {
      return;
    }
    setFetchingCommunities(true);
    setCommunitiesError(null);
    const { data, error } = await queryAPI<Community[]>(
      `communities?page=${currentPage.current}`
    );
    setFetchingCommunities(false);
    if (error) {
      console.log(error);
      setCommunitiesError(error);
      return;
    }
    if (data?.length === 0) {
      setCanPullMore(false);
      return;
    }
    if (!communityList) {
      setCommunityList(data);
    } else {
      setCommunityList((value) => [...value, ...data]);
    }
    currentPage.current = currentPage.current + 1;
  };

  const fetchSearchCommunities = async () => {
    if (fetchingCommunities) {
      return;
    }
    setSearchedCommunities([]);
    setFetchingCommunities(true);
    setSearchError(null);
    const encodedSearch = encodeURIComponent(searchQuery.current);
    const { data, error } = await queryAPI<Community[]>(
      `communities?search=${encodedSearch}`
    );
    setFetchingCommunities(false);
    if (error) {
      console.log(error);
      setSearchError(error);
      return;
    }
    setSearchedCommunities(data);
  };

  useEffect(() => {
    fetchNewCommunities();
  }, []);

  const handleSearchChangeText = (event) => {
    searchQuery.current = event.target.value?.trim().toLowerCase();
    if (!searchQuery.current) {
      setDisplaySearchResults(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.current.trim()) {
      setDisplaySearchResults(true);
      fetchSearchCommunities();
    } else {
      setDisplaySearchResults(false);
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
            height={137}
          />
        </div>
        <p className="text-sm mt-6 text-neutral-700">
          Archiverse is an archive of Miiverse, a social media platform for the
          Nintendo Wii U and 3DS which ran from November 18, 2012 until November
          8, 2017. This archive stores millions of archived Miiverse users,
          posts, drawings, comments, and more, totaling over 17TB of data.
        </p>
        {drawings && (
          <div>
            <div className="mt-4 flex justify-between border-b-4 mx-[-16px] px-4 py-2 border-green">
              <h1 className="text-green font-bold sm:text-lg text-sm">
                Popular Drawings
              </h1>
            </div>

            <HomepageDrawings posts={drawings} />
          </div>
        )}
        <div className="mt-4 flex justify-between border-b-4 mx-[-16px] px-4 py-2 border-green">
          <h1 className="text-green font-bold sm:text-lg text-sm">
            Communities
          </h1>
          <form onSubmit={handleSearch} className="flex items-center relative">
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

        {(displaySearchResults ? searchedCommunities : communityList)?.map(
          (community, index) => {
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
                  (displaySearchResults ? searchedCommunities : communityList)
                    .length -
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
          }
        )}

        {canPullMore &&
          !fetchingCommunities &&
          !displaySearchResults &&
          !communitiesError && (
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
            fetching={fetchingCommunities}
            error={displaySearchResults ? searchError : communitiesError}
            refetch={fetchNewCommunities}
            className="mt-4"
          />

          {!fetchingCommunities &&
            (displaySearchResults
              ? searchedCommunities?.length === 0 && !searchError
              : communityList?.length === 0 && !communitiesError) && (
              <h3 className="text-neutral-400 mt-[15px] mb-[6px] font-light text-base">
                No communities found.
              </h3>
            )}
        </div>
      </Wrapper>
    </>
  );
}

export const getServerSideProps = async (context) => {
  var drawings: Post[] = null;

  try {
    drawings = await getHomepageDrawings();
  } catch (e) {}

  return {
    props: {
      drawings,
    },
  };
};
