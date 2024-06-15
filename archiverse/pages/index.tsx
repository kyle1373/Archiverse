import Image from "next/image";
import { Inter } from "next/font/google";
import SEO from "@/components/SEO";
import styles from "./index.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <SEO />
      <main className="">
      </main>
    </>
  );
}
