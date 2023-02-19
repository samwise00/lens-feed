import React, { useState } from "react";
import Link from "next/link";
import { MediaRenderer } from "@thirdweb-dev/react";
import { useMirror } from "../lib/useMirror";
import { useUnfollow } from "../lib/useUnfollow";
import { useCollect } from "../lib/useCollect";
import { Spinner } from "@chakra-ui/react";
import useComment from "@/src/lib/useComment";

type Props = {
  publication: any;
};

export default function FeedPost({ publication }: Props) {
  const [commentBoxOpen, setCommentBoxOpen] = useState<boolean>(false);
  const [content, setContent] = useState<string>("");
  const { mutateAsync: comment } = useComment();

  const handleCommentBoxOpen = () => {
    setCommentBoxOpen(!commentBoxOpen);
  };

  const { mutateAsync: mirrorPublication, isLoading: mirrorTxInProgress } =
    useMirror();
  const { mutateAsync: collectPublication, isLoading: collectTxInProgress } =
    useCollect();

  return (
    <div className="flex flex-col justify-center w-screen md:max-w-[450px] md:px-0">
      {publication.__typename == "Mirror" && (
        <div className="flex flex-row justify-start items-end gap-1 pb-1 pl-1">
          <Link
            href={`/profile/${publication.profile.handle}`}
            className="flex flex-row text-slate-500 text-xs"
          >
            mirrored by&nbsp;{" "}
            <span>
              <MediaRenderer
                src={
                  publication?.profile?.picture?.original?.url || "/logo.png"
                }
                alt={publication.profile.name || publication.profile.handle}
                className="h-[20px] w-[20px] rounded-lg"
              />
            </span>{" "}
            <p>&nbsp;{publication?.profile?.name}</p>
          </Link>
        </div>
      )}
      {publication.__typename == "Comment" && (
        <div className="flex flex-row justify-start items-end gap-1 pb-1 pl-1">
          <MediaRenderer
            src={publication?.profile?.picture?.original?.url || "/logo.png"}
            alt={publication.profile.name || publication.profile.handle}
            className="h-[20px] w-[20px] rounded-lg"
          />
          <p className="text-slate-500 text-xs ">
            {publication?.profile?.name} commented
          </p>
        </div>
      )}
      <div className="bg-white dark:bg-[#1e1e1e] md:rounded-t-2xl p-4">
        <div className="flex flex-row gap-2">
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
            className="h-[40px] w-[40px] rounded-lg"
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
              className="font-bold text-md"
            >
              @{publication?.__typename == "Post" && publication.profile.name}
              {publication.mirrorOf?.profile?.name}
              {publication.mainPost?.profile?.name}
            </Link>
            <p className="text-xs text-slate-400">
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
          <p className="text-sm text-slate-500 dark:text-slate-300 break-words pt-4">
            {publication?.__typename == "Post" &&
              publication?.metadata?.content}
            {publication?.__typename == "Comment" &&
              publication?.mainPost?.metadata?.content}
            {publication?.__typename == "Mirror" &&
              publication?.mirrorOf?.metadata?.content}
          </p>
          {/* Image / media of the post if there is one */}
        </div>
      </div>
      {(publication.metadata.image ||
        publication?.mainPost?.metadata?.image ||
        publication?.mirrorOf?.metadata?.image ||
        publication.metadata.media?.length > 0) && (
        <div>
          <MediaRenderer
            src={
              publication.metadata.image ||
              publication?.mainPost?.metadata?.image ||
              publication?.mirrorOf?.metadata?.image ||
              publication.metadata.media[0].original.url
            }
            alt={publication.metadata.name || ""}
            className="object-fill break-words"
          />
        </div>
      )}
      {/* Post Stats */}
      <div className="flex flex-row justify-between gap-4 bg-white dark:bg-[#1e1e1e] px-4 pt-2 text-slate-500 text-xs">
        <div className="flex flex-row justify-between gap-1 items-center">
          <p>
            {(publication?.__typename == "Post" &&
              publication?.stats?.totalAmountOfCollects) ||
              (publication?.__typename == "Mirror" &&
                publication?.mirrorOf?.stats?.totalAmountOfCollects) ||
              (publication?.__typename == "Comment" &&
                publication?.mainPost?.stats?.totalAmountOfCollects) ||
              "0"}
          </p>
          <p> collects</p>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-row gap-1 items-center">
            <p>
              {(publication?.__typename == "Post" &&
                publication?.stats?.totalAmountOfMirrors) ||
                (publication?.__typename == "Mirror" &&
                  publication?.mirrorOf?.stats?.totalAmountOfMirrors) ||
                (publication?.__typename == "Comment" &&
                  publication?.mainPost?.stats?.totalAmountOfMirrors) ||
                "0"}
            </p>
            <p> mirrors</p>
          </div>
          <Link href={`/posts/${publication?.mainPost?.id}`}>
            <div className="flex flex-row gap-1 items-center">
              <p>
                {(publication?.__typename == "Post" &&
                  publication?.stats?.totalAmountOfComments) ||
                  (publication?.__typename == "Mirror" &&
                    publication?.mirrorOf?.stats?.totalAmountOfComments) ||
                  (publication?.__typename == "Comment" &&
                    publication?.mainPost?.stats?.totalAmountOfComments) ||
                  "0"}
              </p>
              <p> comments</p>
            </div>
          </Link>
        </div>
      </div>
      {/* {publication?.__typename == "Comment" && (
        <p>{publication.metadata?.content}</p>
      )} */}

      {/* Post Actions */}
      <div
        className={`flex flex-row justify-start gap-8 ${
          !commentBoxOpen && "md:rounded-b-2xl"
        } bg-white dark:bg-[#1e1e1e]  px-4 py-2`}
      >
        <div className="flex flex-row gap-2 items-center">
          <button
            onClick={async () => await collectPublication({ publication })}
            className="flex flex-row gap-2 items-center"
          >
            <img
              src="/heart.png"
              className={`${
                collectTxInProgress && `animate-spin`
              } socialicon dark:invert-[100%] h-3`}
            />
            <p className="text-sm text-slate-500 dark:text-slate-300 ">
              Collect
            </p>
          </button>
        </div>
        <div className="flex flex-row gap-2 items-center">
          <button
            onClick={async () => await mirrorPublication({ publication })}
            className="flex flex-row gap-2 items-center"
          >
            <img
              src="/mirror.png"
              className={`${
                mirrorTxInProgress && `animate-spin`
              } socialicon dark:invert-[100%] h-3`}
            />
            <p className="text-sm text-slate-500 dark:text-slate-300 ">
              Mirror
            </p>
          </button>
        </div>

        <div className="flex flex-row gap-2 items-center">
          <button
            className="flex flex-row gap-2 items-center"
            onClick={handleCommentBoxOpen}
          >
            <img
              src="/comment.png"
              className="socialicon dark:invert-[100%] h-3"
            />
            {!commentBoxOpen ? (
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Comment
              </p>
            ) : (
              <p className="text-sm text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-300">
                Comment
              </p>
            )}
          </button>
        </div>
      </div>
      {/* Comment Box */}
      {commentBoxOpen && (
        <div className="flex flex-row justify-between gap-4 bg-white dark:bg-[#1e1e1e] md:rounded-b-lg px-4 py-2 text-slate-500 text-xs pb-4">
          <textarea
            className="shadow appearance-none dark:bg-[#101010] md:rounded-lg w-full py-2 px-3 text-slate-500 leading-tight focus:outline-none focus:shadow-outline"
            id="username"
            placeholder="Add a comment..."
            onChange={(e) => setContent(e.target.value)}
          />
          <button
            onClick={async () => {
              return await comment({
                content,
                publicationId: publication.id,
              });
            }}
            className="flex justify-center items-center font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-400 to-cyan-300"
          >
            Comment
          </button>
        </div>
      )}
    </div>
  );
}
