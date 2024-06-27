import Image from "next/image";
import Link from "next/link";
import { Community, Post, getRandomPosts } from "@server/database";
import { numberWithCommas } from "@utils/utils";
import Wrapper from "@components/Wrapper";
import HomepageDrawings from "@components/HomepageDrawings";
import PostCard from "@components/PostCard";
import { LINKS } from "@constants/constants";
import MiiverseSymbol from "@components/MiiverseSymbol";
import CommunityList from "@components/CommunityList";
import { getHomepageDrawings } from "@server/database";
import RandomPosts from "@components/RandomPost";

export default async function Home() {
  const drawings = await getHomepageDrawings();

  const randomPosts = await getRandomPosts();

  return (
    <Wrapper>
      <h2 className="text-xl font-bold mb-4 text-center text-green mt-6">
        Welcome to Archiverse!
      </h2>
      <div className="flex justify-center mt-8">
        <Image
          src={"/welcome-image.png"}
          alt={"welcome image"}
          width={430}
          height={137}
        />
      </div>
      <p className="text-sm mt-6 text-neutral-700">
        Archiverse is an archive of Miiverse, a social media platform for the
        Nintendo Wii U and 3DS which ran from November 18, 2012 until November
        8, 2017. This archive stores millions of archived Miiverse users, posts,
        drawings, comments, and more, totaling over 17TB of data.
      </p>
      <p className="text-sm mt-6 text-neutral-700">
        Big thanks to{" "}
        <Link className="underline" href={"https://github.com/drasticactions"}>
          Drastic Actions
        </Link>{" "}
        for running the original website from 2018 - 2024,{" "}
        <Link className="underline" href={"https://wiki.archiveteam.org/"}>
          Archive Team
        </Link>{" "}
        for archiving Miiverse before its shutdown, and Luna for creating
        polished icons shown throughout the website.
      </p>
      <p className="text-sm mt-6 text-neutral-700">
        If you enjoy Archiverse, consider{" "}
        <Link className="underline" href={LINKS.github}>
          starring the Github repository
        </Link>{" "}
        and/or{" "}
        <Link className="underline" href={LINKS.discord}>
          joining the Archiverse Discord
        </Link>
        . Have fun!
      </p>
      <p className="text-sm mt-6 text-neutral-700">- Kyle (SuperFX)</p>
      {drawings && (
        <div>
          <div className="mt-4 flex justify-between border-b-4 mx-[-16px] px-4 py-2 border-green items-end">
            <div className="flex items-end">
              <MiiverseSymbol
                symbol={"pencil_draw"}
                className="fill-green sm:h-6 sm:w-6 h-5 w-5 mr-2 sm:mb-[4px] mb-[2px]"
              />
              <h1 className="text-green font-bold sm:text-lg text-sm">
                Popular Drawings
              </h1>
            </div>
          </div>
          <HomepageDrawings posts={drawings} />
        </div>
      )}
      <RandomPosts randomPosts={randomPosts} />
      <CommunityList />
    </Wrapper>
  );
}
