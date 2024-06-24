import { LINKS, SEO_METADATA } from "@/constants/constants";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { BsPeopleFill } from "react-icons/bs";
import { FaDiscord, FaGithub, FaSearch } from "react-icons/fa";

const Wrapper = ({ children }) => {
  return (
    <main className="container mx-auto py-10 max-w-[800px]">
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="md:w-1/3">
          <div className="md:fixed flex-col flex md:p-4 mb-4 md:mb-0 justify-between">
            <div className="flex justify-between md:flex-col">
              <Link href="/">
                <img
                  src={"/archiverse-logo.png"}
                  alt={"archiverse logo"}
                  className="w-[160px] h-[29px] md:w-[208px] md:h-[37px] md:ml-0 ml-4"
                />
              </Link>
              <div className="flex-col md:flex">
                <Link className="md:mt-8 mt-[-20px]" href="/">
                  <div className="md:ml-2 hover:brightness-95 inline-flex items-center bg-gradient-to-b from-white border-[1px] rounded-md border-gray text-neutral-600 to-neutral-200 font-bold py-2 px-4 md:mt-0 text-base md:mr-0 mr-2 md:mb-4 md:w-48">
                    <BsPeopleFill className="md:mr-2" />
                    <h1 className="flex-grow text-center hidden md:block">
                      Communities
                    </h1>
                  </div>
                </Link>
                <Link href="/search">
                  <div className="md:ml-2 hover:brightness-95 inline-flex items-center bg-gradient-to-b from-white border-[1px] rounded-md border-gray text-neutral-600 to-neutral-200 font-bold py-2 px-4 md:mt-0 text-base md:mr-0 mr-4 md:w-48">
                    <FaSearch className="md:mr-2" />
                    <h1 className="flex-grow text-center hidden md:block">
                      Users
                    </h1>
                  </div>
                </Link>
              </div>
              <div className="md:flex hidden items-center justify-center mt-10">
                <Link
                  href={LINKS.github}
                  className="mr-5"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaGithub className="w-6 h-6 text-[#696969]" />
                </Link>
                <Link
                  href={LINKS.discord}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <FaDiscord className="w-6 h-6 text-[#696969]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <div className="md:mt-12 md:w-2/3">
          <div className="bg-white p-4 md:border-[1px] border-y-[1px] md:rounded-md border-gray items-center overflow-hidden">
            {children}
          </div>
          <div className="md:hidden flex justify-center items-center mt-6">
            <Link
              href={LINKS.github}
              className="mr-5"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub className="w-6 h-6 text-[#696969]" />
            </Link>
            <Link
              href={LINKS.discord}
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaDiscord className="w-6 h-6 text-[#696969]" />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Wrapper;
