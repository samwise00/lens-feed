import { useAddress } from "@thirdweb-dev/react";
import FeedPost from "../components/FeedPost";
import ProfilePanel from "../components/ProfilePanel";
import RightPanel from "../components/RightPanel";
import FollowingPanel from "../components/FollowingPanel";
import {
  PublicationSortCriteria,
  useExplorePublicationsQuery,
  useFollowingQuery,
  useProfileQuery,
  usePublicationsQuery,
} from "../graphql/generated";
import React, { useState } from "react";
import useLensUser from "../lib/auth/useLensUser";

export default function Home() {
  const [activeSort, setActiveSort] = useState<string>("Popular");
  const [followingPublications, setFollowingPublications] = useState<any>(null);
  const { profileQuery } = useLensUser();
  const address = useAddress();

  const handleSort = (val: string) => () => {
    setActiveSort(val);
  };

  const {
    isLoading: loadingProfile,
    data: profileData,
    error: profileError,
  } = useProfileQuery(
    {
      request: {
        handle: profileQuery?.data?.defaultProfile?.handle,
      },
    },
    {
      enabled: !!profileQuery?.data?.defaultProfile?.handle,
    }
  );

  const {
    isLoading: isLoadingLatest,
    error: errorLatest,
    data: dataLatest,
  } = useExplorePublicationsQuery(
    {
      request: {
        sortCriteria: PublicationSortCriteria.Latest,
      },
    },
    {
      // Don't re-fetch when user comes back
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
    }
  );

  const {
    isLoading: isLoadingPopular,
    error: errorPopular,
    data: dataPopular,
  } = useExplorePublicationsQuery(
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

  const {
    isLoading: followingLoading,
    error: followingError,
    data: followingData,
  } = useFollowingQuery(
    {
      request: {
        address: address,
      },
    },
    {
      // Don't re-fetch when user comes back
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      onSuccess: (data) => {
        // 1. Store users followed into array
        let followedUserIds: Array<any> = [];
        console.log(`following Data: ${followingData}`);
        data?.following?.items.map((data) =>
          followedUserIds.push(data.profile.id)
        );

        setFollowingPublications(followedUserIds);
      },
    }
  );

  const {
    isLoading: isLoadingFollowPublications,
    data: followPublicationsData,
    error: followPublicationsError,
  } = usePublicationsQuery(
    {
      request: {
        profileIds: followingPublications,
      },
    },
    { enabled: !!followingPublications }
  );

  if (
    errorLatest ||
    errorPopular ||
    followingError ||
    followPublicationsError
  ) {
    return <div>Loading...</div>;
  }
  if (
    isLoadingLatest ||
    isLoadingPopular ||
    followingLoading ||
    isLoadingFollowPublications
  ) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex flex-row justify-center items-start md:max-w-[1000px] gap-4 pt-4">
        <div className="flex flex-col items-end hidden md:block">
          <ProfilePanel
            profileData={profileData}
            key={profileData?.profile?.id}
          />
          <FollowingPanel
            profileData={profileData}
            key={dataLatest?.explorePublications.items[0].id}
          />
        </div>
        <div className="flex flex-col justify-center items-center pt-4">
          <div className="flex bg-black">
            <h1 className="text-white dark:text-white p-2">
              What's on your mind?
            </h1>
          </div>
          <div className="flex flex-row justify-center items-center mx-auto gap-6 pt-4">
            <button
              onClick={handleSort("Popular")}
              className={
                activeSort == "Popular"
                  ? "font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-300"
                  : "text-slate-500"
              }
            >
              Popular
            </button>
            <button
              onClick={handleSort("Newest")}
              className={
                activeSort == "Newest"
                  ? "font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-300"
                  : "text-slate-500"
              }
            >
              Newest
            </button>
            <button
              onClick={handleSort("Following")}
              className={
                activeSort == "Following"
                  ? "font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-300"
                  : "text-slate-500"
              }
            >
              Following
            </button>
          </div>
          <div className="flex flex-col justify-center pt-4 gap-4">
            {activeSort == "Newest" &&
              dataLatest?.explorePublications.items.map((publication) => (
                <FeedPost publication={publication} key={publication.id} />
              ))}
            {activeSort == "Popular" &&
              dataPopular?.explorePublications.items.map((publication) => (
                <FeedPost publication={publication} key={publication.id} />
              ))}
            {activeSort == "Following" &&
              followPublicationsData?.publications.items.map(
                (publication: any) => {
                  return (
                    <FeedPost publication={publication} key={publication.id} />
                  );
                }
              )}
          </div>
        </div>
        <div className="flex flex-col items-end hidden md:block">
          <div className="flex flex-col justify-center gap-4">
            <FollowingPanel
              profileData={profileData}
              key={dataLatest?.explorePublications.items[0].id}
            />
          </div>
        </div>
      </div>
      {/* old layout below */}
    </div>
  );
}
