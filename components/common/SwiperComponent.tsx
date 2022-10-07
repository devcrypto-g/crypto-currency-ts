import { Swiper, SwiperSlide } from "swiper/react";
import SwiperCore, { Autoplay } from "swiper";
import "swiper/css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFire } from "@fortawesome/free-solid-svg-icons";

SwiperCore.use([Autoplay]);

const SwiperComponent = () => {
  return (
    <div style={{ marginBottom: "5px" }}>
      <Swiper
        spaceBetween={50}
        slidesPerView={1}
        loop={true}
        autoplay={{ delay: 3000 }}
        allowTouchMove={false}
      >
        <SwiperSlide>
          <span style={{ fontSize: "0.7944rem" }}>
            TIP : 최근 거래량이 많은 코인옆에는{" "}
            <FontAwesomeIcon icon={faFire} style={{ color: "#ffdc73" }} />가
            붙습니다.
          </span>
        </SwiperSlide>
        <SwiperSlide>Slide 2</SwiperSlide>
        <SwiperSlide>Slide 3</SwiperSlide>
        <SwiperSlide>Slide 4</SwiperSlide>
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
