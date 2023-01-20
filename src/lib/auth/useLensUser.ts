import { useQuery } from "@tanstack/react-query";
import { useAddress } from "@thirdweb-dev/react";
import { readAccessToken } from "./helpers";
import { useDefaultProfileQuery } from "@/src/graphql/generated";
import { profile } from "console";

export default function useLensUser() {
  // 1. Make a react query for the local storage key
  const address = useAddress();

  const localStorageQuery = useQuery(
    ["lens-user", address],
    // Writing the actual function to check the local storage for authenticaiton information
    () => readAccessToken()
  );

  // If there is a connected wallet
  // we can ask for the default profile from lense
  const profileQuery = useDefaultProfileQuery(
    {
      request: {
        ethereumAddress: address,
      },
    },
    {
      enabled: !!address,
    }
  );

  console.log(profileQuery.data?.defaultProfile);
  return {
    // Contains information about both the local storage
    // and the information about the lens profile
    isSignedInQuery: localStorageQuery,
    profileQuery: profileQuery,
  };
}
