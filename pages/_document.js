import Document, { Html, Head, Main, NextScript } from 'next/document'

export default class MyDocument extends Document {
    render() {
        return (
            <Html className="bg-gray-900" lang="en">
                <Head></Head>
                <body>
                    <Main />
                    <NextScript />
                </body>
            </Html>
        )
    }
}