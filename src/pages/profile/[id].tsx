import React, { useState } from "react";
import { useRouter } from "next/router";
import {
  useFollowingQuery,
  useProfileQuery,
  usePublicationsQuery,
  PublicationTypes,
} from "../../graphql/generated";
import { MediaRenderer, Web3Button, useAddress } from "@thirdweb-dev/react";
import FeedPost from "../../components/FeedPost";
import {
  LENS_CONTRACT_ABI,
  LENS_CONTRACT_ADDRESS,
} from "@/src/const/contracts";
import { useFollow } from "@/src/lib/useFollow";
import { useUnfollow } from "@/src/lib/useUnfollow";

type Props = {};

export default function ProfilePage({}: Props) {
  const [activeSort, setActiveSort] = useState<string>("Feed");
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const router = useRouter();
  const address = useAddress();

  const { id } = router.query;

  const { mutateAsync: followUser } = useFollow();
  const { mutateAsync: unfollowUser } = useUnfollow();

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
        handle: id,
      },
    },
    {
      enabled: !!id,
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
      enabled: !!profileData,
      onSuccess: (data) => {
        // 1. Store users followed into array
        let followedUserIds: Array<any> = [];
        data?.following?.items.map((data) =>
          followedUserIds.push(data.profile.id)
        );

        if (followedUserIds.includes(profileData?.profile?.id)) {
          setIsFollowing(true);
        }
      },
    }
  );

  const {
    isLoading: isLoadingPublications,
    data: publicationsData,
    error: publicationsError,
  } = usePublicationsQuery(
    {
      request: {
        profileId: profileData?.profile?.id,
      },
    },
    { enabled: !!profileData?.profile?.id }
  );

  const {
    isLoading: isLoadingCollectedPublications,
    data: collectedPublicationsData,
    error: collectedPublicationsError,
  } = usePublicationsQuery(
    {
      request: {
        collectedBy: profileData?.profile?.ownedBy,
        publicationTypes: [
          PublicationTypes.Post,
          PublicationTypes.Comment,
          PublicationTypes.Mirror,
        ],
      },
    },
    { enabled: !!profileData?.profile?.id }
  );

  console.log({
    profileData,
    loadingProfile,
    publicationsData,
    isLoadingPublications,
  });

  if (publicationsError || profileError) {
    return <div>Couldn't find this profile.</div>;
  }

  if (loadingProfile) {
    return <div>Loading profile...</div>;
  }

  return (
    <div>
      <div className="flex flex-col justify-center items-center">
        {/* Cover Image */}
        {/* @ts-ignore */}
        {profileData?.profile?.coverPicture?.original?.url && (
          <MediaRenderer
            // @ts-ignore
            src={profileData?.profile?.coverPicture?.original?.url || ""}
            alt={profileData?.profile?.name || profileData?.profile?.handle}
          />
        )}
        {/* Profile Picture */}
        {/* @ts-ignore */}
        {profileData?.profile?.picture?.original.url && (
          <MediaRenderer
            // @ts-ignore
            src={profileData.profile.picture.original.url}
            alt={profileData.profile.name || profileData.profile.handle || ""}
            className="max-h-[100px] rounded-full"
          />
        )}
        {/* Profile Name */}
        <h1 className="text-4xl font-bold">
          {profileData?.profile?.name || "Anon User"}
        </h1>
        {/* Profile Handle */}
        <p>@{profileData?.profile?.handle}</p>
        {/* Profile Description */}
        <p>{profileData?.profile?.bio}</p>
        <p>
          {profileData?.profile?.stats.totalFollowers} {" Followers"}{" "}
        </p>
        {isFollowing != true && profileData?.profile?.ownedBy != address ? (
          <Web3Button
            contractAddress={LENS_CONTRACT_ADDRESS}
            contractAbi={LENS_CONTRACT_ABI}
            action={async () => await followUser(profileData?.profile?.id)}
          >
            Follow User
          </Web3Button>
        ) : isFollowing == true && profileData?.profile?.ownedBy != address ? (
          <Web3Button
            contractAddress={LENS_CONTRACT_ADDRESS}
            contractAbi={LENS_CONTRACT_ABI}
            action={async () => await unfollowUser(profileData?.profile?.id)}
          >
            Unfollow User
          </Web3Button>
        ) : (
          <></>
        )}
      </div>
      <div className="flex flex-row justify-center items-center mx-auto gap-6 pt-6">
        <button
          onClick={handleSort("Feed")}
          className={
            activeSort == "Feed"
              ? "font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-300"
              : "text-slate-500"
          }
        >
          Feed
        </button>
        <button
          onClick={handleSort("Collected")}
          className={
            activeSort == "Collected"
              ? "font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-300"
              : "text-slate-500"
          }
        >
          Collected
        </button>
      </div>
      {activeSort == "Feed" && (
        <div className="flex flex-col justify-center md:items-center">
          <div className="flex flex-col justify-center pt-6 gap-4 px-2">
            {isLoadingPublications ? (
              <div>Loading Publications...</div>
            ) : (
              // Iterate over the items in the publications array
              publicationsData?.publications.items.map((publication) => (
                <FeedPost publication={publication} key={publication.id} />
              ))
            )}
          </div>
        </div>
      )}
      {activeSort == "Collected" && (
        <div className="flex flex-col justify-center md:items-center">
          <div className="flex flex-col justify-center pt-12 gap-4 px-2">
            {isLoadingPublications ? (
              <div>Loading Publications...</div>
            ) : (
              // Iterate over the items in the publications array
              collectedPublicationsData?.publications.items.map(
                (publication) => (
                  <FeedPost publication={publication} key={publication.id} />
                )
              )
            )}
          </div>
        </div>
      )}
    </div>
  );
}
