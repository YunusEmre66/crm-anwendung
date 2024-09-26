import { Html, Head, Main, NextScript } from 'next/document'



export default function Document() {
    return (
        <Html lang="en">
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    )
}

//! Bu kod parçası, Next.js uygulamasında özel bir HTML belgesi oluşturmak için kullanılan _document.tsx dosyasını göstermektedir. Bu dosya, sunucu tarafında render edilen HTML yapısını özelleştirmek için kullanılır ve genellikle tüm sayfalarda ortak olan meta
//!etiketler, scriptler veya stil dosyalarını eklemek için kullanılır.