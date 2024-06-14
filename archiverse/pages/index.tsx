import Image from "next/image";
import { Inter } from "next/font/google";
import SEO from "@/components/SEO";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
    <SEO/>
    <main
      className={`flex min-h-screen flex-col items-center justify-between checkerboard`}
    >
      
    </main>
    </>
  );
}
