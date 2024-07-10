import { useEffect } from "react";
import Script from "next/script";

type BannerAdProps = {
  type: string;
};

export default function BannerAd({ type }: BannerAdProps) {
  useEffect(() => {
    if (window && (window as any).adsbygoogle) {
      try {
        (window as any).adsbygoogle.push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, []);

  return (
    <div className="flex flex-col items-center bg-gray px-2 text-center py-1">
      <h1 className="text-neutral-500 text-xs mb-1">Advertisement</h1>
      <>
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", maxHeight: "130px" }}
          data-ad-client="ca-pub-4203889559099732"
          data-ad-format="horizontal"
          data-ad-slot="5648641130"
        ></ins>
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4203889559099732"
          crossOrigin="anonymous"
          onLoad={() => {
            if (window && (window as any).adsbygoogle) {
              try {
                (window as any).adsbygoogle.push({});
              } catch (e) {
                console.error("AdSense error", e);
              }
            }
          }}
        />
      </>
    </div>
  );
}