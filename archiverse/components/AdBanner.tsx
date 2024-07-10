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
    try {
      ((window as any).adsbygoogle = (window as any).adsbygoogle || []).push(
        {}
      );
    } catch (error: any) {
      console.log(error.message);
    }
  }, []);

  const InfeedAd = styled.ins`
    display: block;
    @media (min-width: 0px) {
    height: 70px;
    }
    @media (min-width: 350px) {
      height: 70px;
    }
    @media (min-width: 500px) {
      height: 70px;
    }
    @media (min-width: 800px) {
      height: 70px;
    }
  `;

  return (
    <div className="bg-gray py-2 text-center md:px-2 pt-1">
      <h1 className="text-neutral-500 text-xs mb-2">Advertisement</h1>
      <InfeedAd
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={process.env.NEXT_PUBLIC_GOOGLE_ADS_CLIENT_ID}
        data-ad-slot={dataAdSlot}
        data-ad-format={dataAdFormat}
        data-full-width-responsive={dataFullWidthResponsive.toString()}
      ></InfeedAd>
    </div>
  );
};

export default AdBanner;
