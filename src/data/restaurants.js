import burger from "../assets/burger.jpg";
import pizza from "../assets/pizzaphomai.jpg";
import friedChicken from "../assets/gavien.jpg";
import drinks from "../assets/expresso.jpg";
import tacoHubImage from "../assets/tacos.jpg";

export const restaurants = [
  {
    id: "fco-burger-artisan",
    slug: "burger-artisan",
    badge: "Burger Artisan",
    img: burger,
    name: "Burger Artisan House",
    description:
      "Burger bò nướng than, phô mai nhập khẩu và sốt FCO làm mới mỗi ngày.",
    story:
      "Bếp than hoa giữ vỏ ngoài giòn, bên trong mềm; kết hợp phô mai nhập khẩu và rau củ tươi. Mỗi công thức burger được phát triển riêng cho thị trường Việt.",
    city: "Quận 1, TP. Hồ Chí Minh",
    deliveryTime: "15-25 phút",
    tags: ["Burger", "Grill"],
    menuItemIds: [
      "fco-burger-blaze",
      "fco-burger-truffle",
      "fco-burger-veggie",
      "fco-burger-korean",
      "fco-burger-blue",
      "fco-burger-double",
    ],
    translations: {
      en: {
        name: "Burger Artisan House",
        description: "Char-grilled burgers with imported cheese and FCO signature sauces.",
        story:
          "Charcoal grill sears the beef while keeping it juicy. Imported cheese, fresh greens and house-made sauces tailored for local tastes.",
        city: "District 1, Ho Chi Minh City",
        deliveryTime: "15-25 min",
      },
    },
  },
  {
    id: "fco-pizza-lab",
    slug: "pizza-lab",
    badge: "Pizza Lab",
    img: pizza,
    name: "Pizza Pazzi",
    description: "Nhà hàng chuyên pizza nướng lò đá Ý truyền thống.",
    story:
      "Bếp pizza chuyên nghiệp với lò đá 400°C nướng mỗi chiếc pizza hoàn hảo. Từ đế bột ủ lạnh 48h tới phô mai mozzarella nhập khẩu.",
    city: "Quận 1, TP. Hồ Chí Minh",
    deliveryTime: "15-25 phút",
    tags: ["Pizza"],
    menuItemIds: [
      "fco-pizza-lava",
      "fco-pizza-carbonara",
      "fco-pizza-seafood",
      "fco-pizza-truffle",
    ],
    translations: {
      en: {
        name: "Pizza Pazzi",
        description: "Specialized restaurant for traditional Italian stone-fired pizzas.",
        story:
          "Professional pizza kitchen with 400°C stone oven baking every pizza perfectly. From 48-hour cold-proofed dough to imported mozzarella cheese.",
        city: "District 1, Ho Chi Minh City",
        deliveryTime: "15-25 min",
      },
    },
  },
  {
    id: "fco-fried-bar",
    slug: "fried-bar",
    badge: "Fried Bar",
    img: friedChicken,
    name: "Chicken Fried Bar",
    description: "Quầy gà rán và snack chiên giòn chuyên gia.",
    story:
      "Gà rán sốt cay, cánh gà mật ong bơ, tôm chiên tempura. Tất cả những món chiên giòn được chế biến theo công thức đặc biệt của FCO.",
    city: "Quận 3, TP. Hồ Chí Minh",
    deliveryTime: "10-20 phút",
    tags: ["Fried Chicken", "Snack"],
    menuItemIds: [
      "fco-chicken-crispy",
      "fco-wings-honey",
      "fco-snack-tempura",
      "fco-snack-popcorn",
    ],
    translations: {
      en: {
        name: "Chicken Fried Bar",
        description: "Expert fried chicken and crispy snack bar.",
        story:
          "Spicy fried chicken, honey butter wings, tempura shrimp. All fried items are made with FCO's special recipe.",
        city: "District 3, Ho Chi Minh City",
        deliveryTime: "10-20 min",
      },
    },
  },
  {
    id: "fco-drinks-lounge",
    slug: "drinks-lounge",
    badge: "Drinks Lounge",
    img: drinks,
    name: "FCO Drinks Lounge",
    description: "Quầy đồ uống mixology và cold brew chuyên gia.",
    story:
      "Cold brew 18h, matcha latte, trà đào cam sả, mocktail tropical. Quầy bar phục vụ những thức uống craft được làm tươi mỗi ngày.",
    city: "Quận 2, TP. Hồ Chí Minh",
    deliveryTime: "5-15 phút",
    tags: ["Drinks", "Coffee", "Cocktails"],
    menuItemIds: [
      "fco-coldbrew-orange",
      "fco-drink-matcha",
      "fco-drink-peachtea",
      "fco-mixology-sunrise",
    ],
    translations: {
      en: {
        name: "FCO Drinks Lounge",
        description: "Expert mixology and cold brew bar.",
        story:
          "18-hour cold brew, matcha latte, peach citrus tea, tropical mocktail. Bar serves craft drinks made fresh daily.",
        city: "District 2, Ho Chi Minh City",
        deliveryTime: "5-15 min",
      },
    },
  },
  {
    id: "fco-taco-hub",
    slug: "taco-hub",
    badge: "Taco Hub",
    img: tacoHubImage,
    name: "FCO Taco Hub",
    description: "Nhà hàng taco Mexico đặc biệt với burger fusion đa dạng.",
    story:
      "Taco Mexico, burger fusion, bánh mì Wagyu, bánh mì breakfast. Nơi ăn nhẹ với những công thức fusion độc đáo của FCO.",
    city: "Quận 7, TP. Hồ Chí Minh",
    deliveryTime: "12-25 phút",
    tags: ["Tacos", "Fusion", "Breakfast"],
    menuItemIds: [
      "fco-taco-fiesta",
      "fco-taco-korean",
      "fco-taco-wagyu",
      "fco-taco-breakfast",
    ],
    translations: {
      en: {
        name: "FCO Taco Hub",
        description: "Mexican taco restaurant with diverse fusion burgers.",
        story:
          "Mexican tacos, fusion burgers, Wagyu banh mi, breakfast banh mi. Light dining with FCO's unique fusion recipes.",
        city: "District 7, Ho Chi Minh City",
        deliveryTime: "12-25 min",
      },
    },
  },
];

export default restaurants;
