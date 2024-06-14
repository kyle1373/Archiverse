import { SEO_METADATA } from "@/constants/constants";
import Head from "next/head";
import React from "react";

interface MetaProps {
  title?: string;
  description?: string;
  imageUrl?: string;
  isImageBig?: boolean;
}

const SEO: React.FC<MetaProps> = ({
  title,
  description,
  imageUrl,
  isImageBig,
}) => {
  const metadata = {
    title: title ? title : SEO_METADATA.title,
    description: description ? description : SEO_METADATA.description,
    imageUrl: imageUrl ? imageUrl : SEO_METADATA.image,
  };
  return (
    <Head>
      <title>{metadata.title}</title>
      <meta name="description" content={metadata.description} />
      <meta property="og:title" content={metadata.title} />
      <meta property="og:description" content={metadata.description} />
      <meta property="og:image" content={metadata.imageUrl} />
      <meta property="og:type" content="website" />
      {isImageBig && <meta name="twitter:card" content="summary_large_image" />}
      <meta name="twitter:title" content={metadata.title} />
      <meta name="twitter:description" content={metadata.description} />
      <meta name="twitter:image" content={metadata.imageUrl} />
    </Head>
  );
};

export default SEO;