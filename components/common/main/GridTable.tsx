import { cloneDeep } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { symbol } from "../../../lib/constants";
import useSockets from "../../../lib/hooks/useSockets";
import { numberWithCommas } from "../../../lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFire,
  faArrowUp,
  faArrowDown,
} from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../store/reducer/title";
import Head from "next/head";
import { useSelector } from "react-redux";
import SwiperComponent from "../SwiperComponent";

const upbitSocketUrl = "wss://api.upbit.com/websocket/v1";
let binaceSocketUrl = "";

const GridTable = () => {
  const firstRender = useRef(false);
  const secondRender = useRef(false);
  //업비트
  const { ws, dataRef, onSetMessage, onSetUrl } = useSockets();
  //바이낸스
  const {
    ws: bs,
    dataRef: bdataRef,
    onSetMessage: onbSetMessage,
    onSetUrl: onbSetUrl,
  } = useSockets();
  const [priceData, setPriceData] = useState([]);
  const [selected, setSelected] = useState<any>("");
  const [expanded, setExpanded] = useState(true);
  const { title } = useSelector((state: any) => state.title);
  const { data: price } = useSelector((state: any) => state.price);
  const dispatch = useDispatch();

  useEffect(() => {
    // upbit
    onSetUrl(upbitSocketUrl);

    // binace
    let message = "";
    symbol.forEach((item: any) => {
      const key = item.market;
      const parseName = `${key
        .substring(key.lastIndexOf("-") + 1)
        .toLowerCase()}usdt@miniTicker/`;
      message += parseName;
    });
    message = message.substring(0, message.length - 1);
    binaceSocketUrl = `wss://stream.binance.com:9443/ws/${message}/usdt@miniTicker`;
    onbSetUrl(binaceSocketUrl);
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
      const index: any = dataRef.current.findIndex(
        (item: any) => item.cd === selected.cd
      );
      if (!selected) {
        setSelected(dataRef.current[0]);
      }

      if (index > -1) {
        const data: any = dataRef.current[index];
        handleChangeTitle(data);
      }

      if (bs.current) {
        const usd = +price?.usd?.replace(",", "") || 0;
        dataRef.current.forEach((item: any, index: any) => {
          bdataRef.current.forEach((el: any, _: any) => {
            //심볼
            const s = el?.s?.replace("USDT", "") || "";
            if (item.cd.replace("KRW-", "") === s) {
              const ktp = dataRef?.current?.[index]?.tp || 0;
              const kimpPrice: any =
                +el?.c * usd > 100
                  ? (+el?.c * usd).toFixed(0)
                  : (+el?.c * usd).toFixed(4) || 0;
              dataRef.current[index] = {
                ...dataRef.current[index],
                usdtPrice: +el?.c || 0,
                kimpPrice: kimpPrice,
                kcr: ((ktp - kimpPrice) * 100) / kimpPrice,
              };
            }
          });
        });
      }

      setPriceData(dataRef.current);
    }
  }, [dataRef?.current]);

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

  const handleChangeTitle = useCallback((item: any) => {
    const parseTitle = `${item.kcr?.toFixed(2) || "0.00"}% - ${numberWithCommas(
      item.tp
    )} ${item.cd}`;
    dispatch(setTitle(parseTitle));
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
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
          {priceData.length > 0
            ? priceData.map((item: any, index) => {
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
                          {item?.kcr && (
                            <>
                              &nbsp;|&nbsp;김프 :&nbsp;
                              <span>
                                {item.kcr ? `${item?.kcr?.toFixed(2)}%` : ""}
                              </span>
                            </>
                          )}
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
