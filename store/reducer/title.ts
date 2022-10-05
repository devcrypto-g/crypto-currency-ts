const TITLE = "set/TITLE";

export const setTitle = (payload: any) => {
  return { type: TITLE, payload: payload };
};

const initialState = {
  title: "kough.kr - 김치 프리미엄",
};

const title = (state = initialState, action: any) => {
  switch (action.type) {
    case TITLE:
      return { title: action.payload };
    default:
      return state;
  }
};

export default title;