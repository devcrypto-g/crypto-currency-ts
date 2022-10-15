import { useCallback, useEffect, useRef, useState } from "react";
import GridTable from "./GridTable";
import { symbol } from "../../../lib/constants";
import { faList, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "./Table";
import useSockets from "../../../lib/hooks/useSockets";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { setTitle } from "../../../store/reducer/title";
import { numberWithCommas } from "../../../lib/utils";
import { cloneDeep } from "lodash";
import Head from "next/head";

const upbitSocketUrl = "wss://api.upbit.com/websocket/v1";
let binaceSocketUrl = "";

const MainLayout = () => {
  const [type, setType] = useState<number>(0);
  const firstRender = useRef(false);
  const secondRender = useRef(false);
  //업비트
  const { ws, dataRef, onSetMessage, onSetUrl } = useSockets();
  //바이낸스
  const { ws: bs, dataRef: bdataRef, onSetUrl: onbSetUrl } = useSockets();
  const [priceData, setPriceData] = useState([]);
  const [selected, setSelected] = useState<any>("");
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
      .map((item: any) => {
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
    const parseTitle = `${
      item.kcr?.toFixed(2) || "waiting..."
    }% - ${numberWithCommas(item.tp)} ${item.cd}`;
    dispatch(setTitle(parseTitle));
  }, []);

  return (
    <>
      <Head>
        <title>{title}</title>
      </Head>
      <div className="data-table">
        <div
          style={{
            width: "100%",
            height: "50px",
            background: "#fff",
            boxSizing: "border-box",
            marginBottom: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
            padding: "5px",
          }}
        >
          <div
            style={{
              height: "30px",
              width: "20%",
              background: "#ededed",
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              borderRadius: "5px",
              padding: "5px",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", marginRight: "10px"}}>
              
            </div>
            <div
              style={{
                width: "50px",
                height: "100%",
                borderRadius: "5px",
                background: type === 0 ? "#fff" : "#ededed",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "3px",
                transition: "all ease-in-out .5s",
              }}
              onClick={() => {
                if (type === 0) {
                  return;
                } else {
                  setType(0);
                }
              }}
            >
              <FontAwesomeIcon
                icon={faTableCellsLarge}
                style={{ width: "50%", height: "50%", color: "#666" }}
              />
            </div>

            <div
              style={{
                width: "50px",
                height: "100%",
                borderRadius: "5px",
                background: type === 1 ? "#fff" : "#ededed",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                margin: "3px",
                transition: "all ease-in-out .5s",
              }}
              onClick={() => {
                if (type === 1) {
                  return;
                } else {
                  setType(1);
                }
              }}
            >
              <FontAwesomeIcon
                icon={faList}
                style={{ width: "50%", height: "50%", color: "#666" }}
              />
            </div>
          </div>
        </div>
        {type === 0 ? (
          <GridTable
            priceData={priceData}
            selected={selected}
            setSelected={setSelected}
          />
        ) : (
          <Table
            priceData={priceData}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </div>
    </>
  );
};

export default MainLayout;
