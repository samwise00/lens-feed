import { MediaRenderer, useAddress } from "@thirdweb-dev/react";
import FeedPost from "../components/FeedPost";
import ProfilePanel from "../components/ProfilePanel";
import RightPanel from "../components/RightPanel";
import FollowingPanel from "../components/FollowingPanel";
import Footer from "../components/Footer";
import {
  PublicationSortCriteria,
  useExplorePublicationsQuery,
  useFollowingQuery,
  useProfileQuery,
  usePublicationsQuery,
} from "../graphql/generated";
import React, { useEffect, useState } from "react";
import useLensUser from "../lib/auth/useLensUser";
import useCreatePost from "../lib/useCreatePost";

export default function Home() {
  const [activeSort, setActiveSort] = useState<string>("Popular");
  const [image, setImage] = useState<File | null>(null);
  const [preview, setPreview] = useState();
  const [content, setContent] = useState<string>("");
  const [followingPublications, setFollowingPublications] = useState<any>(null);
  const { profileQuery } = useLensUser();
  const address = useAddress();
  const { mutateAsync: createPost } = useCreatePost();

  const handleSort = (val: string) => () => {
    setActiveSort(val);
  };

  // Create a reference to the hidden file input element
  const hiddenFileInput = React.useRef(null);

  // Programatically click the hidden file input element
  // when the Button component is clicked
  const handleClick = () => {
    if (hiddenFileInput.current) {
      hiddenFileInput.current.click();
    }
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
      <div className="flex flex-row justify-center items-start md:max-w-[1000px] gap-4 pt-4 mx-auto">
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
        <div className="flex flex-col justify-center items-center">
          <div className="flex flex-row justify-between items-end w-full mx-auto gap-4 rounded-xl bg-white dark:bg-[#1e1e1e] p-4 text-slate-500 text-xs">
            <div className="flex flex-col w-full">
              <div className="flex flex-row justify-between items-start w-full mx-auto gap-2">
                <MediaRenderer
                  src={
                    // @ts-ignore - the type does exist
                    profileData?.profile?.picture?.original?.url || "/logo.png"
                  }
                  alt={
                    profileData?.profile?.name || profileData?.profile?.handle
                  }
                  className="h-[35px] w-[35px] rounded-lg"
                />
                <textarea
                  className="shadow resize-none appearance-none dark:bg-[#101010] rounded-lg w-full px-3 h-8 pt-2 text-slate-500 focus:outline-none focus:shadow-outline"
                  id="username"
                  spellCheck="false"
                  placeholder="What's on your mind?"
                  onChange={(e) => setContent(e.target.value)}
                />
                {!image && (
                  <button onClick={handleClick}>
                    <img
                      src="/upload-image.png"
                      className="invert-[100%] h-7 opacity-60 object-contain"
                    ></img>
                  </button>
                )}
              </div>
              {image && (
                <div className="relative">
                  <button>
                    <div
                      className="absolute font-extrabold text-lg pt-4 text-white right-0 pr-3"
                      onClick={() => {
                        setImage(null);
                      }}
                    >
                      X
                    </div>
                  </button>
                  <img
                    className="pt-2 rounded-xl"
                    src={URL.createObjectURL(image)}
                  ></img>
                </div>
              )}
              <div className="flex flex-row justify-end w-full pt-2 gap-2">
                <div>
                  <input
                    type="file"
                    ref={hiddenFileInput}
                    style={{ display: "none" }}
                    onChange={(e) => {
                      if (e.target.files) {
                        setImage(e.target.files[0]);
                      }
                    }}
                  ></input>
                </div>
                {(content || image) && (
                  <button
                    onClick={async () => {
                      if (image) {
                        return await createPost({
                          content,
                          image,
                        });
                      }
                      return await createPost({
                        content,
                      });
                    }}
                  >
                    Post
                  </button>
                )}
              </div>
            </div>
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
            <RightPanel
              profileData={profileData}
              key={dataLatest?.explorePublications.items[0].id}
            />
            <Footer
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
