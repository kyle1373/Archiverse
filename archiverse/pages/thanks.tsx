import SEO from "@/components/SEO";
import Wrapper from "@components/Wrapper";
import { LINKS } from "@constants/constants";
import AppreciationCard from "@components/AppreciationCard";

export default function Home() {
  return (
    <>
      <SEO title={"Appreciations"} />
      <Wrapper>
        <div className="flex bg-[#f6f6f6] text-neutral-700 font-semibold border-b-[1px] border-gray mt-[-16px] mx-[-16px] px-2 py-1 text-base">
          Appreciations
        </div>
        <AppreciationCard
          miiName={"Kyle / SuperFX"}
          subName={"Developer of Archiverse"}
          text="Created the current Archiverse website you see right now!"
          miiUrl={"superfx.png"}
          socialLink={LINKS.superfx}
        />
        <div className="border-t-[1px] border-gray" />

        <AppreciationCard
          miiName={"luna"}
          subName={"Archiverse's Designer"}
          text={
            "Created the Archiverse logo, Miiverse icons, and guided the UI design for Archiverse. Created the FAQ page content. Moderates the Archiverse Discord server."
          }
          miiUrl={"luna.png"}
          socialLink={LINKS.luna}
        />
        <div className="border-t-[1px] border-gray" />
        <AppreciationCard
          miiName={"Tim / Drastic Actions"}
          text={
            "Created the original Archiverse website (archiverse.guide) and ran it from 2018 - 2024 until Kyle / SuperFX's takeover."
          }
          subName={"Original Archiverse Creator (2018-2024)"}
          miiUrl={"drasticactions.png"}
          socialLink={LINKS.drasticactions}
        />
        <div className="border-t-[1px] border-gray" />
        <AppreciationCard
          miiName={"Archive Team"}
          subName={"Archived Miiverse"}
          text={
            "Archived 5 years of Miiverse data onto Internet Archive for anyone to see, which made this website possible."
          }
          miiUrl={"archiveteam.png"}
          socialLink={LINKS.archiveteam}
        />
      </Wrapper>
    </>
  );
}
