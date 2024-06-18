import { SEO_METADATA } from "@/constants/constants";
import { Post } from "@server/database";
import Head from "next/head";
import React from "react";

interface PostCardProps {
  post: Post;
  className?: any;
}

const PostCard = ({ post, className = "" }: PostCardProps) => {
  return (
    <div className={className}>
      <div className="flex">
        {/* Top part with mii, miiname, date, and community*/}
      </div>
      <div>
        {/* IF SPOILER, cover the screenshot and all of this content until the user clicks view spoiler*/}
        {/* Drawings, screenshots, and more
            NOTE: Drawings / Screenshots are centered. Text is margin left by the mii name IF greater than md:

            */}
        {/* Drawing / text if it exists*/}

        {/* Screenshot if it exists*/}
      </div>
      <div>
        {/* Contains yeah count, num replies, if the user has played, and more
         */}
        {/* Screenshot if it exists*/}
        {/* Drawings if it exists*/}
      </div>
    </div>
  );
};

export default PostCard;
