function Footer({ texts = {} }) {
  const year = new Date().getFullYear();
  const rightsText = (texts.rights ?? "© {year} FCO FoodFast Delivery. All rights reserved.").replace(
    "{year}",
    String(year)
  );

  return (
    <footer className="fco-footer">
      <div className="footer-content">
        <div className="footer-brand">
          <div className="footer-logo">FCO</div>
          <div>
            <h3>FCO FoodFast Delivery</h3>
            <p>{texts.description ?? "Ăn ngon chuẩn vị - giao tận nhà chỉ trong 15 phút."}</p>
          </div>
        </div>

        <div className="footer-columns">
          {(texts.columns ?? []).map((column) => (
            <div key={column.title}>
              <h4>{column.title}</h4>
              {(column.links ?? []).map((link) => (
                <a key={link.href + link.label} href={link.href}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="footer-bottom">
        <span>{rightsText}</span>
        <div className="footer-social">
          {(texts.social ?? []).map((item) => (
            <a key={item.href + item.label} href={item.href}>
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </footer>
  );
}

export default Footer;
