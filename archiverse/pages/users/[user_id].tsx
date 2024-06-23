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

export default function Home({ user, user_id }) {
  const searchQuery = useRef("");

  const [users, setUsers] = useState<{
    data: User;
    fetching: boolean;
    error: string;
  }>({
    data: user,
    fetching: false,
    error: null,
  });


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
    const { data, error } = await queryAPI<User>(
      `user/${user_id}`
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
        <div className="flex bg-[#f6f6f6] text-neutral-700 font-semibold border-b-[1px] border-gray mt-[-16px] mx-[-16px] md:rounded-t-md px-2 py-1 text-base">
          Users
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
