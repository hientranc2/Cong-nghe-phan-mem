const items = [
  { id: 1, name: "Burger", price: 50, img: "https://picsum.photos/200?1" },
  { id: 2, name: "Pizza", price: 80, img: "https://picsum.photos/200?2" },
  { id: 3, name: "Fried Chicken", price: 70, img: "https://picsum.photos/200?3" },
  { id: 4, name: "French Fries", price: 30, img: "https://picsum.photos/200?4" },
];

function Menu({ addToCart }) {
  return (
    <div className="menu">
      {items.map((item) => (
        <div key={item.id} className="menu-item">
          <img src={item.img} alt={item.name} />
          <h3>{item.name}</h3>
          <p>{item.price}k VND</p>
          <button onClick={() => addToCart(item)}>Thêm vào giỏ</button>
        </div>
      ))}
    </div>
  );
}

export default Menu;
