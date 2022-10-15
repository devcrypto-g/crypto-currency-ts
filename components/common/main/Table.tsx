import { cloneDeep } from "lodash";
import { useCallback, useEffect, useRef, useState } from "react";
import { symbol } from "../../../lib/constants";
import useSockets from "../../../lib/hooks/useSockets";
import { numberWithCommas } from "../../../lib/utils";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import Image from "next/image";
import { setTitle } from "../../../store/reducer/title";
import { useDispatch } from "react-redux";

const Table = (props: any) => {
  const { priceData, selected, setSelected } = props;
  const dispatch = useDispatch();

  const handleChangeTitle = useCallback((item: any) => {
    const parseTitle = `${
      item.kcr?.toFixed(2) || "waiting..."
    }% - ${numberWithCommas(item.tp)} ${item.cd}`;
    dispatch(setTitle(parseTitle));
  }, []);

  return (
    <>
      <div>
        <table>
          <thead>
            <tr>
              <th className="left">코인</th>
              <th className="right">가격</th>
              <th className="right">프리미엄</th>
              <th className="right">전일대비</th>
              <th className="right">거래액(일)</th>
            </tr>
          </thead>
          <tbody>
            {priceData.map((item: any, index: any) => {
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
                      <div
                        style={{ display: "flex", alignItems: "flex-start" }}
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
                            priority
                          />
                        </span>
                        &nbsp;
                        <span>{item.name}</span>
                      </div>
                      <div
                        style={{ display: "flex", alignItems: "flex-start" }}
                      >
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
                    <ColorText ch={item.c} val={item.tp}>
                      {numberWithCommas(item.tp)}
                    </ColorText>
                    <br />
                    <span style={{ color: "#666" }}>
                      {(+item.kimpPrice)?.toFixed(0) !== "NaN" &&
                        numberWithCommas((+item.kimpPrice)?.toFixed(0) || "")}
                    </span>
                  </td>
                  <td className="right">
                    <span
                      style={{
                        color:
                          item.kcr > 0
                            ? "#ec4c6a"
                            : item.kcr < 0
                            ? "#4b89ff"
                            : "#666",
                      }}
                    >
                      {item.kcr > 0 && item.kcr && "+"}
                      {item.kcr ? `${item?.kcr?.toFixed(2)}%` : ""}
                      <br />
                      <span style={{ color: "#666" }}>
                        {item.tp - item.kimpPrice > 0 && item.kimpPrice && "+"}
                        {numberWithCommas(
                          +(item.tp - item.kimpPrice)?.toFixed(4) || ""
                        ) || ""}
                      </span>
                    </span>
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
    </>
  );
};

export default Table;

const ColorText = (props: any) => {
  const { children, ch, val } = props;
  const renderRef = useRef(false);
  const [check, setCheck] = useState(false);

  useEffect(() => {
    if (!renderRef.current) {
      renderRef.current = true;
    }
    {
      setCheck(true);
      setTimeout(() => {
        setCheck(false);
      }, 2000);
    }
  }, [val]);

  return (
    <span
      className={
        check && ch === "RISE"
          ? "alerts-border-rise"
          : check && ch === "FALL"
          ? "alerts-border-fall"
          : "alerts-border-none"
      }
      // className={
      //   ch === "RISE"
      //     ? "alerts-border-rise"
      //     : ch === "FALL"
      //     ? "alerts-border-fall"
      //     : ""
      // }
    >
      {children}
    </span>
  );
};
