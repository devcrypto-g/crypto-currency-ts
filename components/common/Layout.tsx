import TopStatistics from "../TopStatistics";
import Content from "./Content";
import Footer from "./Footer";
import Header from "./Header";

type LayoutProps = {
  children: JSX.Element;
};

const Layout = (props: LayoutProps) => {
  const { children } = props;
  return (
    <div className="layout">
      <TopStatistics />
      <Header />
      <Content>{children ? children : <></>}</Content>
      <Footer />
    </div>
  );
};

export default Layout;
