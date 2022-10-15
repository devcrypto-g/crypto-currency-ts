import { useCallback, useState } from "react";
import { numberWithCommas } from "../../../lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../store/reducer/title";
import SwiperComponent from "../SwiperComponent";

const GridTable = (props: any) => {
  const { priceData, selected, setSelected } = props;
  const [expanded, setExpanded] = useState(false);
  const dispatch = useDispatch();

  const handleChangeTitle = useCallback((item: any) => {
    const parseTitle = `${
      item.kcr?.toFixed(2) || "waiting..."
    }% - ${numberWithCommas(item.tp)} ${item.cd}`;
    dispatch(setTitle(parseTitle));
  }, []);

  return (
    <>
      <div style={{ height: "100%", position: "relative" }}>
        <SwiperComponent />
        <div
          className="grid-table"
          style={{
            height: "auto",
            maxHeight: expanded ? "6000px" : "445px",
            transition: "0.7s cubic-bezier(0.6, 0.05, 0.28, 0.91)",
            overflow: "hidden",
          }}
        >
          {priceData?.length > 0
            ? priceData.map((item: any, index: any) => {
                const sign =
                  item?.c === "RISE" ? "+" : item.c === "FALL" ? "-" : " ";
                return (
                  <div
                    key={`${item.cd}-${index}`}
                    className="item"
                    style={{
                      display: "flex",
                      flexDirection: "row",
                      background: item.cd === selected.cd ? "#cff1ff" : "",
                      transition: "all ease-in-out .5s",
                    }}
                    onClick={() => {
                      if (selected.cd === item.cd) {
                        return;
                      } else {
                        handleChangeTitle(item);
                        setSelected(item);
                      }
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "30%",
                        height: "100%",
                      }}
                    >
                      <div
                        style={{
                          height: "50%",
                          width: "100%",
                          fontSize: "0.7333rem",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "3px",
                        }}
                      >
                        <span>
                          {/* <Image
                          src={`https://static.upbit.com/logos/${item.cd.replace(
                            "KRW-",
                            ""
                          )}.png`}
                          width="16"
                          height="16"
                          alt="-"
                          priority
                        /> */}
                        </span>
                        &nbsp;
                        <span className="over-text">{item.name}</span>
                      </div>
                      <div
                        style={{
                          height: "50%",
                          width: "50%",
                          fontSize: "0.7333rem",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "3px",
                        }}
                      >
                        <span>
                          {item?.cd?.replace("KRW-", "") || ""}&nbsp;{" "}
                        </span>
                        <span>
                          {item.hot && (
                            <FontAwesomeIcon
                              icon={faFire}
                              style={{ color: "#ffdc73", width: "12px" }}
                            />
                          )}
                        </span>
                      </div>
                    </div>
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        width: "70%",
                        height: "100%",
                        alignContent: "flex-end",
                      }}
                    >
                      <div
                        style={{
                          height: "50%",
                          width: "50%",
                          fontSize: "0.6722rem",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "3px",
                          textAlign: "right",
                        }}
                      >
                        <span>
                          {numberWithCommas(+item?.tp?.toFixed(4)) || ""} KRW
                        </span>
                      </div>
                      <div
                        style={{
                          height: "50%",
                          width: "50%",
                          fontSize: "0.6722rem",
                          display: "flex",
                          alignItems: "center",
                          paddingLeft: "3px",
                        }}
                      >
                        전일대비 :&nbsp;
                        <span
                          style={{
                            color:
                              item.c === "RISE"
                                ? "#ec4c6a"
                                : item.c === "FALL"
                                ? "#4b89ff"
                                : "#666",
                          }}
                        >
                          {sign}
                          {`${(item.cr * 100).toFixed(2)}%`}
                          {(item?.kcr && (
                            <span style={{ color: "#666" }}>
                              &nbsp;|&nbsp;김프 :&nbsp;
                              <span>
                                {item.kcr ? `${item?.kcr?.toFixed(2)}%` : ""}
                              </span>
                            </span>
                          )) ||
                            ""}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })
            : Array.from({ length: 100 }).map((_, index) => {
                return <div key={index} className="skeleton-list-item item" />;
              })}
        </div>
        <div
          style={{
            height: "30px",
            position: "relative",
            background: "#d8d8d2",
            borderBottomLeftRadius: "5px",
            borderBottomRightRadius: "5px",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          onClick={() => setExpanded(!expanded)}
        >
          <FontAwesomeIcon
            style={{ fontSize: "0.7333rem", height: "50%", color: "#fff" }}
            icon={expanded ? faArrowUp : faArrowDown}
          />
        </div>
      </div>
    </>
  );
};

export default GridTable;
