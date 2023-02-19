import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  Button,
} from "@chakra-ui/react";

import Link from "next/link";
import {
  LENS_CONTRACT_ABI,
  LENS_CONTRACT_ADDRESS,
} from "@/src/const/contracts";

import { MediaRenderer, Web3Button } from "@thirdweb-dev/react";
import { useFollow } from "@/src/lib/useFollow";

export const RecommendedModal = ({
  isOpen,
  onClose,
  recommendedProfilesData,
}) => {
  const { mutateAsync: followUser } = useFollow();
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent mx={10} bg="#1e1e1e" maxW={360} maxH={700} rounded="3xl">
          <ModalBody py={4}>
            <div className="max-h-[680px] overflow-x-hidden">
              <div className="flex flex-col">
                <div className="flex flex-row justify-center">
                  <h1 className="pb-4 text-lg font-bold">
                    Recommended Profiles
                  </h1>
                </div>
                {recommendedProfilesData &&
                  recommendedProfilesData?.recommendedProfiles?.map(
                    (profile, index) => {
                      return (
                        <div className="flex flex-row justify-between py-2 px-4">
                          <div className="flex flex-row gap-4">
                            {/* Author Profile Picture */}
                            <MediaRenderer
                              // @ts-ignore - the type does exist
                              src={
                                profile?.picture?.original?.url || "/logo.png"
                              }
                              alt={profile?.name || profile.handle}
                              className="h-[40px] w-[40px] rounded-lg"
                            />
                            {/* Author profile name */}
                            <div className="flex flex-col">
                              <Link
                                href={`/profile/${profile?.handle}`}
                                className="font-bold text-sm"
                              >
                                {profile?.name}
                              </Link>
                              <p className="text-xs text-slate-400">
                                @{profile?.handle}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={async () =>
                              await followUser(profile?.profile?.id)
                            }
                            className="text-sm"
                          >
                            Follow
                          </button>
                        </div>
                      );
                    }
                  )}
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

export default RecommendedModal;
