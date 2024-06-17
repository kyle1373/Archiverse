import SEO from "@/components/SEO";
import { Community, Post } from "@server/database";
import Wrapper from "@components/Wrapper";
import LoadOrRetry from "@components/LoadOrRetry";
import { useEffect, useState } from "react";
import { queryAPI } from "@utils/queryAPI";

export default function Home({ title_id, game_id }) {
  const [beforeDate, setBeforeDate] = useState<{
    date: Date;
    useDate: boolean;
  }>({ date: new Date(Date.UTC(2017, 10, 9)), useDate: false });

  const [popularSelected, setPopularSelected] = useState(true);

  const [community, setCommunity] = useState<{
    data: Community;
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
    currPage: number;
    canLoadMore: boolean;
  }>({
    data: [],
    fetching: false,
    error: null,
    currPage: 1,
    canLoadMore: true,
  });

  const fetchCommunity = async () => {
    if (community.fetching) {
      return;
    }
    setCommunity((prevState) => ({
      ...prevState,
      fetching: true,
    }));
    const { data, error } = await queryAPI<Community>(
      `community/${title_id}/${game_id}`
    );
    setCommunity({ data, fetching: false, error });
  };

  const fetchPosts = async (restart?: boolean) => {
    if (posts.fetching) {
      return;
    }
    setPosts((prevState) => ({
      ...prevState,
      fetching: true,
      canLoadMore: true,
    }));
    var page = posts.currPage + 1;
    if (restart) {
      page = 1;
    }
    var queryUrl = `posts?title_id=${title_id}&game_id=${game_id}`;
    if (beforeDate.useDate) {
      queryUrl += `&before_datetime=${beforeDate.date.toISOString()}`;
    }
    queryUrl += `&sort_mode=${
      popularSelected ? "popular" : "recent"
    }&page=${page}`;

    const { data, error } = await queryAPI<Post[]>(queryUrl);

    if (error && page > 1) {
      page = page - 1;
    }

    
    if (error) {
      setPosts((prevState) => ({
        ...prevState,
        fetching: false,
        error: error,
        currPage: page,
      }));
    } else if (restart) {
      setPosts({
        data: data,
        fetching: false,
        error: error,
        currPage: page,
        canLoadMore: data.length !== 0,
      });
    } else {
      setPosts((prevState) => ({
        ...prevState,
        fetching: false,
        error: null,
        currPage: page,
        data: prevState.data.concat(data),
        canLoadMore: data.length !== 0,
      }));
    }
  };

  useEffect(() => {
    fetchPosts(true);
    if (!community.data) {
      fetchCommunity();
    }
  }, [popularSelected]);

  return (
    <>
      <SEO />
      <Wrapper>
        {JSON.stringify(community)}
        <LoadOrRetry
          fetching={community.fetching}
          error={community.error}
          refetch={() => fetchCommunity()}
        />
        {JSON.stringify(posts)}
        <button onClick={() => fetchPosts()}>Load More</button>
        <LoadOrRetry
          fetching={posts.fetching}
          error={posts.error}
          refetch={() => fetchPosts(posts.currPage === 1)}
        />
      </Wrapper>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { title_id, game_id } = context.query;

  return {
    props: {
      title_id,
      game_id,
    },
  };
};
