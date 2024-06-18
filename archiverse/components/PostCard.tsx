import { SEO_METADATA } from "@/constants/constants";
import { Post } from "@server/database";
import Head from "next/head";
import React from "react";
import { GoPersonFill } from "react-icons/go";
import { IoIosChatboxes } from "react-icons/io";
import { IoCheckbox } from "react-icons/io5";

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
      hours.toString().padStart(2, "0") + ":" + minutes + "" + ampm;

    return `${month}/${day}/${year} ${strTime}`;
  }

  return (
    <div className={`w-full md:px-2 ${className} mt-3`}>
      <div className="flex items-center relative mb-4">
        <img
          src={post.MiiUrl}
          className="w-[50px] h-[50px] rounded-md border-gray border-[1px] mr-2"
        />
        <div className="w-full">
          <div className="flex justify-between items-center">
            <h1 className="font-bold text-black text-sm">{post.MiiName}</h1>
            <h1 className="text-[10px] text-right text-neutral-400 font-medium absolute right-0 top-0">
              {getDate()}
            </h1>
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
      {post.DrawingUrl ? (
        <div className="flex justify-center items-center">
          <img src={post.DrawingUrl} />
        </div>
      ) : (
        <h1 className="md:ml-14 text-left">{post.Text}</h1>
      )}

      {post.ScreenshotUrl && (
        <div className="flex justify-center items-center mt-4 ">
          <img className="rounded-md" src={post.ScreenshotUrl} />
        </div>
      )}
      <div className="flex justify-end items-center text-[#969696] text-sm mt-3 mb-2">
        {/* Contains yeah count, num replies, if the user has played, and more
         */}
        <GoPersonFill className="mr-1" />
        {post.NumYeahs}
        <IoIosChatboxes className=" ml-2 mr-1" />
        {post.NumReplies}
        <IoCheckbox className="ml-2 mb-[.5px]" />
      </div>
    </div>
  );
};

export default PostCard;