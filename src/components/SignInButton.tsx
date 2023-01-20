import React from "react";
import {
  useAddress,
  useNetworkMismatch,
  useNetwork,
  ConnectWallet,
  ChainId,
} from "@thirdweb-dev/react";
import useLensUser from "../lib/auth/useLensUser";
import useLogin from "../lib/auth/useLogin";

type Props = {};

export default function SignInButton({}: Props) {
  const address = useAddress(); // Detect the connected address
  const isOnWrongNetwork = useNetworkMismatch(); // Detect if the user is on the wrong network
  const [, switchNetwork] = useNetwork(); // Fx to switch the network
  const { isSignedInQuery, profileQuery } = useLensUser();
  const { mutate: requestLogin } = useLogin();

  // 1. User needs to Connect wallet
  if (!address) {
    return <ConnectWallet />;
  }

  // 2. Use needs to switch network to Polygon
  if (isOnWrongNetwork) {
    return (
      <button onClick={() => switchNetwork?.(ChainId.Polygon)}>
        Switch Network
      </button>
    );
  }

  // Loading signed-in state
  if (isSignedInQuery.isLoading) {
    return <div>Loading...</div>;
  }

  // If the user is not signed in, we need to request a login
  if (!isSignedInQuery.data) {
    return <button onClick={() => requestLogin()}>Sign in with Lens</button>;
  }

  // Loading their profile information
  if (profileQuery.isLoading) {
    return <div>Loading...</div>;
  }

  // If it's done loading and there's no default profile
  if (!profileQuery.data?.defaultProfile) {
    return <div>No Lens Profile.</div>;
  }

  if (profileQuery.data?.defaultProfile) {
    return <div>Hello {profileQuery.data?.defaultProfile?.handle}</div>;
  }

  return <div>Something went wrong.</div>;
}
