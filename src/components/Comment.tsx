import Link from "next/link";
import { MediaRenderer } from "@thirdweb-dev/react";
import { useMirror } from "../lib/useMirror";
import { useUnfollow } from "../lib/useUnfollow";
import { useCollect } from "../lib/useCollect";
import useComment from "@/src/lib/useComment";
import React, { useState } from "react";

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
  const { mutateAsync: unfollowUser } = useUnfollow();

  return (
    <div className="flex flex-col justify-center max-w-[450px]">
      <div className="bg-white dark:bg-[#1e1e1e] md:rounded-t-2xl p-4">
        <div className="flex flex-row gap-4">
          {/* Author Profile Picture */}
          <MediaRenderer
            // @ts-ignore - the type does exist
            src={publication?.profile?.picture?.original?.url || "/logo.png"}
            alt={publication.profile.name || publication.profile.handle}
            className="h-[40px] w-[40px] rounded-lg"
          />
          {/* Author profile name */}
          <div className="flex flex-col">
            <Link
              href={`/profile/${publication.profile.handle}`}
              className="font-bold text-xl"
            >
              @{publication.profile.name}
            </Link>
            <p className="text-sm text-slate-400">
              @{publication.profile.handle}
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
      {/* Post Stats */}
      <div className="flex flex-row justify-between gap-4 bg-white dark:bg-[#1e1e1e] px-4 pt-2 text-slate-500 text-xs">
        <div className="flex flex-row justify-between gap-1 items-center">
          <p>{publication?.stats?.totalAmountOfCollects || "0"}</p>
          <p> collects</p>
        </div>
        <div className="flex flex-row gap-4">
          <div className="flex flex-row gap-1 items-center">
            <p>{publication.stats?.totalAmountOfMirrors || "0"}</p>
            <p> mirrors</p>
          </div>
          <Link href={`/posts/${publication?.id}`}>
            <div className="flex flex-row gap-1 items-center">
              <p>{publication?.stats?.totalAmountOfComments || "0"}</p>
              <p> comments</p>
            </div>
          </Link>
        </div>
      </div>
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
