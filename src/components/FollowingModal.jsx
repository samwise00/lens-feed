import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
} from "@chakra-ui/react";

import { useFollowingQuery } from "../graphql/generated";

import Link from "next/link";

import { MediaRenderer, useAddress } from "@thirdweb-dev/react";
import { useFollow } from "@/src/lib/useFollow";

export const FollowingModal = ({ isOpen, onClose, profileData }) => {
  const address = useAddress();
  const { mutateAsync: followUser } = useFollow();
  const {
    isLoading: loadingfollowers,
    data: followingData,
    error: followingError,
  } = useFollowingQuery(
    {
      request: {
        address: address,
      },
    },
    {
      enabled: !!profileData?.profile?.id,
    }
  );
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={10} bg="#1e1e1e" maxW={360} maxH={700} rounded="3xl">
          <ModalBody py={4}>
            <div className="max-h-[680px] overflow-auto">
              <div className="flex flex-col">
                <div className="flex flex-row justify-center">
                  <h1 className="pb-4 text-lg font-bold">Following</h1>
                </div>
                {followingData &&
                  followingData?.following.items.map((follower) => {
                    return (
                      <div className="flex flex-row justify-between py-2 px-4">
                        <div className="flex flex-row gap-4">
                          {/* Author Profile Picture */}
                          <MediaRenderer
                            // @ts-ignore - the type does exist
                            src={
                              follower?.profile?.picture?.original?.url ||
                              "/logo.png"
                            }
                            alt={
                              follower?.profile?.name ||
                              follower?.profile?.handle
                            }
                            className="h-[40px] w-[40px] rounded-lg"
                          />
                          {/* Author profile name */}
                          <div className="flex flex-col">
                            <Link
                              href={`/profile/${follower?.profile?.handle}`}
                              className="font-bold text-sm"
                            >
                              {follower?.profile?.name}
                            </Link>
                            <p className="text-xs text-slate-400">
                              @{follower?.profile?.handle}
                            </p>
                          </div>
                        </div>
                        <Link
                          href={`/profile/${follower?.profile?.handle}`}
                          className="flex justify-end items-center text-sm"
                        >
                          View Profile
                        </Link>
                      </div>
                    );
                  })}
                <button
                  onClick={onClose}
                  className="flex justify-center items-center font-bold py-4"
                >
                  {" "}
                  close
                </button>
              </div>
            </div>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default FollowingModal;
