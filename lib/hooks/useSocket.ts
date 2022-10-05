import { cloneDeep } from "lodash";
import { useEffect, useState, useRef } from "react";
import { symbol } from "../constants";

type UseSocketType = {
  url: string;
  type: string;
};

const useSocket = () => {
  let ws: any = useRef();
  const [data, setData] = useState([]);


  const fetchMessage = (props: any) => {
    (":::::::::::::::::;");
    const { payload = {}, fn, url } = props;
    // if (ws?.current || type === "direct") {
    //   if (payload) {
    //     if (type === "direct") {
    //       //console.log(payload, "::::::::::::;");
    //       ws.current = new WebSocket(payload);
    //     } else {
    createSocket(url);
    ws.current.send(JSON.stringify(payload));
    //   }
    // }

    ws.current.onmessage = (e: any) => {
      const parseSymbol = symbol.filter((item) => item.market.includes("KRW"));
      if (fn) {
        let copyData = fn(e);
        let arrData: any = cloneDeep(data);
        const name =
          parseSymbol.find((item) => item.market === copyData.cd)
            ?.korean_name || "-";
        const index = arrData.findIndex((item: any) => item.cd === copyData.cd);
        if (index > -1) {
          arrData[index] = {
            ...arrData[index],
            ...copyData,
          };

          setData(arrData);
        } else {
          arrData = arrData.concat({
            ...copyData,
          });
          setData(arrData);
        }
        setData(copyData);
      } else {
        let copyData = cloneDeep(data);

        copyData = copyData.concat(e);
        setData(copyData);
      }
    };
  };

  const createSocket = (url: string) => {
    ws.current = new WebSocket(url);
    ws.current.binaryType = "arrayBuffer";
  };

  const clearSocket = () => {
    if (ws?.current) {
      console.log("close?");
      ws.current.close();
    } else {
      console.log("webSocket is not open.....");
    }
  };

  return [fetchMessage, clearSocket, ws.current, data];
};

export default useSocket;
