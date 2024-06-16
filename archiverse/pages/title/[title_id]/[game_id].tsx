import SEO from "@/components/SEO";
import useApi from "@hooks/useApi";
import { Community } from "@server/database";
import Wrapper from "@components/Wrapper";
import { useParams } from "next/navigation";
import LoadOrRetry from "@components/LoadOrRetry";

export default function Home() {
  const { title_id, game_id } = useParams<{
    title_id: string;
    game_id: string;
  }>();

  const {
    data: community,
    error: communityError,
    fetching: communityFetching,
    refetch: communityRefetch,
  } = useApi<Community[]>(`community/${title_id}/${game_id}`);

  return (
    <>
      <SEO />
      <Wrapper>
        <LoadOrRetry
          fetching={communityFetching}
          error={communityError}
          refetch={communityRefetch}
        />
        {JSON.stringify(community)}
      </Wrapper>
    </>
  );
}
