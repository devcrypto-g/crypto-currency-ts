import { cloneDeep } from "lodash";
import { useEffect, useRef, useState } from "react";
import { symbol } from "../../../lib/constants";
//import useSocket from "../../../lib/hooks/useSocket";
import useSockets from "../../../lib/hooks/useSockets";
import { numberWithCommas } from "../../../lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";

const upbitSocketUrl = "wss://api.upbit.com/websocket/v1";

const GridTable = () => {
  const firstRender = useRef(false);
  const secondRender = useRef(false);
  const { ws, dataRef, onSetMessage, onSetUrl } = useSockets();
  const [priceData, setPriceData] = useState([]);
  const [selected, setSelected] = useState<any>("");
  const [expanded, setExpanded] = useState(true);
  // 업비트 소켓
  // const [fetchMessage, clearSocket, webScoket, resData] = useSocket();

  useEffect(() => {
    onSetUrl(upbitSocketUrl);
  }, []);

  useEffect(() => {
    if (!firstRender.current) {
      firstRender.current = true;
    } else {
      const message = onParseMessage();
      onSetMessage(message);
    }
  }, [ws.current]);

  useEffect(() => {
    if (!secondRender.current) {
      secondRender.current = true;
    } else {
      if (!selected) {
        setSelected(dataRef.current[0]);
      }
      setPriceData(dataRef.current);
    }
  }, [dataRef?.current]);

  //console.log(priceData, "data");
  console.log(selected, ":::::::::::");

  const onParseMessage = () => {
    const parseSymbol = cloneDeep(symbol);
    const parseList = parseSymbol
      .filter((el: any) => el.market.includes("KRW"))
      .map((item) => {
        return item.market;
      });

    const payload = [
      { ticket: "UNIQUE_TICKET" },
      {
        type: "ticker",
        codes: [...parseList],
      },
      { format: "SIMPLE" },
    ];

    return payload;
  };

  return (
    <div style={{ height: "100%", position: "relative" }}>
      <div
        className="grid-table"
        style={{
          height: "auto",
          maxHeight: expanded ? "6000px" : "280px",
          transition: "0.5s cubic-bezier(0.6, 0.05, 0.28, 0.91)",
          overflow: "hidden",
        }}
      >
        {priceData.length > 0
          ? priceData.map((item: any) => {
              const sign =
                item?.c === "RISE" ? "+" : item.c === "FALL" ? "-" : " ";
              return (
                <div
                  className="item"
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    background: item.cd === selected.cd ? "#cff1ff" : "",
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
                        <Image
                          src={`https://static.upbit.com/logos/${item.cd.replace(
                            "KRW-",
                            ""
                          )}.png`}
                          width="16"
                          height="16"
                          alt="-"
                        />
                      </span>
                      &nbsp;
                      <span className="over-text">
                        {item.name}
                      </span>
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
                      <span>{item.cd.replace("KRW-", "")}&nbsp; </span>
                      <span>
                        <FontAwesomeIcon
                          icon={faFire}
                          style={{ color: "#ffdc73", width: "12px" }}
                        />
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
                        fontSize: "0.7333rem",
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
                        fontSize: "0.7333rem",
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
                      </span>
                      &nbsp;|&nbsp;김프 :&nbsp;<span>1.2%</span>
                    </div>
                  </div>
                </div>
              );
            })
          : Array.from({ length: 100 }).map((item) => {
              return <div className="skeleton-list-item item" />;
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
  );
};

export default GridTable;
