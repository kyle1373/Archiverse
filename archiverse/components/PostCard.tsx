import { IMAGES, SEO_METADATA } from "@/constants/constants";
import { Post } from "@server/database";
import Head from "next/head";
import React, { useState, useEffect } from "react";
import { GoPersonFill } from "react-icons/go";
import { IoIosChatboxes } from "react-icons/io";
import { IoCheckbox } from "react-icons/io5";
import Loading from "@/components/Loading"; // Make sure to adjust the import path as needed
import Link from "next/link";

interface PostCardProps {
  post: Post;
  className?: any;
  variant: "list" | "main";
}

const PostCard = ({ post, className = "", variant }: PostCardProps) => {
  const [isDrawingLoading, setIsDrawingLoading] = useState(true);
  const [isScreenshotLoading, setIsScreenshotLoading] = useState(true);

  function getDate() {
    if (!post?.Date) {
      return "";
    }

    const d = new Date(post.Date);

    if (isNaN(d.getTime())) {
      return "";
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

  useEffect(() => {
    if (post.DrawingUrl) {
      const img = new Image();
      img.src = post.DrawingUrl;
      img.onload = () => setIsDrawingLoading(false);
      img.onerror = () => setIsDrawingLoading(false);
    } else {
      setIsDrawingLoading(false);
    }

    if (post.ScreenshotUrl) {
      const img = new Image();
      img.src = post.ScreenshotUrl;
      img.onload = () => setIsScreenshotLoading(false);
      img.onerror = () => setIsScreenshotLoading(false);
    } else {
      setIsScreenshotLoading(false);
    }
  }, [post.DrawingUrl, post.ScreenshotUrl]);

  if (variant === "list") {
    return (
      <div className={`w-full md:px-2 ${className} mt-3`}>
        <div className="flex items-center relative mb-4">
          <Link href={`/user/${post.NNID}`} className="mr-2">
            <img
              src={post.MiiUrl}
              className="w-[50px] h-[50px] rounded-md border-gray border-[1px] mr-3"
              onError={({ currentTarget }) => {
                currentTarget.onerror = null; // prevents looping
                currentTarget.src = IMAGES.unknownMii;
              }}
            />
          </Link>
          <div className="w-full">
            <div className="flex justify-between items-center">
              <Link
                className="font-bold text-black text-sm hover:underline"
                href={`/user/${post.NNID}`}
              >
                {post.MiiName}
              </Link>
              <h1 className="text-[10px] text-right text-neutral-400 font-medium absolute right-0 top-0">
                {getDate()}
              </h1>
            </div>
            <div className="flex mt-1 items-center ">
              <Link
                className="hover:underline flex"
                href={`/title/${post.TitleID}/${post.GameID}`}
              >
                <img
                  src={post.CommunityIconUrl}
                  className="h-4 w-4 border-[1px] rounded-sm border-gray"
                />
                <h1 className="font-thin text-[#969696] md:text-xs text-[10px] ml-1">
                  {post.CommunityTitle}
                </h1>
              </Link>
            </div>
          </div>
        </div>
        {post.DrawingUrl ? (
          isDrawingLoading ? (
            <div className="flex justify-center items-center h-[120px]">
              <Loading />
            </div>
          ) : (
            <div className="flex justify-center items-center">
              <img src={post.DrawingUrl} />
            </div>
          )
        ) : (
          <h1 className={`text-left`}>{post.Text}</h1>
        )}
        {post.ScreenshotUrl &&
          (isScreenshotLoading ? (
            <div className="flex justify-center items-center md:h-[266px] h-[160px]">
              <Loading />
            </div>
          ) : (
            <div className="flex justify-center items-center mt-4">
              <img className="rounded-md" src={post.ScreenshotUrl} />
            </div>
          ))}
        <div className="flex justify-end items-center text-[#969696] text-sm mt-3 mb-2">
          <GoPersonFill className="mr-1" />
          {post.NumYeahs}
          <IoIosChatboxes className=" ml-2 mr-1" />
          {post.NumReplies}
          <IoCheckbox className="ml-2 mb-[.5px]" />
        </div>
      </div>
    );
  }
  return (
    <div className={`w-full md:px-2 ${className} mt-3`}>
      <div className="flex items-center relative mb-4">
        <Link href={`/user/${post.NNID}`} className="mr-2">
          <img
            src={post.MiiUrl}
            className="w-[50px] h-[50px] rounded-md border-gray border-[1px] mr-3"
            onError={({ currentTarget }) => {
              currentTarget.onerror = null; // prevents looping
              currentTarget.src = IMAGES.unknownMii;
            }}
          />
        </Link>
        <div className="w-full">
          <div className="flex items-center">
            <Link
              className="font-bold text-black text-[17px] hover:underline"
              href={`/user/${post.NNID}`}
            >
              {post.MiiName}
            </Link>
            <h1 className="text-left ml-2 mt-[.5px] text-neutral-400 font-medium text-[13px]">
              {post.NNID}
            </h1>
          </div>
          <h1 className="text-left mt-[-2px] text-neutral-400 font-medium text-[13px]">
            {getDate()}
          </h1>
        </div>
      </div>
      {post.DrawingUrl ? (
        isDrawingLoading ? (
          <div className="flex justify-center items-center h-[120px]">
            <Loading />
          </div>
        ) : (
          <div className="flex justify-center items-center">
            <img src={post.DrawingUrl} />
          </div>
        )
      ) : (
        <h1 className={`text-left`}>{post.Text}</h1>
      )}
      {post.ScreenshotUrl &&
        (isScreenshotLoading ? (
          <div className="flex justify-center items-center md:h-[266px] h-[160px]">
            <Loading />
          </div>
        ) : (
          <div className="flex justify-center items-center mt-4">
            <img className="rounded-md" src={post.ScreenshotUrl} />
          </div>
        ))}
      <div className="flex justify-end items-center text-[#969696] text-sm mt-3 mb-2">
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
