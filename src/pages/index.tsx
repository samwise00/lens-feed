import FeedPost from "../components/FeedPost";
import {
  PublicationMainFocus,
  PublicationSortCriteria,
  useExplorePublicationsQuery,
} from "../graphql/generated";

import SignInButton from "../components/SignInButton";

export default function Home() {
  const { isLoading, error, data } = useExplorePublicationsQuery(
    {
      request: {
        sortCriteria: PublicationSortCriteria.TopCollected,
      },
    },
    {
      // Don't re-fetch when user comes back
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );
  if (error) {
    return <div>Loading...</div>;
  }
  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center mx-auto">
        <div className="flex flex-col justify-start gap-20">
          {data?.explorePublications.items.map((publication) => (
            <FeedPost publication={publication} key={publication.id} />
          ))}
        </div>
      </div>
    </div>
  );
}
