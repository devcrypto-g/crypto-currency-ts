import * as APIS from "../lib/apis";
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getPrice } from "../store/reducer/price";
import { numberWithCommas } from "../lib/utils";

const TopStatistics = () => {
  const dispatch = useDispatch();
  const { data: price } = useSelector((state: any) => state.price);

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetchData();
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const fetchData = () => {
    APIS.getData().then((res) => {
      try {
        const { data } = res;
        dispatch(getPrice(data));
      } catch (err) {
        console.log("get data err");
      }
    });
  };

  return (
    <div className="top-statistics">
      <div className="item">
        <span>USD/KRW</span>
        <span>{numberWithCommas(+price?.usd?.replace(",", "")) || "0.00"}</span>
        <span>{price?.cr || "0.00%"}</span>
      </div>
      <div className="item">
        <span>BTC.D</span>
        <span>{`${price?.domi?.[0]}%` || "0.00%"}</span>
      </div>
      <div className="item">
        <span>ETH.D</span>
        <span>{`${price?.domi?.[1]}%` || "0.00%"}</span>
      </div>
      <div className="item">
        <span>전체시가총액</span>
        <span>1,392조 8,8894억</span>
        <span>+0.54%</span>
      </div>
    </div>
  );
};

export default TopStatistics;
