import { useEffect } from "react";
import Script from "next/script";

export default function BannerAd() {
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

  return (
    <div className="bg-gray py-2 text-center md:px-2 pt-1">
      <h1 className="text-neutral-500 text-xs mb-2">Advertisement</h1>
      <>
        <ins
          className="adsbygoogle"
          style={{ display: "block", height: 100}}
          data-ad-client="ca-pub-4203889559099732"
          data-ad-format="horizontal"
          data-ad-slot="1525315872"
          data-full-width-responsive="false"
        ></ins>
      </>
      <h2 className="text-neutral-400 text-[10px] mb-2">Ads help maintain Archiverse</h2>
    </div>
  );
}
