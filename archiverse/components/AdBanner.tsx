import { useEffect, useState } from "react";
import Script from "next/script";
import { LiaWindowClose } from "react-icons/lia";

export default function AdBanner() {
  const [isOpen, setIsOpen] = useState(true);
  useEffect(() => {
    if (window && (window as any).adsbygoogle) {
      console.log("Loading ad inside useEffect");

      try {
        (window as any).adsbygoogle.push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, []);

//   if (!isOpen) return <></>;

  return (
    <div className="bg-gray py-2 text-center md:px-2">
      <div className="flex justify-center mb-2">
        {/* <div></div> */}
        <h2 className="text-neutral-400 text-[10px]">
          Ads help maintain Archiverse's server costs
        </h2>
        {/* <button className="mr-2" onClick={() => setIsOpen(false)}>
          <LiaWindowClose size={18} />
        </button> */}
      </div>
      <>
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client="ca-pub-4203889559099732"
          data-ad-format="horizontal"
          data-ad-slot="1525315872"
          data-full-width-responsive="false"
        ></ins>
      </>
    </div>
  );
}
