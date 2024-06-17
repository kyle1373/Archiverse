import SEO from "@/components/SEO";
import { Community, Post } from "@server/database";
import Wrapper from "@components/Wrapper";
import LoadOrRetry from "@components/LoadOrRetry";
import { useEffect, useState } from "react";
import { queryAPI } from "@utils/queryAPI";
import { numberWithCommas } from "@utils/utils";
import { BsFillPeopleFill, BsGlobe } from "react-icons/bs";

export default function Home({ title_id, game_id }) {
  const [beforeDate, setBeforeDate] = useState<{
    date: Date;
    useDate: boolean;
  }>({ date: new Date(Date.UTC(2017, 10, 9)), useDate: false });

  const [popularSelected, setPopularSelected] = useState(true);

  const [hasRelatedCommunities, setHasRelatedCommunities] = useState(false);

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

  const getRelatedCommunities = async () => {
    const { data, error } = await queryAPI<Community[]>(
      `communities?title_id=${title_id}`
    );

    if (data && data.length !== 0) {
      setHasRelatedCommunities(true);
    }
  };

  const fetchPosts = async (restart?: boolean) => {
    if (posts.fetching) {
      return;
    }
    setPosts((prevState) => ({
      ...prevState,
      fetching: true,
      canLoadMore: true,
      error: null,
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
    getRelatedCommunities();
  }, []);

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
        <div className="flex bg-[#f6f6f6] text-[#969696] font-semibold mt-[-16px] mx-[-16px] md:rounded-t-md px-2 py-1">
          {community.data?.GameTitle}
        </div>
        <div className="mx-[-16px]">
          <img src={community.data?.CommunityBanner} className="w-full" />
        </div>
        <div className={`flex py-2 `}>
          <img
            src={
              community.data?.CommunityIconUrl ??
              community.data?.CommunityBanner
            }
            alt={community.data?.GameTitle + " Icon"}
            className="w-[54px] h-[54px] rounded-md border-gray border-[1px] mr-4"
          />
          <div>
            <h2 className="font-bold sm:text-base text-sm mt-1">
              {community.data?.CommunityTitle}
            </h2>
            <div className="flex mt-1">
              <h3 className="flex items-center justify-center font-light text-xs sm:text-sm text-neutral-500 mr-4">
                <BsFillPeopleFill className="mr-1 mb-[.5px]" />
                {numberWithCommas(community.data?.NumPosts)}
              </h3>
              <h3 className="flex items-center justify-center font-light text-xs sm:text-sm text-neutral-500">
                <BsGlobe className="mr-1" />
                {community.data?.Region}
              </h3>
            </div>
          </div>
        </div>
        {hasRelatedCommunities && <div>Has related communities</div>}

        <LoadOrRetry
          fetching={community.fetching}
          error={community.error}
          refetch={() => fetchCommunity()}
        />
        <div className="my-6">{"Posts (will be formatted later)"}</div>
        <div>{JSON.stringify(posts?.data)}</div>
        {posts.canLoadMore && !posts.fetching && !posts.error && (
          <button onClick={() => fetchPosts()}>Load More</button>
        )}
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
