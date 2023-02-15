import { useMutation } from "@tanstack/react-query";
import {
  PublicationMainFocus,
  useCreatePostTypedDataMutation,
} from "../graphql/generated";
import useLensUser from "./auth/useLensUser";
import { signTypedDataWithOmmittedTypename, splitSignature } from "./helpers";
import { useSDK, useStorageUpload } from "@thirdweb-dev/react";
import { v4 as uuidv4 } from "uuid";
import { LENS_CONTRACT_ABI, LENS_CONTRACT_ADDRESS } from "../const/contracts";
import useLogin from "./auth/useLogin";

type CreatePostArgs = {
  image?: File;
  title?: string;
  description?: string;
  content: string;
};

export default function useCreatePost() {
  const { mutateAsync: requestTypedData } = useCreatePostTypedDataMutation();
  const { mutateAsync: uploadToIpfs } = useStorageUpload();
  const { profileQuery } = useLensUser();
  const sdk = useSDK();
  const { mutateAsync: loginUser } = useLogin();

  async function createPost({
    image,
    title,
    description,
    content,
  }: CreatePostArgs) {
    try {
      // 00.
      await loginUser();

      // 0. Upload the image to IPFS
      let imageIpfsUrl;
      if (image) {
        imageIpfsUrl = (await uploadToIpfs({ data: [image] }))[0];
      }

      console.log(imageIpfsUrl);

      // 0B. Upload the actual content to IPFS
      // This is going to be an Object which contains the image field as well
      const postMetadata = {
        version: "2.0.0",
        mainContentFocus: PublicationMainFocus.TextOnly,
        metadata_id: uuidv4(),
        description: description || "Lens Post",
        locale: "en-US",
        content: content,
        external_url: null,
        image: imageIpfsUrl || null,
        imageMimeType: null,
        name: title || "Lens Post",
        attributes: [],
        tags: ["lens_post"],
      };

      const postMetadataIpfsUrl = (
        await uploadToIpfs({ data: [postMetadata] })
      )[0];

      console.log("postMetadataIpfsUrl", postMetadataIpfsUrl);

      // 1. Ask lens to give us the typed data
      const typedData = await requestTypedData({
        request: {
          collectModule: {
            freeCollectModule: {
              followerOnly: false,
            },
          },
          referenceModule: {
            followerOnlyReferenceModule: false,
          },
          contentURI: postMetadataIpfsUrl,
          profileId: profileQuery.data?.defaultProfile?.id,
        },
      });

      const { domain, types, value } = typedData.createPostTypedData.typedData;

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

      const {
        collectModule,
        collectModuleInitData,
        contentURI,
        deadline,
        profileId,
        referenceModule,
        referenceModuleInitData,
      } = typedData.createPostTypedData.typedData.value;

      const result = await lensHubContract.call("postWithSig", {
        profileId: profileId,
        contentURI: contentURI,
        collectModule,
        collectModuleInitData,
        referenceModule,
        referenceModuleInitData,
        sig: {
          v,
          r,
          s,
          deadline: deadline,
        },
      });

      console.log(result);
    } catch (e) {
      console.log(e);
    }
  }

  return useMutation(createPost);
}
