import React from "react";
import { useRouter } from "next/router";
import { useProfileQuery, usePublicationsQuery } from "../../graphql/generated";
import { MediaRenderer, Web3Button } from "@thirdweb-dev/react";
import FeedPost from "../../components/FeedPost";
import {
  LENS_CONTRACT_ABI,
  LENS_CONTRACT_ADDRESS,
} from "@/src/const/contracts";
import { useFollow } from "@/src/lib/useFollow";

type Props = {};

export default function ProfilePage({}: Props) {
  const router = useRouter();

  const { id } = router.query;

  const { mutateAsync: followUser } = useFollow();

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
    <div className="flex flex-col justify-center items-center mx-auto">
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
          className="max-h-[100px]"
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

      <Web3Button
        contractAddress={LENS_CONTRACT_ADDRESS}
        contractAbi={LENS_CONTRACT_ABI}
        action={async () => await followUser(profileData?.profile?.id)}
      >
        Follow User
      </Web3Button>

      <div className="flex flex-col gap-12 pt-12">
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
  );
}
