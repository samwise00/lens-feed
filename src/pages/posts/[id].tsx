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
import Comment from "../../components/Comment";
import {
  LENS_CONTRACT_ABI,
  LENS_CONTRACT_ADDRESS,
} from "@/src/const/contracts";
import { useFollow } from "@/src/lib/useFollow";
import { useUnfollow } from "@/src/lib/useUnfollow";
import useCreatePost from "@/src/lib/useCreatePost";
import useComment from "@/src/lib/useComment";

type Props = {};

export default function ProfilePage({}: Props) {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [content, setContent] = useState<string>("");
  const { mutateAsync: comment } = useComment();

  const router = useRouter();

  const { id } = router.query;

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
  } = usePublicationsQuery({
    request: {
      publicationIds: [id],
    },
  });

  const {
    isLoading: isLoadingComments,
    data: commentsData,
    error: commentsError,
  } = usePublicationsQuery({
    request: {
      commentsOf: id,
    },
  });

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
    <div className="flex justify-center items-center mx-auto">
      <div className="flex flex-col justify-center md:items-stretch gap-6">
        <div className="flex flex-col justify-center items-center pt-6 gap-4 px-2">
          {isLoadingPublications ? (
            <div>Loading Publications...</div>
          ) : (
            // Iterate over the items in the publications array
            publicationsData?.publications.items.map((publication) => (
              <FeedPost publication={publication} key={publication.id} />
            ))
          )}
        </div>
        <div>
          <div>
            {/* Content */}
            <div>
              <textarea
                className="text-black"
                placeholder="Content"
                onChange={(e) => setContent(e.target.value)}
              />
            </div>
            <Web3Button
              contractAddress={LENS_CONTRACT_ADDRESS}
              contractAbi={LENS_CONTRACT_ABI}
              action={async () => {
                return await comment({
                  content,
                  publicationId: id,
                });
              }}
            >
              Comment
            </Web3Button>
          </div>
        </div>
        <div className="flex flex-col justify-center items-stretch pt-6 gap-4 px-2">
          {isLoadingPublications ? (
            <div>Loading Publications...</div>
          ) : (
            // Iterate over the items in the publications array
            commentsData?.publications.items.map((publication) => (
              <Comment publication={publication} key={publication.id} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
