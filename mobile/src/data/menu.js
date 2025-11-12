import berrySoda from "../assets/bery.jpg";
import burgerBlaze from "../assets/burger.jpg";
import coldBrewOrange from "../assets/camxa.jpg";
import wingsHoney from "../assets/canhgabo.jpg";
import doubleCheese from "../assets/cheese.jpg";
import mocktailSunrise from "../assets/matcha.jpg";
import spicyFriedChicken from "../assets/garancay.jpg";
import parmesanTwists from "../assets/gavien.jpg";
import seafoodPizza from "../assets/haisan.jpg";
import truffleBurger from "../assets/phomaixanh.jpg";
import trufflePizza from "../assets/pizzanam.jpg";
import lavaCheesePizza from "../assets/pizzaphomai.jpg";
import veggieMedley from "../assets/raucu.jpg";
import tempuraShrimp from "../assets/tomchien.jpg";
import peachTea from "../assets/tradao.jpg";
import miso from "../assets/miso.jpg";

export const menuCategories = [
  {
    id: "cat-burger",
    title: "Burger Artisan",
    description:
      "Bánh burger nướng than cùng nguyên liệu nhập khẩu tươi mới.",
    icon: "🍔",
  },
  {
    id: "cat-pizza",
    title: "Pizza 18 inch",
    description: "Đế mỏng kiểu Ý, phô mai nhập khẩu và sốt signature FCO.",
    icon: "🍕",
  },
  {
    id: "cat-fried",
    title: "Gà rán & Snack",
    description: "Các món chiên giòn tan, sốt pha chuẩn vị chuyên gia.",
    icon: "🍗",
  },
  {
    id: "cat-drink",
    title: "Đồ uống mixology",
    description:
      "Trà trái cây, soda signature và cà phê cold brew làm mới mỗi ngày.",
    icon: "🥤",
  },
];

export const menuItems = [
  {
    id: "fco-burger-blaze",
    categoryId: "cat-burger",
    name: "Burger Blaze Bò Mỹ",
    description:
      "Bánh burger bò Mỹ nướng than, sốt phô mai cheddar và bacon giòn.",
    price: 69000,
    image: burgerBlaze,
  },
  {
    id: "fco-burger-truffle",
    categoryId: "cat-burger",
    name: "Burger Nấm Truffle",
    description:
      "Thịt bò Úc kết hợp sốt kem nấm truffle và phô mai gruyere nhập khẩu.",
    price: 95000,
    image: truffleBurger,
  },
  {
    id: "fco-burger-veggie",
    categoryId: "cat-burger",
    name: "Burger Rau Củ Sốt Miso",
    description:
      "Patty đậu gà, rau củ nướng và sốt miso ngọt mặn dành cho thực khách eat clean.",
    price: 72000,
    image: miso,
  },
  {
    id: "fco-burger-double",
    categoryId: "cat-burger",
    name: "Double Cheese Smash",
    description: "Hai lớp bò smash, phô mai cheddar đôi và sốt tỏi nướng.",
    price: 89000,
    image: doubleCheese,
  },
  {
    id: "fco-pizza-lava",
    categoryId: "cat-pizza",
    name: "Pizza Phô Mai Lava",
    description:
      "Đế mỏng kiểu Ý, phủ phô mai mozzarella lava và pepperoni cay.",
    price: 119000,
    image: lavaCheesePizza,
  },
  {
    id: "fco-pizza-seafood",
    categoryId: "cat-pizza",
    name: "Pizza Hải Sản Đặc Biệt",
    description:
      "Tôm, mực và nghêu tươi với sốt kem tỏi và phô mai parmesan.",
    price: 135000,
    image: seafoodPizza,
  },
  {
    id: "fco-pizza-truffle",
    categoryId: "cat-pizza",
    name: "Pizza Truffle Rừng",
    description: "Nấm rừng, dầu truffle đen và ricotta tươi.",
    price: 145000,
    image: trufflePizza,
  },
  {
    id: "fco-pizza-veggie",
    categoryId: "cat-pizza",
    name: "Pizza Rau Củ 4 Mùa",
    description:
      "Ớt chuông, nấm, bông cải xanh cùng phô mai ricotta nhẹ nhàng.",
    price: 102000,
    image: veggieMedley,
  },
  {
    id: "fco-chicken-crispy",
    categoryId: "cat-fried",
    name: "Gà Rán Cay Đậm",
    description:
      "Gà rán sốt cay Nashville, phục vụ cùng salad bắp cải và khoai tây nghiền.",
    price: 82000,
    image: spicyFriedChicken,
  },
  {
    id: "fco-wings-honey",
    categoryId: "cat-fried",
    name: "Cánh Gà Mật Ong Bơ",
    description:
      "Cánh gà chiên giòn phủ sốt mật ong bơ và mè rang thơm lừng.",
    price: 75000,
    image: wingsHoney,
  },
  {
    id: "fco-snack-parmesan",
    categoryId: "cat-fried",
    name: "Khoai Xoắn Parmesan",
    description:
      "Khoai tây xoắn chiên bơ tỏi, rắc parmesan và rau thơm.",
    price: 59000,
    image: parmesanTwists,
  },
  {
    id: "fco-snack-tempura",
    categoryId: "cat-fried",
    name: "Tôm Tempura Sốt Ponzu",
    description: "Tôm chiên tempura, sốt ponzu cam và mè rang.",
    price: 92000,
    image: tempuraShrimp,
  },
  {
    id: "fco-mixology-sunrise",
    categoryId: "cat-drink",
    name: "Mocktail Tropical Sunrise",
    description:
      "Nước ép cam, dứa và syrup hoa dâm bụt tạo nên tầng màu rực rỡ.",
    price: 49000,
    image: mocktailSunrise,
  },
  {
    id: "fco-coldbrew-orange",
    categoryId: "cat-drink",
    name: "Cold Brew Cam Sả",
    description:
      "Cold brew ủ lạnh 18h kết hợp syrup cam sả và đá viên đặc biệt.",
    price: 58000,
    image: coldBrewOrange,
  },
  {
    id: "fco-berry-soda",
    categoryId: "cat-drink",
    name: "Soda Berry Garden",
    description:
      "Soda việt quất, dâu tằm và bạc hà tươi giúp giải nhiệt tức thì.",
    price: 45000,
    image: berrySoda,
  },
  {
    id: "fco-drink-peachtea",
    categoryId: "cat-drink",
    name: "Trà Đào Cam Sả",
    description: "Trà đen ủ lạnh, đào vàng, cam tươi và sả thơm.",
    price: 42000,
    image: peachTea,
  },
];
