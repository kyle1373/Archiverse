import SEO from "@/components/SEO";
import { Community, Post, getPost } from "@server/database";
import Wrapper from "@components/Wrapper";
import LoadOrRetry from "@components/LoadOrRetry";
import { useEffect, useState } from "react";
import { queryAPI } from "@utils/queryAPI";
import { numberWithCommas } from "@utils/utils";
import { BsFillPeopleFill, BsGlobe } from "react-icons/bs";
import Link from "next/link";
import PostCard from "@components/PostCard";

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

  useEffect(() => {
    if (!post.data) {
      fetchPost();
    }
  }, []);

  return (
    <>
      <SEO />
      <Wrapper>
        {post.data && (
          <div className="md:mx-[-16px] mt-[-16px]">
            <Link
              className="flex bg-[#f6f6f6] text-neutral-700 font-semibold md:rounded-t-md p-2 border-gray border-b-[1px] text-base  md:mx-0 mx-[-16px] items-center hover:underline"
              href={`/title/${post.data.TitleID}/${post.data.GameID}`}
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
      post: { ...post, Date: post.Date.toISOString() },
    },
  };
};
