import { fetcher } from "@/src/graphql/auth-fetcher";
import {
  ChallengeQuery,
  ChallengeQueryVariables,
  ChallengeDocument,
} from "../../graphql/generated";

export default async function generateChallenge(address: string) {
  return await fetcher<ChallengeQuery, ChallengeQueryVariables>(
    ChallengeDocument,
    {
      request: {
        address,
      },
    }
  )();
}
