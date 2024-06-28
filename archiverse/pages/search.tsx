import Image from "next/image";
import SEO from "@/components/SEO";
import styles from "./index.module.css";
import Link from "next/link";
import { Community, Post, User } from "@server/database";
import { numberWithCommas } from "@utils/utils";
import Loading from "@components/Loading";
import LoadOrRetry from "@components/LoadOrRetry";
import Wrapper from "@components/Wrapper";
import { useEffect, useRef, useState } from "react";
import { queryAPI } from "@utils/queryAPI";
import { IMAGES } from "@constants/constants";
import MiiverseSymbol from "@components/MiiverseSymbol";
import PostCard from "@components/PostCard";

export default function Home() {
  const searchQuery = useRef("");

  const [usersChecked, setUsersChecked] = useState(true);
  const [postsChecked, setPostsChecked] = useState(false);

  const [users, setUsers] = useState<{
    data: User[];
    fetching: boolean;
    error: string;
  }>({
    data: null,
    fetching: false,
    error: null,
  });

  const [posts, setPosts] = useState<{
    data: Post[];
    fetching: boolean;
    error: string;
  }>({
    data: null,
    fetching: false,
    error: null,
  });

  const handleSearchChangeText = (event) => {
    searchQuery.current = event.target.value;
  };

  const fetchUsers = async () => {
    if (users.fetching) {
      return;
    }

    setUsers((prevState) => ({
      ...prevState,
      data: null,
      fetching: true,
      error: null,
    }));
    const encodedSearch = encodeURIComponent(
      searchQuery.current?.trim().toLowerCase()
    );
    const { data, error } = await queryAPI<User[]>(
      `users?search=${encodedSearch}`
    );

    setUsers((prevState) => ({
      ...prevState,
      fetching: false,
      data: data ?? [],
      error: error,
    }));
  };

  const fetchPosts = async () => {
    if (posts.fetching) {
      return;
    }

    setPosts((prevState) => ({
      ...prevState,
      data: null,
      fetching: true,
      error: null,
    }));
    const encodedSearch = encodeURIComponent(searchQuery.current);
    const { data, error } = await queryAPI<Post[]>(
      `posts?search=${encodedSearch}`
    );

    setPosts((prevState) => ({
      ...prevState,
      fetching: false,
      data: data ?? [],
      error: error,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.current.trim()) {
      setPosts((prevState) => ({
        ...prevState,
        data: null,
      }));
      setUsers((prevState) => ({
        ...prevState,
        data: null,
      }));

      if (usersChecked) {
        fetchUsers();
      }
      if (postsChecked) {
        fetchPosts();
      }
    }
  };

  return (
    <>
      <SEO title={"Search Users"} makeDescriptionBlank={true} />
      <Wrapper>
        <div className="flex bg-[#f6f6f6] text-neutral-700 font-semibold border-b-[1px] border-gray mt-[-16px] mx-[-16px] px-2 py-1 text-base">
          Users & Posts
        </div>
        <div>
          <form
            onSubmit={handleSearch}
            className="flex items-center relative w-full mt-4"
          >
            <input
              type="text"
              onChange={handleSearchChangeText}
              placeholder="Search Miiverse"
              className="rounded-md pl-2 sm:pr-10 pr-4 bg-neutral-200 md:text-sm py-1 placeholder-neutral-500 text-xs w-full"
            />
            <button
              type="submit"
              className="absolute right-2 bg-neutral-200 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
            >
              <MiiverseSymbol
                className="fill-neutral-500 hover:fill-neutral-700 sm:h-4 sm:w-4 h-3 w-3"
                symbol={"magnifying_glass"}
              />
            </button>
          </form>
          <div className="flex mt-2 justify-center items-center mb-4">
            <label
              className={`mr-6 text-xs ${
                usersChecked ? "text-neutral-700" : "text-neutral-500"
              } items-center justify-center flex`}
            >
              <input
                type="checkbox"
                className="mr-2 h-3 w-3 accent-green"
                checked={usersChecked}
                onChange={(e) => setUsersChecked(e.target.checked)}
              />
              Users by NNID
            </label>
            <label
              className={`mr-6 text-xs ${
                postsChecked ? "text-neutral-700" : "text-neutral-500"
              } items-center justify-center flex`}
            >
              <input
                type="checkbox"
                className="mr-2 h-3 w-3 accent-green"
                checked={postsChecked}
                onChange={(e) => setPostsChecked(e.target.checked)}
              />
              Posts
            </label>
          </div>
        </div>

        {users.data && (
          <div className="mt-4 flex justify-between border-b-4 mx-[-16px] px-4 py-2 border-green mb-2 items-end">
            <div className="flex items-end">
              <MiiverseSymbol
                symbol={"silhouette"}
                className="fill-green sm:h-5 sm:w-5 h-4 w-4 mr-2 sm:mb-[5px] mb-[2px]"
              />
              <h1 className="text-green font-bold sm:text-lg text-sm">Users</h1>
            </div>
          </div>
        )}

        {users.data?.map((user, index) => {
          return (
            <Link
              key={"community " + user.NNID + " Index " + index}
              className={`flex p-2 ${
                index === users.data.length - 1 ? "mb-2" : "border-b-[1px]"
              } border-gray hover:brightness-95 bg-white cursor-pointer`}
              href={`/users/${user.NNID}`}
            >
              <div className="w-[54px] h-[54px] flex-shrink-0 rounded-md border-gray border-[1px] mr-4">
                <img
                  src={user.MiiUrl}
                  alt={user.MiiName + " Icon"}
                  className="w-full h-full object-cover rounded-md"
                  onError={({ currentTarget }) => {
                    currentTarget.onerror = null; // prevents looping
                    currentTarget.src = IMAGES.unknownMii;
                  }}
                />
              </div>
              <div className="flex flex-col justify-between">
                <h2 className="font-bold text-base">
                  {user.MiiName}
                  <span className="ml-2 font-normal text-xs text-[#797979]">
                    {user.NNID}
                  </span>
                </h2>
                <div className="h-full flex-col justify-center items-center">
                  <h2 className="font-normal text-xs text-neutral-800 overflow-hidden overflow-ellipsis line-clamp-2">
                    {user.Bio}
                  </h2>
                </div>
              </div>
            </Link>
          );
        })}

        {!users.fetching && users.data?.length === 0 && !users.error && (
          <h3 className="text-neutral-400 mt-[20px] font-normal text-base text-center">
            No users found.
          </h3>
        )}

        <div className="flex justify-center items-center">
          <LoadOrRetry
            fetching={users.fetching}
            error={users.error}
            refetch={() => fetchUsers()}
          />
        </div>

        {posts.data && (
          <div className="flex justify-between border-b-4 mx-[-16px] px-4 py-2 border-green mb-1 items-end">
            <div className="flex items-end">
              <MiiverseSymbol
                symbol={"comment"}
                className="fill-green sm:h-5 sm:w-5 h-4 w-4 mr-2 sm:mb-[4px] mb-[1px]"
              />
              <h1 className="text-green font-bold sm:text-lg text-sm">Posts</h1>
            </div>
          </div>
        )}

        {posts.data?.map((post, index) => {
          return (
            <Link
              key={"post " + post.NNID + " Index " + index}
              className={`flex pb-2 ${
                index === posts.data.length - 1 ? "mb-2" : "border-b-[1px]"
              } border-gray hover:brightness-95 bg-white cursor-pointer`}
              href={`/posts/${post.ID}`}
            >
              <PostCard post={post} variant={"list"} />
            </Link>
          );
        })}
        {!posts.fetching && posts.data?.length === 0 && !posts.error && (
          <h3 className="text-neutral-400 mt-[20px] font-normal text-base text-center">
            No posts found.
          </h3>
        )}
        <div className="flex justify-center items-center mt-6">
          <LoadOrRetry
            fetching={posts.fetching}
            error={users.error}
            refetch={() => fetchPosts()}
          />
        </div>
      </Wrapper>
    </>
  );
}

export const getServerSideProps = async (context) => {
  return {
    props: {},
  };
};
