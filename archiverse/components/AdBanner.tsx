import { useEffect } from "react";
import Script from "next/script";

type BannerAdProps = {
  type: string;
};

export default function BannerAd({ type }: BannerAdProps) {
  
  useEffect(() => {
    if (window && (window as any).adsbygoogle) {
      console.log("Loading ad " + type + " inside useEffect")

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
          style={{ display: "block", height: 80 }}
          data-ad-client="ca-pub-4203889559099732"
          data-ad-format="horizontal"
          data-ad-slot="1525315872"
          data-full-width-responsive="false"
        ></ins>
      </>
    </div>
  );
}
