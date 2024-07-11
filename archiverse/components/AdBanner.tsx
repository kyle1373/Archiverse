import React, { useEffect } from "react";
import styled from "styled-components";

type AdBannerTypes = {
  dataAdSlot: string;
  dataAdFormat: string;
  dataFullWidthResponsive: boolean;
};

const AdBanner = ({
  dataAdSlot,
  dataAdFormat,
  dataFullWidthResponsive,
}: AdBannerTypes) => {
  useEffect(() => {
    if (window && (window as any).adsbygoogle) {
      console.log("Loading ad " + dataAdSlot + " inside useEffect");

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
      <ins
        className="adsbygoogle"
        style={{ display: "block", height: 80 }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      ></ins>
    </div>
  );
};

export default AdBanner;
