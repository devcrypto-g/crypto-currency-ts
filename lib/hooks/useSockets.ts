import { cloneDeep } from "lodash";
import { useEffect, useState, useCallback, useRef } from "react";
import { symbol } from "../constants";

const useDidMountEffect = (func: any, deps: any) => {
  const didMount = useRef(false);

  useEffect(() => {
    if (didMount.current) func();
    else didMount.current = true;
  }, deps);
};

/*
  # useSocket은 웹 소켓을 생성 메세지 전달, 받은 메시지를 return해주는 역활만 한다.
  # 실질적이 데이터 가공은 호출한 해당 컴포넌트에서 함
  ex) useSocket을 호춣한 A라는 컴포넌트에서 
  useEffect(() => {
    ...데이터 가공 함수 사용
  },[data])
*/
const useSockets = () => {
  let ws: any = useRef(null);
  const urlRef = useRef("");
  const urlRender = useRef(false);
  const dataRef = useRef([]);
  const messageRef = useRef<string | object>("");
  const [socket, setSocket] = useState({});
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState<string | object>("");
  const [data, setData] = useState([]);
  // url생성 될 때 여기서 소켓 생성
  useEffect(() => {
    if (!urlRender.current) {
      urlRender.current = true;
    } else {
      createSocket();
    }
  }, [url]);

  useEffect(() => {
    return () => closeSocket();
  }, []);

  const onSetUrl = useCallback((wsUrl: string) => {
    urlRef.current = wsUrl;
    setUrl(urlRef.current);
  }, []);

  const onSetMessage = useCallback((wsMessage: string | object) => {
    messageRef.current = wsMessage;
    setMessage(messageRef.current);
  }, []);

  // 소켓 생성
  const createSocket = useCallback(() => {
    ws.current = new WebSocket(urlRef.current);
    ws.current.binaryType = "arraybuffer";
    setSocket(ws.current);
  }, []);

  // 소켓 닫기
  const closeSocket = () => {
    ws.current.close();
  };

  useDidMountEffect(() => {
    ws.current.onopen = () => {
      if (messageRef.current) {
       // ws.current.send(JSON.stringify(messageRef.current));
      }
    };

    ws.current.onmessage = (e: any) => {
      const enc = new TextDecoder("utf-8");
      const arr = new Uint8Array(e.data);
      const str_d = enc.decode(arr);
      const d = JSON.parse(str_d);
      const name = symbol.find((item) => item.market === d.cd)?.korean_name || "-";
      const index = dataRef.current.findIndex((item: any) => item.cd === d.cd);
      let copyData: any = cloneDeep(dataRef.current);
      if (index > -1) {
        copyData[index] = {
          ...copyData[index],
          ...d,
        };
        dataRef.current = copyData;
        setData(dataRef.current);
      } else {
        dataRef.current = dataRef.current.concat({
          ...d,
          name: name
        });
        setData(dataRef.current);
      }

      // setData(e);
      // 여기서 res로 받은 데이터를 setData 후 => return data를 전달
    };
  }, [ws.current]);

  return { ws, dataRef, onSetMessage, onSetUrl };
};

export default useSockets;
