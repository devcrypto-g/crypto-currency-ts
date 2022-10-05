const Footer = () => {
  return (
    <div className="footer">
      <div style={{ margin: "10px" }}>
        <span className="eng" style={{ color: "#1DA2B4" }}>
          kough.kr
        </span>
      </div>
      <div style={{ height: "70%", width: 1, background: "#e9e9e9" }}></div>
      <div style={{ margin: "10px", fontSize: "0.7944rem" }}>
        <p>
          코프(kough.kr)는 사이트 내 모든 암호화폐 가격 및 투자 관련 정보에
          <br />
          대하여 어떠한 책임을 부담하지 않습니다.
          <br />
          디지털 자산 투자는 전적으로 스스로의 책임이므로 이에 유의하시기
          바랍니다.
        </p>
      </div>
    </div>
  );
};

export default Footer;
