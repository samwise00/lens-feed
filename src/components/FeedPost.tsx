import React from "react";
import Link from "next/link";
import { ExplorePublicationsQuery } from "../graphql/generated";
import { MediaRenderer, Web3Button } from "@thirdweb-dev/react";

import styles from "../../styles/styles";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../const/contracts";
import { useMirror } from "../lib/useMirror";
import { useUnfollow } from "../lib/useUnfollow";

type Props = {
  publication: any;
};

export default function FeedPost({ publication }: Props) {
  const { mutateAsync: mirrorPublication, isLoading: mirrorTxInProgress } =
    useMirror();
  const { mutateAsync: unfollowUser } = useUnfollow();

  return (
    <div className="flex flex-col justify-center max-w-[400px]">
      {publication.__typename == "Mirror" && (
        <div className="flex flex-row justify-start items-end gap-1 pb-1 pl-1">
          <MediaRenderer
            src={publication?.profile?.picture?.original?.url || "/logo.png"}
            alt={publication.profile.name || publication.profile.handle}
            className="h-[20px] w-[20px] rounded-full"
          />
          <Link
            href={`/profile/${publication.profile.handle}`}
            className="text-slate-500 text-xs "
          >
            mirrored by {publication?.profile?.name}
          </Link>
        </div>
      )}
      {publication.__typename == "Comment" && (
        <div className="flex flex-row justify-start items-end gap-1 pb-1 pl-1">
          <MediaRenderer
            src={publication?.profile?.picture?.original?.url || "/logo.png"}
            alt={publication.profile.name || publication.profile.handle}
            className="h-[20px] w-[20px] rounded-full"
          />
          <p className="text-slate-500 text-xs ">
            {publication?.profile?.name} commented
          </p>
        </div>
      )}
      <div className="bg-white  rounded-t-2xl drop-shadow-lg p-4">
        <div className="flex flex-row gap-4">
          {/* Author Profile Picture */}
          <MediaRenderer
            // @ts-ignore - the type does exist
            src={
              (publication?.__typename == "Post" &&
                publication?.profile?.picture?.original?.url) ||
              (publication?.__typename == "Mirror" &&
                publication?.mirrorOf?.profile?.picture?.original?.url) ||
              (publication?.__typename == "Comment" &&
                publication?.mainPost?.profile?.picture?.original?.url) ||
              "/logo.png"
            }
            alt={publication.profile.name || publication.profile.handle}
            className="h-[50px] w-[50px] rounded-full"
          />
          {/* Author profile name */}
          <div className="flex flex-col">
            <Link
              href={
                publication?.__typename == "Post"
                  ? `/profile/${publication.profile.handle}`
                  : publication?.__typename == "Mirror"
                  ? `/profile/${publication.mirrorOf.profile.handle}`
                  : `/profile/${publication.mainPost.profile.handle}`
              }
              className="font-bold text-xl"
            >
              @{publication?.__typename == "Post" && publication.profile.name}
              {publication.mirrorOf?.profile?.name}
              {publication.mainPost?.profile?.name}
            </Link>
            <p className="text-sm text-slate-400">
              @{publication?.__typename == "Post" && publication.profile.handle}
              {publication.mirrorOf?.profile?.handle}
              {publication.mainPost?.profile?.handle}
            </p>
          </div>
        </div>
        <div>
          {/** Name of the Post */}
          {/* <h3>{publication.metadata.name}</h3> */}
          {/* Description of the Post */}
          <p className="break-words pt-2">{publication.metadata.content}</p>
          {/* Image / media of the post if there is one */}
        </div>
      </div>
      {(publication.metadata.image ||
        publication.metadata.media?.length > 0) && (
        <div>
          <MediaRenderer
            src={
              publication.metadata.image ||
              publication.metadata.media[0].original.url
            }
            alt={publication.metadata.name || ""}
            className="object-fill break-words"
          />
        </div>
      )}
      <div className="flex flex-row justify-end gap-8 rounded-b-2xl drop-shadow-xl bg-gradient-to-r from-purple-300/50 via-purple-100/50 to-cyan-100/50  px-4 py-2">
        <div className="flex flex-row gap-2 items-center">
          <button
            onClick={async () => await mirrorPublication({ publication })}
          >
            <img
              src="/mirror.png"
              className={`${mirrorTxInProgress && `animate-spin`} h-5`}
            />
          </button>
          <p>{publication.stats.totalAmountOfMirrors}</p>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <img src="/comment.png" className="h-5" />
          <p>{publication.stats.totalAmountOfComments}</p>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <img src="/heart.png" className="h-5" />
          <p>{publication.stats.totalAmountOfCollects}</p>
        </div>
      </div>
    </div>
  );
}
