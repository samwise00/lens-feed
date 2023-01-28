import { useMutation } from "@tanstack/react-query";
import {
  PublicationMainFocus,
  useCreateCommentTypedDataMutation,
} from "../graphql/generated";
import useLensUser from "./auth/useLensUser";
import { signTypedDataWithOmmittedTypename, splitSignature } from "./helpers";
import { useSDK, useStorageUpload } from "@thirdweb-dev/react";
import { v4 as uuidv4 } from "uuid";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../const/contracts";
import useLogin from "./auth/useLogin";

type CommentArgs = {
  content: string;
  publicationId: any;
};

export default function useComment() {
  const { mutateAsync: requestTypedData } = useCreateCommentTypedDataMutation();
  const { mutateAsync: uploadToIpfs } = useStorageUpload();
  const { profileQuery } = useLensUser();
  const sdk = useSDK();
  const { mutateAsync: loginUser } = useLogin();

  async function comment({ content, publicationId }: CommentArgs) {
    // 00.
    await loginUser();

    // 0B. Upload the actual content to IPFS
    // This is going to be an Object which contains the image field as well
    const postMetadata = {
      version: "2.0.0",
      mainContentFocus: PublicationMainFocus.TextOnly,
      metadata_id: uuidv4(),
      description: "Description",
      locale: "en-US",
      content: content,
      external_url: null,
      image: null,
      imageMimeType: null,
      name: "Comment",
      attributes: [],
      tags: ["lens_comment"],
    };

    const postMetadataIpfsUrl = (
      await uploadToIpfs({ data: [postMetadata] })
    )[0];

    console.log("postMetadataIpfsUrl", postMetadataIpfsUrl);

    // 1. Ask lens to give us the typed data
    const typedData = await requestTypedData({
      request: {
        profileId: profileQuery.data?.defaultProfile?.id,
        publicationId: publicationId,
        contentURI: postMetadataIpfsUrl,
        collectModule: {
          freeCollectModule: {
            followerOnly: false,
          },
        },
        referenceModule: {
          followerOnlyReferenceModule: false,
        },
      },
    });

    const { domain, types, value } = typedData.createCommentTypedData.typedData;

    if (!sdk) return;

    // 2. Sign the typed data
    const signature = await signTypedDataWithOmmittedTypename(
      sdk,
      domain,
      types,
      value
    );

    const { v, r, s } = splitSignature(signature.signature);

    // 3. Use the signed typed data to send the tx top the smart contract
    // => Upload some media to IPFS beforehand and use that in the request
    const lensHubContract = await sdk.getContractFromAbi(
      LENS_CONTRACT_ADDRESS,
      LENS_CONTRACT_ABI
    );

    const result = await lensHubContract.call(
      "commentWithSig",
      {
        profileId: value.profileId,
        contentURI: value.contentURI,
        profileIdPointed: value.profileIdPointed,
        pubIdPointed: value.pubIdPointed,
        collectModule: value.collectModule,
        collectModuleInitData: value.collectModuleInitData,
        referenceModule: value.referenceModule,
        referenceModuleInitData: value.referenceModuleInitData,
        referenceModuleData: value.referenceModuleData,
        sig: {
          v,
          r,
          s,
          deadline: value.deadline,
        },
      },
      { gasLimit: 500000 }
    );

    console.log(result);
  }

  return useMutation(comment);
}
