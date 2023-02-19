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
    isLoading: isLoadingPublications,
    data: publicationsData,
    error: publicationsError,
  } = usePublicationsQuery(
    {
      request: {
        publicationIds: [id],
      },
    },
    {
      enabled: !!id,
    }
  );

  const {
    isLoading: isLoadingComments,
    data: commentsData,
    error: commentsError,
  } = usePublicationsQuery(
    {
      request: {
        commentsOf: id,
      },
    },
    {
      enabled: !!id,
      onSuccess: (data) => {
        console.log(data);
      },
    }
  );

  console.log({
    publicationsData,
    isLoadingPublications,
  });

  if (publicationsError) {
    return <div>Couldn't find this profile.</div>;
  }

  if (commentsError) {
    return <div>Error loading comments...</div>;
  }

  return (
    <div className="flex justify-center items-center mx-auto">
      <div className="flex flex-col justify-center gap-1">
        <div className="flex flex-col justify-center items-center pt-4">
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
          <div className="flex flex-row justify-between gap-4 bg-white dark:bg-[#1e1e1e] md:rounded-2xl px-4 py-2 text-slate-500 text-xs pb-4">
            <textarea
              className="shadow appearance-none dark:bg-[#101010] rounded-lg w-full py-2 px-3 text-slate-500 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              placeholder="Add a comment..."
              onChange={(e) => setContent(e.target.value)}
            />
            <button
              onClick={async () => {
                return await comment({
                  content,
                  publicationId: id,
                });
              }}
              className="flex justify-center items-center font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-300"
            >
              Comment
            </button>
          </div>
        </div>
        <div className="flex flex-col justify-center items-stretch gap-4 pt-4">
          {isLoadingComments ? (
            <div>Loading Comments...</div>
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
