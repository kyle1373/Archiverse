import SEO from "@/components/SEO";
import { Community, Post } from "@server/database";
import Wrapper from "@components/Wrapper";
import LoadOrRetry from "@components/LoadOrRetry";
import { useEffect, useState } from "react";
import { queryAPI } from "@utils/queryAPI";
import { numberWithCommas } from "@utils/utils";
import { BsFillPeopleFill, BsGlobe } from "react-icons/bs";

export default function Home({ title_id }) {
  const [beforeDate, setBeforeDate] = useState<{
    date: Date;
    useDate: boolean;
  }>({ date: new Date(Date.UTC(2017, 10, 9)), useDate: false });

  const [community, setCommunity] = useState<{
    data: Community;
    fetching: boolean;
    error: string;
  }>({
    data: null,
    fetching: false,
    error: null,
  });

  return (
    <>
      <SEO />
      <Wrapper>
        <div />
      </Wrapper>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { title_id } = context.query;

  return {
    props: {
      title_id,
    },
  };
};
