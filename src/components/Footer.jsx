function Footer() {
  return (
    <footer className="fco-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">FCO</div>
          <div>
            <h3>FCO FoodFast Delivery</h3>
            <p>Ăn ngon chuẩn vị - giao tận nhà chỉ trong 15 phút.</p>
          </div>
        </div>

        <div className="footer-columns">
          <div>
            <h4>Dịch vụ</h4>
            <a href="#menu">Thực đơn</a>
            <a href="#combo">Combo</a>
            <a href="#promo">Khuyến mãi</a>
          </div>
          <div>
            <h4>FCO Rewards</h4>
            <a href="#">Tích điểm đổi quà</a>
            <a href="#">Ưu đãi đối tác</a>
            <a href="#">Chính sách giao hàng</a>
          </div>
          <div>
            <h4>Liên hệ</h4>
            <a href="tel:19001900">Hotline: 1900 1900</a>
            <a href="mailto:hello@fco.vn">Email: hello@fco.vn</a>
            <a href="#tracking">Theo dõi đơn hàng</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} FCO FoodFast Delivery. All rights reserved.</span>
        <div className="footer-social">
          <a href="#">Facebook</a>
          <a href="#">Instagram</a>
          <a href="#">TikTok</a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
