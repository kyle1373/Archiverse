import SEO from "@/components/SEO";
import { Community, Post, Reply, getPost } from "@server/database";
import Wrapper from "@components/Wrapper";
import LoadOrRetry from "@components/LoadOrRetry";
import { useEffect, useState } from "react";
import { queryAPI } from "@utils/queryAPI";
import { numberWithCommas } from "@utils/utils";
import { BsFillPeopleFill, BsGlobe } from "react-icons/bs";
import Link from "next/link";
import PostCard from "@components/PostCard";
import ReplyCard from "@components/ReplyCard";

export default function Home({ post_id, post: pulledPost }) {
  const [post, setPost] = useState<{
    data: Post;
    fetching: boolean;
    error: string;
  }>({
    data: pulledPost
      ? { ...pulledPost, Date: new Date(pulledPost.Date) }
      : null,
    fetching: false,
    error: null,
  });

  const [replies, setReplies] = useState<{
    data: Reply[];
    fetching: boolean;
    error: string;
    currPage: number;
    sortMethod: "oldest" | "newest";
    canPullMore: boolean;
  }>({
    data: null,
    fetching: false,
    error: null,
    currPage: 0,
    sortMethod: "newest",
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

  const fetchReplies = async (reset: boolean) => {
    var page = 1;
    if (!reset) {
      page = replies.currPage + 1;
    }
    if (replies.fetching) {
      return;
    }

    const { data, error } = await queryAPI<Reply[]>(
      `replies?post_id=${post_id}&sort_mode=${replies.sortMethod}&page=${page}`
    );

    if (error) {
      setReplies((prevState) => ({
        ...prevState,
        fetching: false,
        error: error,
        canPullMore: true,
      }));
      return;
    }
    if (replies.sortMethod === "newest") {
      const newData = [...data].reverse();
      if (replies.data) {
        setReplies((prevState) => ({
          ...prevState,
          data: [...newData, ...prevState.data],
          fetching: false,
          error: null,
          canPullMore: data.length !== 0,
        }));
      } else {
        setReplies((prevState) => ({
          ...prevState,
          data: newData,
          fetching: false,
          error: null,
          canPullMore: data.length !== 0,
        }));
      }
    } else {
      if (replies.data) {
        setReplies((prevState) => ({
          ...prevState,
          data: [...prevState.data, ...data],
          fetching: false,
          error: null,
          canPullMore: data.length !== 0,
        }));
      } else {
        setReplies((prevState) => ({
          ...prevState,
          data: data,
          fetching: false,
          error: null,
          canPullMore: data.length !== 0,
        }));
      }
    }
  };

  useEffect(() => {
    if (!post.data) {
      fetchPost();
    }
    fetchReplies(true);
  }, []);

  return (
    <>
      <SEO />
      <Wrapper>
        {post.data && (
          <div className="md:mx-[-16px] mt-[-16px]">
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
            {replies.data && (
              <div className="bg-[#5ac800] border-y-[1px] border-t-[#4faf00] border-b-gray flex py-1 text-sm text-white px-2 md:mx-0 mx-[-16px]">
                Comments
              </div>
            )}
            {replies.data &&
              post.data &&
              replies.data.map((reply, index) => {
                return (
                  <>
                    <ReplyCard
                      key={reply.ID + index}
                      reply={reply}
                      isAuthor={post.data.NNID === reply.NNID}
                    />
                    {index !== replies.data.length - 1 && (
                      <div className="border-b-[1px] border-gray" />
                    )}
                  </>
                );
              })}
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
