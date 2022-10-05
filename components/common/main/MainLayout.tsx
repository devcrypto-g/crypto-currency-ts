import { useState } from "react";
import GridTable from "./GridTable";
import { faList, faTableCellsLarge } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "./Table";

const MainLayout = () => {
  const [type, setType] = useState<number>(0);
  return (
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
            width: "100px",
            background: "#ededed",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: "5px",
            padding: "5px",
          }}
        >
          <div
            style={{
              width: "45%",
              height: "100%",
              borderRadius: "5px",
              background: type === 0 ? "#fff" : "#ededed",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "3px",
              transition: "all ease-in-out .3s",
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
              width: "45%",
              height: "100%",
              borderRadius: "5px",
              background: type === 1 ? "#fff" : "#ededed",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              margin: "3px",
              transition: "all ease-in-out .3s",
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
      {type === 0 ? <GridTable /> : <Table />}
    </div>
  );
};

export default MainLayout;
