import Image from "next/image";
import SEO from "@/components/SEO";
import styles from "./index.module.css";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { Community, User } from "@server/database";
import { BsFillPeopleFill, BsGlobe } from "react-icons/bs";
import { numberWithCommas } from "@utils/utils";
import Loading from "@components/Loading";
import { VscDebugRestart } from "react-icons/vsc";
import LoadOrRetry from "@components/LoadOrRetry";
import Wrapper from "@components/Wrapper";
import { useEffect, useRef, useState } from "react";
import { queryAPI } from "@utils/queryAPI";
import { IMAGES } from "@constants/constants";

export default function Home() {
  const searchQuery = useRef("");

  const [users, setUsers] = useState<{
    data: User[];
    fetching: boolean;
    error: string;
  }>({
    data: null,
    fetching: false,
    error: null,
  });

  const handleSearchChangeText = (event) => {
    searchQuery.current = event.target.value?.trim().toLowerCase();
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
    const encodedSearch = encodeURIComponent(searchQuery.current);
    const { data, error } = await queryAPI<User[]>(
      `users?search=${encodedSearch}`
    );

    setUsers((prevState) => ({
      ...prevState,
      fetching: false,
      data: data,
      error: error,
    }));
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.current.trim()) {
      fetchUsers();
    }
  };

  return (
    <>
      <SEO />
      <Wrapper>
        <div className="flex bg-[#f6f6f6] text-[#969696] border-b-[1px] border-gray font-semibold mt-[-16px] mx-[-16px] md:rounded-t-md px-2 py-1 md:text-sm text-xs">
          Users
        </div>
        <form
          onSubmit={handleSearch}
          className="flex items-center relative w-full mt-4"
        >
          <input
            type="text"
            onChange={handleSearchChangeText}
            placeholder="Search by NNID"
            className="rounded-md pl-2 sm:pr-10 pr-4 bg-neutral-200 md:text-sm py-1 placeholder-neutral-500 text-xs w-full"
          />
          <button
            type="submit"
            className="absolute right-2 bg-neutral-200 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
          >
            <FaSearch className="text-neutral-500 hover:text-neutral-700 sm:text-sm text-xs" />
          </button>
        </form>

        {users.data?.map((user, index) => {
          return (
            <Link
              key={"community " + user.NNID + " Index " + index}
              className={`flex py-2 ${
                index === users.data.length - 1 ? "mb-2" : "border-b-[1px]"
              } border-gray hover:brightness-95 bg-white cursor-pointer`}
              href={`/user/${user.NNID}`}
            >
              <img
                src={user.MiiUrl}
                alt={user.MiiName + " Icon"}
                className="w-[54px] h-[54px] rounded-md border-gray border-[1px] mr-4"
                onError={({ currentTarget }) => {
                  currentTarget.onerror = null; // prevents looping
                  currentTarget.src = IMAGES.unknownMii;
                }}
              />
              <div className="flex flex-col justify-between">
                <h2 className="font-bold text-base">
                  {user.MiiName}
                  <span className="ml-2 font-light text-xs text-[#797979]">
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
        <div className="flex justify-center items-center mt-6">
          <LoadOrRetry
            fetching={users.fetching}
            error={users.error}
            refetch={() => fetchUsers()}
          />
        </div>
      </Wrapper>
    </>
  );
}
