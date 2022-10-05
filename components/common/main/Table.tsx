import { cloneDeep } from "lodash";
import { useEffect, useRef, useState } from "react";
import { symbol } from "../../../lib/constants";
import useSockets from "../../../lib/hooks/useSockets";
import { numberWithCommas } from "../../../lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { useDispatch } from "react-redux";
import { setTitle } from "../../../store/reducer/title";

const upbitSocketUrl = "wss://api.upbit.com/websocket/v1";

const Table = () => {
  const firstRender = useRef(false);
  const secondRender = useRef(false);
  const { ws, dataRef, onSetMessage, onSetUrl } = useSockets();
  const [priceData, setPriceData] = useState([]);
  const [selected, setSelected] = useState<any>("");
  //const [expanded, setExpanded] = useState(true);
  const dispatch = useDispatch();
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

  const handleChangeTitle = (item: any) => {
    const parseTitle = `${(item.cr * 100).toFixed(2)}% - ${numberWithCommas(
      item.tp
    )} ${item.cd}`;
    dispatch(setTitle(parseTitle));
  };

  return (
    <div>
      <table>
        <thead>
          <th className="left">코인</th>
          <th className="right">가격</th>
          <th className="right">프리미엄</th>
          <th className="right">전일대비</th>
          <th className="right">거래액(일)</th>
        </thead>
        <tbody>
          {priceData.map((item: any, index) => {
            const sign =
              item?.c === "RISE" ? "+" : item.c === "FALL" ? "-" : " ";
            return (
              <tr
                key={`${item.cd}-${index}`}
                onClick={() => {
                  if (selected.cd === item.cd) {
                    return;
                  } else {
                    handleChangeTitle(item);
                    setSelected(item);
                  }
                }}
              >
                <td style={{ textAlign: "left" }}>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "flex-start",
                      justifyContent: "center",
                    }}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <span>
                        <Image
                          src={`https://static.upbit.com/logos/${item.cd.replace(
                            "KRW-",
                            ""
                          )}.png`}
                          width="16"
                          height="16"
                          alt="-"
                          priority
                        />
                      </span>
                      &nbsp;
                      <span>{item.name}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "flex-start" }}>
                      <span>
                        <FontAwesomeIcon
                          icon={faStar}
                          style={{ width: "16px", height: "16px" }}
                          color={"#FFD400"}
                        />
                      </span>
                      &nbsp;
                      <span>{item.cd.replace("KRW-", "")}</span>
                    </div>
                  </div>
                </td>
                <td
                  className="right"
                  style={{
                    color:
                      item.c === "RISE"
                        ? "#ec4c6a"
                        : item.c === "FALL"
                        ? "#4b89ff"
                        : "#666",
                  }}
                >
                  {numberWithCommas(item.tp)}
                </td>
                <td className="right">1.2%</td>
                <td
                  className="right"
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
                  {(item.cr * 100).toFixed(2)}%
                </td>
                <td className="right">
                  <span>
                    {/* {parseNum(item?.acc_trade_price_24h || 0)} */}
                    {numberWithCommas((item.atp24h / 1000000)?.toFixed(0))}
                    백만
                  </span>
                  <br />
                  <span>
                    {/* {parseNum(item?.acc_trade_price || 0)} */}
                    {numberWithCommas((item.atp / 1000000)?.toFixed(0))}백만
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
