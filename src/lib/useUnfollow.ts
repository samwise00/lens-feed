import { useMutation } from "@tanstack/react-query";
import { useAddress, useSDK } from "@thirdweb-dev/react";
import {
  LENS_CONTRACT_ABI,
  LENS_CONTRACT_ADDRESS,
  FOLLOW_NFT_ABI,
  FOLLOW_NFT_CONTRACT_ADDRESS,
  LENS_PROFILES_ABI,
  LENS_PROFILES_CONTRACT,
} from "../const/contracts";
import { useCreateUnfollowTypedDataMutation } from "../graphql/generated";
import useLogin from "./auth/useLogin";
import { signTypedDataWithOmmittedTypename, splitSignature } from "./helpers";

export function useUnfollow() {
  const { mutateAsync: requestTypedData } =
    useCreateUnfollowTypedDataMutation();
  const sdk = useSDK();
  const address = useAddress();
  const { mutateAsync: loginUser } = useLogin();

  async function unfollow(userId: string) {
    // 0. Login
    await loginUser();

    // 1. Use the auto generated mutation called "usecreateFollowTypedData"
    // to get the typed data for the user to sign
    const typedData = await requestTypedData({
      request: {
        profile: userId,
      },
    });

    console.log(userId);

    const { domain, types, value } =
      typedData.createUnfollowTypedData.typedData;

    if (!sdk) return;

    // 2. Sign the typed data using the SDK
    const signature = await signTypedDataWithOmmittedTypename(
      sdk,
      domain,
      types,
      value
    );
    console.log(signature);

    const { v, r, s } = splitSignature(signature.signature);

    //  3. Send the typed data to the smart contract to perform the
    // write operation on the blockchain
    const lensHubContract = await sdk.getContractFromAbi(
      LENS_CONTRACT_ADDRESS,
      LENS_CONTRACT_ABI
    );

    const lensProfilesContract = await sdk.getContractFromAbi(
      LENS_PROFILES_CONTRACT,
      LENS_PROFILES_ABI
    );

    // const followNftContract = await sdk.getContractFromAbi(
    //   FOLLOW_NFT_CONTRACT_ADDRESS,
    //   FOLLOW_NFT_ABI
    // );

    console.log(value.tokenId);

    const sig = {
      v,
      r,
      s,
      deadline: value.deadline,
    };

    // const approveRes = await lensHubContract.call(
    //   "approve",
    //   LENS_CONTRACT_ADDRESS,
    //   value.tokenId
    // );

    // Call the smart contract function called "burnWithSig"
    // const result = await lensHubContract.call("burn", value.tokenId);

    // const approve = await lensProfilesContract.call(
    //   "approve",
    //   LENS_PROFILES_CONTRACT,
    //   value.tokenId
    // );

    const result = await lensProfilesContract.call(
      "burnWithSig",
      value.tokenId,
      sig
    );

    console.log(result);
  }

  return useMutation(unfollow);
}
