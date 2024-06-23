import Image from "next/image";
import SEO from "@/components/SEO";
import styles from "./index.module.css";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";
import { Community, User, getUserInfo } from "@server/database";
import { BsFillPeopleFill, BsGlobe } from "react-icons/bs";
import { numberWithCommas } from "@utils/utils";
import Loading from "@components/Loading";
import { VscDebugRestart } from "react-icons/vsc";
import LoadOrRetry from "@components/LoadOrRetry";
import Wrapper from "@components/Wrapper";
import { useEffect, useRef, useState } from "react";
import { queryAPI } from "@utils/queryAPI";
import { IMAGES } from "@constants/constants";

export default function Home({ user: pulledUser, user_id }) {
  const [showMore, setShowMore] = useState(false);

  const [user, setUser] = useState<{
    data: User;
    fetching: boolean;
    error: string;
  }>({
    data: pulledUser,
    fetching: false,
    error: null,
  });

  const fetchUser = async () => {
    if (user.fetching) {
      return;
    }

    setUser((prevState) => ({
      ...prevState,
      data: null,
      fetching: true,
      error: null,
    }));
    const { data, error } = await queryAPI<User>(`user/${user_id}`);

    setUser((prevState) => ({
      ...prevState,
      fetching: false,
      data: data,
      error: error,
    }));
  };

  const displayDashIfZero = (number) => {
    if (!number) {
      return "-";
    }
    return "" + number;
  };

  useEffect(() => {
    if (!user.data) {
      fetchUser();
    }
  }, []);

  return (
    <>
      <SEO />
      <Wrapper>
        {user.data.BannerUrl && (
          <div className="flex bg-[#f6f6f6] text-neutral-700 font-semibold border-b-[1px] border-gray mt-[-16px] mx-[-16px] text-base">
            <img
              src={user.data?.BannerUrl}
              className="w-full md:h-[195px] sm:h-[200px] h-[140px] object-cover object-center"
            />
          </div>
        )}
        <div className={`relative ${user.data.BannerUrl && "mt-[-12px]"} flex`}>
          <div className="bg-white inline-block border-[1px] border-gray rounded-md">
            <img src={user.data.MiiUrl} className="w-16 h-16 object-cover" />
          </div>
          <div
            className={` ${
              user.data.BannerUrl ? "mt-[16px]" : "mt-[4px]"
            } ml-4`}
          >
            <h1 className="font-bold text-base">{user.data.MiiName}</h1>
            <h2 className="font-normal text-base mt-[-3px] text-[#969696]">
              {user.data.NNID}
            </h2>
          </div>
        </div>
        <div className="mt-4">
          <p
            className={`whitespace-pre-line text-sm ${
              !showMore && "line-clamp-2"
            }`}
          >
            {user.data.Bio}
          </p>
          {showMore && (
            <div className="my-4">
              <div className="flex items-center">
                <div className="inline-block bg-[#5ac800] text-center rounded-full w-[80px] py-[3px]">
                  <h1 className="text-white text-xs">Country</h1>
                </div>
                <h1 className="ml-4 text-neutral-700 text-sm">
                  {user.data.Country}
                </h1>
              </div>
              <div className="flex mt-2 items-center">
                <div className="inline-block bg-[#5ac800] text-center rounded-full w-[80px] py-[3px]">
                  <h1 className="text-white text-xs">Birthday</h1>
                </div>
                <h1 className="ml-4 text-neutral-700 text-sm">
                  {user.data.Birthday}
                </h1>
              </div>
            </div>
          )}
          <div className="flex justify-end">
            <button onClick={() => setShowMore((prevState) => !prevState)}>
              <h1 className="text-green text-sm hover:underline">
                {showMore ? "Show less" : "Show more"}
              </h1>
            </button>
          </div>
        </div>
        <div className="mt-4 pt-3 pb-2 bg-[#f6f6f6] flex text-sm px-2 mx-[-16px]">
          <div className="flex-1 flex justify-center border-r-[1px] border-gray">
            <div className="text-center">
              <h1 className="sm:text-[18px] text-[15px] font-normal text-neutral-800">
                {user.data.NumPosts}
              </h1>
              <h1 className="text-[10px] text-[#969696]">Posts</h1>
            </div>
          </div>
          <div className="flex-1 flex justify-center border-r-[1px] border-gray">
            <div className="text-center">
              <h1 className="sm:text-[18px] text-[15px] font-normal text-neutral-800">
                {displayDashIfZero(user.data.NumFriends) + " / 100"}
              </h1>
              <h1 className="text-[10px] text-[#969696]">Friends</h1>
            </div>
          </div>
          <div className="flex-1 flex justify-center border-r-[1px] border-gray">
            <div className="text-center">
              <h1 className="sm:text-[18px] text-[15px] font-normal text-neutral-800">
                {displayDashIfZero(user.data.NumFollowing)}
              </h1>
              <h1 className="text-[10px] text-[#969696]">Following</h1>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <div className="text-center">
              <h1 className="sm:text-[18px] text-[15px] font-normal text-neutral-800">
                {displayDashIfZero(user.data.NumFollowers)}
              </h1>
              <h1 className="text-[10px] text-[#969696]">Followers</h1>
            </div>
          </div>
        </div>

        <div className="bg-[#5ac800] border-y-[1px] border-t-[#4faf00] border-b-gray flex py-1 text-sm text-white px-2 mx-[-16px]">
          Posts
        </div>
      </Wrapper>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { user_id } = context.query;

  var user: User = null;

  try {
    user = await getUserInfo({ NNID: user_id });
  } catch (e) {}

  return {
    props: {
      user,
      user_id,
    },
  };
};
