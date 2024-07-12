import { useEffect } from "react";
import Script from "next/script";

export default function AdBanner() {
  return (
    <div className="bg-gray py-2 text-center md:px-2 pt-1">
      <h1 className="text-neutral-500 text-xs mb-2">Advertisement</h1>
      <>
        <amp-ad
          width="100vw"
          height="320"
          type="adsense"
          data-ad-client="ca-pub-4203889559099732"
          data-ad-slot="1525315872"
          data-auto-format="rspv"
          data-full-width=""
        >
          <div overflow=""></div>
        </amp-ad>
      </>
    </div>
  );
}
