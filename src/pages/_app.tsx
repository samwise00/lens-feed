import type { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThirdwebProvider, ChainId } from "@thirdweb-dev/react";
import Header from "../components/Header";

import { ThemeProvider } from "next-themes";
import { ChakraProvider } from "@chakra-ui/react";

import "../../styles/globals.css";
import styles from "@/styles/styles";

export default function App({ Component, pageProps }: AppProps) {
  // the chainId our app wants to be running on
  // for our example the Polygon Mumbai Testnet
  const desiredChainId = ChainId.Polygon;

  // Create a client
  const queryClient = new QueryClient();

  return (
    <ThemeProvider enableSystem={true} attribute="class">
      <ThirdwebProvider desiredChainId={desiredChainId}>
        <ChakraProvider>
          <QueryClientProvider client={queryClient}>
            <Header />
            <Component {...pageProps} />
          </QueryClientProvider>
        </ChakraProvider>
      </ThirdwebProvider>
    </ThemeProvider>
  );
}
