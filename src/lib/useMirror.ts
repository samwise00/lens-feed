import { useMutation } from "@tanstack/react-query";
import { useAddress, useSDK } from "@thirdweb-dev/react";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../const/contracts";
import { useCreateMirrorTypedDataMutation } from "../graphql/generated";
import useLogin from "./auth/useLogin";
import { signTypedDataWithOmmittedTypename, splitSignature } from "./helpers";
import useLensUser from "./auth/useLensUser";

type MirrorArgs = {
  publication: any;
};

export function useMirror() {
  const { mutateAsync: requestTypedData } = useCreateMirrorTypedDataMutation();
  const sdk = useSDK();
  const address = useAddress();
  const { profileQuery } = useLensUser();
  const { mutateAsync: loginUser } = useLogin();

  async function mirror({ publication }: MirrorArgs) {
    try {
      // 0. Login
      await loginUser();
      console.log("test1");
      console.log(publication);
      // 1. Use the auto generated mutation called "usecreateFollowTypedData"
      // to get the typed data for the user to sign
      const typedData = await requestTypedData({
        request: {
          profileId: profileQuery.data?.defaultProfile?.id,
          publicationId: publication.id,
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
        },
      });

      console.log("test");

      const { domain, types, value } =
        typedData.createMirrorTypedData.typedData;

      if (!sdk) return;

      // 2. Sign the typed data using the SDK
      const signature = await signTypedDataWithOmmittedTypename(
        sdk,
        domain,
        types,
        value
      );

      const { v, r, s } = splitSignature(signature.signature);

      //  3. Send the typed data to the smart contract to perform the
      // write operation on the blockchain
      const lensHubContract = await sdk.getContractFromAbi(
        LENS_CONTRACT_ADDRESS,
        LENS_CONTRACT_ABI
      );

      console.log(value);

      // Call the smart contract function called "followWithSig"
      const result = await lensHubContract.call("mirrorWithSig", {
        profileId: value.profileId,
        profileIdPointed: value.profileIdPointed,
        pubIdPointed: value.pubIdPointed,
        referenceModuleData: value.referenceModuleData,
        referenceModule: value.referenceModule,
        referenceModuleInitData: value.referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: value.deadline,
        },
      });

      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }

  return useMutation(mirror);
}
