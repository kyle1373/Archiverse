import SEO from "@/components/SEO";
import { Community } from "@server/database";
import Wrapper from "@components/Wrapper";
import { useParams } from "next/navigation";
import LoadOrRetry from "@components/LoadOrRetry";

export default function Home() {
  const params = useParams<{
    title_id: string;
    game_id: string;
  }>();

  const title_id = params?.title_id;
  const game_id = params?.game_id;



  return (
    <>
      <SEO />
      <Wrapper>

      </Wrapper>
    </>
  );
}
