import { SEO_METADATA } from "@/constants/constants";
import { Post } from "@server/database";
import Head from "next/head";
import React from "react";

interface PostCardProps {
  post: Post;
  className?: any;
}

const PostCard = ({ post, className = "" }: PostCardProps) => {
  function getDate() {
    if (!post?.Date) {
      return "";
    }

    const d = new Date(post.Date); // Ensure post.Date is a Date object

    if (isNaN(d.getTime())) {
      return ""; // Invalid date
    }
    const months = [
      "01",
      "02",
      "03",
      "04",
      "05",
      "06",
      "07",
      "08",
      "09",
      "10",
      "11",
      "12",
    ];

    const month = months[d.getMonth()];
    const day = d.getDate().toString().padStart(2, "0");
    const year = d.getFullYear();

    let hours = d.getHours();
    const minutes = d.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";

    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    const strTime =
      hours.toString().padStart(2, "0") + ":" + minutes + " " + ampm;

    return `${month}/${day}/${year} ${strTime}`;
  }

  return (
    <div className={`w-full md:px-2 ${className}`}>
      <div className="flex items-center relative">
        <img
          src={post.MiiUrl}
          className="w-[50px] rounded-md border-gray border-[1px] mr-2"
        />
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-black text-sm">
              {post.MiiName}
            </h1>
            <h1 className="text-[10px] text-right text-neutral-400 mt-1 font-medium absolute right-0 top-0">{getDate()}</h1>
          </div>
          <div className="flex mt-1 items-center">
            <img
              src={post.CommunityIconUrl}
              className="h-4 w-4 border-[1px] rounded-sm border-gray"
            />
            <h1 className="font-thin text-[#969696] md:text-xs text-[10px] ml-1">
              {post.CommunityTitle}
            </h1>
          </div>
        </div>
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
