import { useMutation } from "@tanstack/react-query";
import { useSDK } from "@thirdweb-dev/react";
import { FOLLOW_NFT_ABI } from "../const/contracts";
import { useCreateUnfollowTypedDataMutation } from "../graphql/generated";
import useLogin from "./auth/useLogin";
import { signTypedDataWithOmmittedTypename, splitSignature } from "./helpers";

export function useUnfollow() {
  const { mutateAsync: requestTypedData } =
    useCreateUnfollowTypedDataMutation();
  const sdk = useSDK();
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

    const followNftContract = await sdk.getContractFromAbi(
      domain.verifyingContract,
      FOLLOW_NFT_ABI
    );

    const sig = {
      v,
      r,
      s,
      deadline: value.deadline,
    };

    const result = await followNftContract.call(
      "burnWithSig",
      value.tokenId,
      sig
    );

    console.log(result);
  }

  return useMutation(unfollow);
}
