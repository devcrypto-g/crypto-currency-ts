import "../styles/index.css";
import type { AppProps } from "next/app";
import Layout from "../components/common/Layout";
import { wrapper } from "../store/index";
import Head from "next/head";

function MyApp({ Component, pageProps }: AppProps) {
  //const { title } = useSelector((state: any) => state.title);
  return (
    <>
      <Head>
        <title>kough.kr</title>
      </Head>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </>
  );
}

export default wrapper.withRedux(MyApp);
