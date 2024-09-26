import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";  //! provider demek : bir componentin altındaki tüm componentlere store'u geçirir.
import { store } from "@/store"; //! store demek : redux store'u demektir. yani tüm state'lerin tutulduğu yer.
import { AuthProvider } from "@/context/auth-context"; //! AuthProvider demek : bir context provider'ıdır. yani bir componentin altındaki tüm componentlere context'i geçirir.

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <AuthProvider>
                <Component {...pageProps} />
            </AuthProvider>
        </Provider>
    )
}