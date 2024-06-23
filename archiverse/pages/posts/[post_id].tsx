import SEO from "@/components/SEO";
import { Community, Post, Reply, getPost } from "@server/database";
import Wrapper from "@components/Wrapper";
import LoadOrRetry from "@components/LoadOrRetry";
import { useEffect, useRef, useState } from "react";
import { queryAPI } from "@utils/queryAPI";
import { numberWithCommas } from "@utils/utils";
import { BsFillPeopleFill, BsGlobe } from "react-icons/bs";
import Link from "next/link";
import PostCard from "@components/PostCard";
import ReplyCard from "@components/ReplyCard";
import { LIMIT } from "@constants/constants";

export default function Home({ post_id, post: pulledPost }) {
  const [post, setPost] = useState<{
    data: Post;
    fetching: boolean;
    error: string;
  }>({
    data: pulledPost ? { ...pulledPost } : null,
    fetching: false,
    error: null,
  });

  const clickShowNewer = () => {
    setReplies((prevState) => ({ ...prevState, showMoreCategory: "new" }));
    fetchReplies(false, "oldest");
  };

  const clickShowNewest = () => {
    setReplies((prevState) => ({ ...prevState, showMoreCategory: "old" }));
    fetchReplies(true, "newest");
  };

  const clickShowOlder = () => {
    setReplies((prevState) => ({ ...prevState, showMoreCategory: "old" }));
    fetchReplies(false, "newest");
  };

  const clickShowOldest = () => {
    setReplies((prevState) => ({ ...prevState, showMoreCategory: "new" }));
    fetchReplies(true, "oldest");
  };

  const [replies, setReplies] = useState<{
    data: Reply[];
    fetching: boolean;
    error: string;
    currPage: number;
    showMoreCategory: "old" | "new";
    canPullMore: boolean;
  }>({
    data: null,
    fetching: false,
    error: null,
    showMoreCategory: "old", // This is only used to show where to show the loading indicator. This value is not used elsewhere. old is top. new is bottom
    currPage: 1,
    canPullMore: false,
  });

  const fetchPost = async () => {
    if (post.fetching) {
      return;
    }
    setPost((prevState) => ({
      ...prevState,
      fetching: true,
      error: null,
    }));

    const { data, error } = await queryAPI<Post>(`post/${post_id}`);

    if (error) {
      setPost((prevState) => ({
        ...prevState,
        fetching: false,
        error: error,
      }));
      return;
    }

    setPost((prevState) => ({
      ...prevState,
      data: data,
      fetching: false,
      error: null,
    }));
  };

  const fetchReplies = async (reset: boolean, mode: "oldest" | "newest") => {
    var page = 1;
    if (!reset) {
      page = replies.currPage + 1;
    }
    if (replies.fetching) {
      return;
    }

    const { data, error } = await queryAPI<Reply[]>(
      `replies?post_id=${post_id}&sort_mode=${mode}&page=${page}`
    );

    console.log(data);

    if (error) {
      setReplies((prevState) => ({
        ...prevState,
        fetching: false,
        currPage: page - 1,
        error: error,
        canPullMore: true,
      }));
      return;
    }

    const prevData = replies.data ? replies.data : [];

    if (mode === "newest") {
      console.log("Here");
      const reversedData = [...data].reverse();
      var newData = [...reversedData, ...prevData];

      if (reset) {
        newData = reversedData;
      }

      setReplies((prevState) => ({
        ...prevState,
        data: newData,
        fetching: false,
        error: null,
        currPage: page,
        canPullMore: data.length === LIMIT.PostReplies,
      }));
    } else {
      var newData = [...prevData, ...data];

      if (reset) {
        newData = data;
      }

      setReplies((prevState) => ({
        ...prevState,
        data: newData,
        currPage: page,
        fetching: false,
        error: null,
        canPullMore: data.length === LIMIT.PostReplies,
      }));
    }
  };

  const roundBottomCorner = (index) => {
    // Hotfix when bottom does not show buttons and comments are shown
    if (!replies.data) {
      return "";
    }
    if (
      index !== replies.data.length - 1 &&
      (replies.canPullMore === false || replies.showMoreCategory === "old")
    ) {
      return "";
    }

    return "md:rounded-b-md";
  };

  useEffect(() => {
    if (!post.data) {
      fetchPost();
    }
    fetchReplies(true, "newest");
  }, []);

  return (
    <>
      <SEO />
      <Wrapper>
        {post.data && (
          <div className="md:mx-[-16px] my-[-16px]">
            <Link
              className="flex bg-[#f6f6f6] text-neutral-700 font-semibold md:rounded-t-md p-2 border-gray border-b-[1px] md:text-base text-sm  md:mx-0 mx-[-16px] items-center hover:underline"
              href={`/titles/${post.data.TitleID}/${post.data.GameID}`}
            >
              <img
                src={post.data.CommunityIconUrl}
                className="h-6 w-6 rounded-sm mr-2"
              />
              {post.data?.CommunityTitle}
            </Link>
            <div className="md:mx-2">
              <PostCard post={post.data} variant="main" />
            </div>
            {replies.data && replies.data.length !== 0 && (
              <div className="bg-[#5ac800] border-y-[1px] border-t-[#4faf00] border-b-gray flex py-1 text-sm text-white px-2 md:mx-0 mx-[-16px]">
                Comments
              </div>
            )}
            <div>
              {replies.canPullMore && replies.showMoreCategory === "old" && (
                <div>
                  <button onClick={clickShowOldest}>Show oldest</button>
                  <button onClick={clickShowOlder}>Show older</button>
                </div>
              )}
              {replies.data &&
                post.data &&
                replies.data.map((reply, index) => {
                  return (
                    <div
                      className={`px-4 md:mx-[0px] mx-[-16px] ${
                        reply.NNID === post.data.NNID ? "bg-[#effbe7]" : ""
                      } ${roundBottomCorner(index)}`}
                    >
                      <ReplyCard key={reply.ID + index} reply={reply} />
                      {index !== replies.data.length - 1 && (
                        <div className="border-b-[1px] mx-[-16px] border-gray" />
                      )}
                    </div>
                  );
                })}
              {replies.canPullMore && replies.showMoreCategory === "new" && (
                <div>
                  <button onClick={clickShowNewer}>Show newer</button>
                  <button onClick={clickShowNewest}>Show newest</button>
                </div>
              )}
            </div>
          </div>
        )}
      </Wrapper>
    </>
  );
}

export const getServerSideProps = async (context) => {
  const { post_id } = context.query;

  const post = await getPost({ postID: post_id });
  return {
    props: {
      post_id,
      post,
    },
  };
};
