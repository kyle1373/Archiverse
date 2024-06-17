import { SEO_METADATA } from "@/constants/constants";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import { FaSearch } from "react-icons/fa";

const Wrapper = ({ children }) => {
  return (
    <main className="container mx-auto py-10 max-w-[800px]">
      <div className="flex flex-col md:flex-row md:space-x-4">
        <div className="md:w-1/3">
          <div className="md:fixed md:p-4 mb-4 md:mb-0">
            <div className="flex justify-between md:flex-col">
              <Link href="/">
                <img
                  src={"/archiverse-logo.png"}
                  alt={"archiverse logo"}
                  className="w-40 md:w-52 md:ml-0 ml-4"
                />
              </Link>
              <Link className="md:mt-8 mt-[-20px]" href="/search">
                <div className="md:ml-2 hover:brightness-95 inline-flex justify-center items-center bg-gradient-to-b from-white border-[1px] rounded-md border-gray text-neutral-600 to-neutral-200 font-bold py-2 px-4 mt-4 md:mt-0 md:text-base text-small md:mr-0 mr-4">
                  <FaSearch />
                  <h1 className="ml-3">Users</h1>
                </div>
              </Link>
            </div>
          </div>
        </div>
        {/* Right Column */}
        <div className="md:w-2/3 bg-white p-4 border-[1px] md:rounded-md border-gray items-center md:mt-12">
          {children}
        </div>
      </div>
    </main>
  );
};

export default Wrapper;
