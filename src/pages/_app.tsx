import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AppProps } from "next/app";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";

import "../../styles/index.css";
import Header from "../components/Header";

const desiredChainId = ChainId.Mumbai;

export default function App({ Component, pageProps }: AppProps) {
  // Create a client
  const queryClient = new QueryClient();
  return (
    <ThirdwebProvider desiredChainId={desiredChainId}>
      <QueryClientProvider client={queryClient}>
        <Header />
        <Component {...pageProps} />
      </QueryClientProvider>
    </ThirdwebProvider>
  );
}
