import Image from "next/image";
import SEO from "@/components/SEO";
import styles from "./index.module.css";
import { FaSearch } from "react-icons/fa";
import Link from "next/link";

export default function Home() {
  return (
    <>
      <SEO />
      <main className="container mx-auto p-4 py-10 max-w-[800px]">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="md:w-1/3">
            <div className="md:fixed md:p-4 mb-4 md:mb-0">
              <div className="flex justify-between md:flex-col">
                <Link href="/">
                  <img
                    src={"/archiverse-logo.png"}
                    alt={"archiverse logo"}
                    className="w-40 md:w-52"
                  />
                </Link>
                <Link className="md:mt-8 mt-[-20px]" href="/search">
                  <div className="md:ml-2 hover:brightness-95 inline-flex justify-center items-center bg-gradient-to-b from-white border-[1px] rounded-md border-gray text-neutral-600 to-neutral-200 font-bold py-2 px-4 mt-4 md:mt-0 md:text-base text-small">
                    <FaSearch />
                    <h1 className="ml-3">Users</h1>
                  </div>
                </Link>
              </div>
            </div>
          </div>
          {/* Right Column */}
          <div className="md:w-2/3 bg-white p-4 border-[1px] rounded-md border-gray items-center md:mt-12">
            <h2 className="text-xl font-semibold mb-4 text-center text-green mt-6">
              Welcome to Archiverse!
            </h2>
            <div className="flex justify-center mt-8">
              <Image
                src={"/welcome-image.png"}
                alt={"welcome image"}
                width={430}
                height={204}
              />
            </div>
            <p className="text-sm mt-6 text-neutral-700">
              Archiverse is an archive of Miiverse, a social media platform for
              the Nintendo Wii U and 3DS which ran from November 18, 2012 until
              November 8, 2017. This archive stores millions of archived
              Miiverse users, posts, drawings, comments, and more, totaling over
              17TB of data.
            </p>
            <div className="mt-4 flex justify-between border-b-4 mx-[-16px] px-4 py-2 border-green">
              <h1 className="text-green font-semibold sm:text-lg text-sm">
                Communities
              </h1>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
