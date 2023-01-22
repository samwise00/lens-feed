import React from "react";
import Link from "next/link";
import { ExplorePublicationsQuery } from "../graphql/generated";
import { MediaRenderer } from "@thirdweb-dev/react";

import styles from "../../styles/styles";

type Props = {
  publication: ExplorePublicationsQuery["explorePublications"]["items"][0];
};

export default function FeedPost({ publication }: Props) {
  return (
    <div className="flex flex-col justify-start items-start max-w-[400px]">
      <div>
        {/* Author Profile Picture */}
        <MediaRenderer
          // @ts-ignore - the type does exist
          src={publication?.profile?.picture?.original?.url || ""}
          alt={publication.profile.name || publication.profile.handle}
          className="max-w-[50px] rounded-full"
        />

        {/* Author profile name */}
        <Link
          href={`/profile/${publication.profile.handle}`}
          className="font-bold text-4xl"
        >
          {publication.profile.name || publication.profile.handle}
        </Link>
      </div>

      <div>
        {/** Name of the Post */}
        <h3>{publication.metadata.name}</h3>

        {/* Description of the Post */}
        <p className="max-w-[200px] break-words">
          {publication.metadata.content}
        </p>

        {/* Image / media of the post if there is one */}
        {(publication.metadata.image ||
          publication.metadata.media?.length > 0) && (
          <MediaRenderer
            src={
              publication.metadata.image ||
              publication.metadata.media[0].original.url
            }
            alt={publication.metadata.name || ""}
          />
        )}
      </div>

      <div className="flex flex-row gap-4">
        {/*  */}
        <p>{publication.stats.totalAmountOfCollects} Collects</p>
        <p>{publication.stats.totalAmountOfComments} Comments</p>
        <p>{publication.stats.totalAmountOfMirrors} Mirror</p>
      </div>
    </div>
  );
}
