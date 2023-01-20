import { useAddress, useSDK } from "@thirdweb-dev/react";
import generateChallenge from "./generateChallenge";
import { useAuthenticateMutation } from "@/src/graphql/generated";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { setAccessToken } from "./helpers";

// 1. Write the async fx
export default function useLogin() {
  const address = useAddress();
  const sdk = useSDK();

  const { mutateAsync: sendSignedMessage } = useAuthenticateMutation();
  const client = useQueryClient();

  // 1. Generate Challenge which comes from Lens Api
  async function login() {
    if (!address) return;
    const { challenge } = await generateChallenge(address);

    // 2. Sign the challenge with the user's wallet
    const signature = await sdk?.wallet.sign(challenge.text);

    // 3. Send the signed challenge to the Lens API
    const { authenticate } = await sendSignedMessage({
      request: {
        address,
        signature,
      },
    });

    console.log("Authenticated", authenticate);

    // 4. Receive an access token from the Lens API if we succeed
    // 5. Store the access token inside local storage so we can use it
    const { accessToken, refreshToken } = authenticate;

    setAccessToken(accessToken, refreshToken);

    // Now let's ask react query to refetch the cache key
    client.invalidateQueries(["lens-user", address]);
  }

  // 2. Return the useMutation hook wrapping the async fx
  return useMutation(login);
}
