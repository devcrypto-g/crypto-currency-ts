type ContentProp = {
  children: JSX.Element;
};

const Content = (props: ContentProp) => {
  const { children } = props;
  return <div className="content">{children}</div>;
};

export default Content;
