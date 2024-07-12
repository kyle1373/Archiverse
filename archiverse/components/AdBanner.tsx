import { useEffect, useRef } from 'react';
import { useAmp } from 'next/amp';
import Script from 'next/script';

export const config = { amp: 'hybrid' }; // Enable hybrid AMP mode

export default function AdBanner() {
  const isAmp = useAmp(); // Check if the page is being rendered as AMP
  const ampAdRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isAmp && ampAdRef.current) {
      ampAdRef.current.setAttribute('overflow', '');
    }
  }, [isAmp]);

  return (
    <div className="bg-gray py-2 text-center md:px-2 pt-1">
      <h1 className="text-neutral-500 text-xs mb-2">Advertisement</h1>
      {isAmp ? (
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
            <div ref={ampAdRef}></div>
          </amp-ad>
          <Script
            async
            custom-element="amp-ad"
            src="https://cdn.ampproject.org/v0/amp-ad-0.1.js"
          />
        </>
      ) : (
        <p>AMP ads will only be displayed on AMP pages.</p>
      )}
    </div>
  );
}
