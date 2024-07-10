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
        console.error('AdSense error', e);
      }
    }
  }, []);

  return (
    <>
      <ins
        className="adsbygoogle"
        style={{ display: 'block' }}
        data-ad-client="ca-pub-4203889559099732"
        data-ad-slot="5648641130"
        data-ad-format="auto"
        data-full-width-responsive="true"
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
              console.error('AdSense error', e);
            }
          }
        }}
      />
    </>
  );
}
