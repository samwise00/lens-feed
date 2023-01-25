import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import Header from "../components/Header";

import "../../styles/globals.css";

export default function App({ Component, pageProps }: AppProps) {
  // the chainId our app wants to be running on
  // for our example the Polygon Mumbai Testnet
  const desiredChainId = ChainId.Polygon;

  // Create a client
  const queryClient = new QueryClient();

  return (
    <div className="p-4">
      <ThirdwebProvider desiredChainId={desiredChainId}>
        <QueryClientProvider client={queryClient}>
          <Header />
          <Component {...pageProps} />
        </QueryClientProvider>
      </ThirdwebProvider>
    </div>
  );
}
