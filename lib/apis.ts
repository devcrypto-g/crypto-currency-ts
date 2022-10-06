import axios from "axios";

export const getData = () => {
  return axios.get("https://api.kimpjonber.kr/price");
};
