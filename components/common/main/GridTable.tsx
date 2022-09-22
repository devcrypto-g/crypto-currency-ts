import useSocket from "../../../lib/hooks/useSocket";

const upbitSocketUrl = "wss://api.upbit.com/websocket/v1";

const GridTable = () => {
  // 업비트 소켓
  // const [fetchMessage, clearSocket, webScoket, resData] = useSocket({
  //   url: upbitSocketUrl,
  // });
  return (
    <div className="grid-table">
      {Array.from({ length: 100 }).map((item) => {
        return <div className="skeleton-list-item item"></div>;
      })}
    </div>
  );
};

export default GridTable;
