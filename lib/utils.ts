export function numberWithCommas(x:string | number) {
  if (x) {
    let onlyNumber = x.toString().replace(/,/gi, "");
    let parts = onlyNumber.toString().split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");

    return parts.join(".");
  } else if (x === "") {
    return "";
  } else {
    return "0";
  }
}