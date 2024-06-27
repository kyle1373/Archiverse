import Image from "next/image";
import SEO from "@/components/SEO";
import styles from "./index.module.css";
import Link from "next/link";
import { Community, User } from "@server/database";
import { numberWithCommas } from "@utils/utils";
import Loading from "@components/Loading";
import LoadOrRetry from "@components/LoadOrRetry";
import Wrapper from "@components/Wrapper";
import { useEffect, useRef, useState } from "react";
import { queryAPI } from "@utils/queryAPI";
import { IMAGES } from "@constants/constants";
import MiiverseSymbol from "@components/MiiverseSymbol";

export default function Home() {


  return (
    <>
      <SEO title={"Search Users"} makeDescriptionBlank={true} />
      <Wrapper>
        <div className="flex bg-[#f6f6f6] text-neutral-700 font-semibold border-b-[1px] border-gray mt-[-16px] mx-[-16px] px-2 py-1 text-base">
          Users
        </div>
        <form
          className="flex items-center relative w-full mt-4"
        >
          <input
            type="text"
            placeholder="Search by NNID"
            className="rounded-md pl-2 sm:pr-10 pr-4 bg-neutral-200 md:text-sm py-1 placeholder-neutral-500 text-xs w-full"
          />
          <button
            type="submit"
            className="absolute right-2 bg-neutral-200 top-1/2 transform -translate-y-1/2 bg-transparent border-none cursor-pointer"
          >
            <MiiverseSymbol
              className="fill-neutral-500 hover:fill-neutral-700 sm:h-4 sm:w-4 h-3 w-3"
              symbol={"magnifying_glass"}
            />
          </button>
        </form>
      </Wrapper>
    </>
  );
}