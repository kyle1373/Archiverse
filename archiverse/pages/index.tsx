import Image from "next/image";
import SEO from "@/components/SEO";
import styles from "./index.module.css";

export default function Home() {
  return (
    <>
      <SEO />
      <main className="relative container p-4 mx-auto">
        <div className="flex flex-col md:flex-row md:space-x-4 max-w-[1200px] mx-auto">

          <div className="hidden md:block w-[200px] bg-slate-800">
            <div className="md:fixed md:w-[200px] bg-white p-4 mb-4 md:mb-0">
              <h2 className="text-xl font-bold mb-4">Absolute</h2>
              <p>Content for the left column goes here.</p>
            </div>
          </div>
          {/* Right Column */}
          <div className="md:w-[600px] bg-white p-4 border-[1px] rounded-md border-gray md:ml-auto">
            <h2 className="text-2xl font-semibold mb-4 text-center text-green mt-8 md:mt-0">
              Welcome to Archiverse!
            </h2>
            <p>
              Content for the right column goes here. Add more content to see
              the stacking effect on smaller screens.
            </p>
            <p>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proin id
              dui at ipsum dictum tristique. Donec viverra sapien et tellus
              pretium, eu convallis elit convallis. Curabitur bibendum, sapien
              sit amet bibendum tincidunt, nulla leo dictum lorem, a pulvinar
              erat odio a arcu. Aliquam erat volutpat. Fusce eu lorem eget dolor
              euismod varius.
            </p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
            <p>More content...</p>
          </div>
        </div>
      </main>
    </>
  );
}
