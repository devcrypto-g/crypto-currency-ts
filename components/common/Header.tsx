import { useRouter } from "next/router";

const menu = [
  { title: "홈", path: "/" },
  { title: "공지사항", path: "/notice" },
  { title: "통계/지표", path: "/statistics" },
  { title: "뉴스", path: "/news" },
];

const Header = () => {
  const router = useRouter();

  const handleChangePath = (path: string) => {
    if (router.pathname === path) {
      return;
    } else {
      router.push(path);
    }
  };

  return (
    <div
      className="header"
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <span className="eng" style={{ margin: "10px" }} onClick={() => handleChangePath("/")}>
        kough.kr
      </span>
      <div className="menu">
        <ul>
          {menu.map((item) => {
            return (
              <li onClick={() => handleChangePath(item.path)}>
                <span style={{ marginBottom: "3px" }}>{item?.title || ""}</span>
                <div
                  style={{
                    background:
                      router.pathname === item.path ? "#1DA2B4" : "#fff",
                    width: "100%",
                    height: "2px",
                    position: "absolute",
                    bottom: 0,
                    borderTopLeftRadius: "5px",
                    borderTopRightRadius: "5px",
                    transition: "all ease-in-out .3s",
                  }}
                />
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default Header;
