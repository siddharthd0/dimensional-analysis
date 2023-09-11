import '@/styles/globals.css'
import { ChakraProvider, CSSReset, ColorModeProvider, useColorMode } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider>
      <ColorModeProvider options={{ useSystemColorMode: true }}>
        <Component {...pageProps} />
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default MyApp;
