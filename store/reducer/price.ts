const GETPRICE = "price/GET_PRICE";

export const getPrice = (payload: any) => {
  return { type: GETPRICE, payload: { ...payload } };
};

const initState = {
  data: {},
};

const price = (state = initState, action: any) => {
  switch (action.type) {
    case GETPRICE: {
      return { data: { ...action.payload } };
    }
    default:
      return state;
  }
};

export default price;
