import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { Provider } from "react-redux";  //! provider demek : bir componentin altındaki tüm componentlere store'u geçirir.
import { store } from "@/store"; //! store demek : redux store'u demektir. yani tüm state'lerin tutulduğu yer.
import { AuthProvider } from './../../src/context/auth-context';
 //! AuthProvider demek : bir context provider'ıdır. yani bir componentin altındaki tüm componentlere context'i geçirir.

export default function App({ Component, pageProps }: AppProps) {
    return (
        <Provider store={store}>
            <AuthProvider>  //!Bu bileşen, uygulamanın her yerinde kimlik doğrulama durumunu yönetmek için kullanılır
                            //!AuthProvider bileşeni, çocuk bileşenlerine kimlik doğrulama bilgilerini sağlar.
                <Component {...pageProps} />
            </AuthProvider>
        </Provider>
    )
}

//! Bu yapı, uygulamanın her sayfasında ortak olan sağlayıcıları ve 
//!yapılandırmaları merkezi bir yerden yönetmeyi sağlar.
//! Bu sayede, Redux store ve kimlik doğrulama gibi özellikler 
//!tüm uygulama genelinde kolayca kullanılabilir hale gelir.