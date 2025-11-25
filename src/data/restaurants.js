import burger from "../assets/burger.jpg";
import pizza from "../assets/pizzaphomai.jpg";
import friedChicken from "../assets/gavien.jpg";
import drinks from "../assets/expresso.jpg";
import tacos from "../assets/tacos.jpg";

export const restaurants = [
  {
    id: "fco-burger-artisan",
    slug: "burger-artisan",
    badge: "Signature Kitchen",
    img: burger,
    name: "Burger Artisan House",
    description:
      "Bếp than hoa kết hợp pizza lò đá, matcha latte và snack phô mai kiểu Âu.",
    story:
      "Bếp than hoa giữ vỏ ngoài giòn, bên trong mềm; kết hợp phô mai nhập khẩu và rau củ tươi. Mỗi công thức burger được phát triển riêng cho thị trường Việt.",
    city: "Quận 1, TP. Hồ Chí Minh",
    deliveryTime: "Giao nhanh",
    tags: ["Burger", "Pizza", "Matcha", "Snack"],
    menuItemIds: [
      "fco-burger-blaze",
      "fco-burger-truffle",
      "fco-snack-parmesan",
      "fco-drink-matcha",
      "fco-pizza-truffle",
    ],
    translations: {
      en: {
        name: "Burger Artisan House",
        description: "Charcoal burgers, stone-baked pizza, matcha latte and cheesy tapas.",
        story:
          "Charcoal grill meets stone-baked pizza and crafted drinks. Imported cheese and fresh greens are paired with matcha and parmesan snacks for a varied table.",
        city: "District 1, Ho Chi Minh City",
        deliveryTime: "Fast delivery",
      },
    },
  },
  {
    id: "fco-pizza-lab",
    slug: "pizza-lab",
    badge: "Pizza Lab",
    img: pizza,
    name: "Pizza Pazzi",
    description: "Lò đá Ý nhưng có cả burger blue cheese, trà đào và popcorn giòn.",
    story:
      "Bếp pizza chuyên nghiệp với lò đá 400°C nướng mỗi chiếc pizza hoàn hảo. Từ đế bột ủ lạnh 48h tới phô mai mozzarella nhập khẩu.",
    city: "Quận 1, TP. Hồ Chí Minh",
    deliveryTime: "Giao nhanh",
    tags: ["Pizza", "Burger", "Tea", "Snack"],
    menuItemIds: [
      "fco-pizza-lava",
      "fco-pizza-seafood",
      "fco-drink-peachtea",
      "fco-burger-blue",
      "fco-snack-popcorn",
    ],
    translations: {
      en: {
        name: "Pizza Pazzi",
        description: "Stone oven pizzas alongside blue-cheese burgers, peach tea and crispy popcorn.",
        story:
          "A 400°C stone oven anchors the kitchen while comfort items like burgers, peach tea and snacks make the menu playful and varied.",
        city: "District 1, Ho Chi Minh City",
        deliveryTime: "Fast delivery",
      },
    },
  },
  {
    id: "fco-fried-bar",
    slug: "fried-bar",
    badge: "Fried Bar",
    img: friedChicken,
    name: "Chicken Fried Bar",
    description: "Gà rán, pizza kem carbonara, soda berry và burger double phomai.",
    story:
      "Gà rán sốt cay, cánh gà mật ong bơ, tôm chiên tempura. Tất cả những món chiên giòn được chế biến theo công thức đặc biệt của FCO.",
    city: "Quận 3, TP. Hồ Chí Minh",
    deliveryTime: "Giao nhanh",
    tags: ["Fried", "Pizza", "Burger", "Soda"],
    menuItemIds: [
      "fco-chicken-crispy",
      "fco-wings-honey",
      "fco-berry-soda",
      "fco-burger-double",
      "fco-pizza-carbonara",
    ],
    translations: {
      en: {
        name: "Chicken Fried Bar",
        description: "Fried chicken, carbonara pizza, berry soda and a double-cheese burger.",
        story:
          "Spicy wings sit next to creamy pizza and refreshing berry soda, giving the fried station a broader comfort-food lineup.",
        city: "District 3, Ho Chi Minh City",
        deliveryTime: "Fast delivery",
      },
    },
  },
  {
    id: "fco-drinks-lounge",
    slug: "drinks-lounge",
    badge: "Drinks Lounge",
    img: drinks,
    name: "FCO Drinks Lounge",
    description: "Cold brew, tonic, taco fiesta, pizza BBQ và burger rau củ.",
    story:
      "Cold brew 18h, matcha latte, trà đào cam sả, mocktail tropical. Quầy bar phục vụ những thức uống craft được làm tươi mỗi ngày.",
    city: "Quận 2, TP. Hồ Chí Minh",
    deliveryTime: "Giao nhanh",
    tags: ["Coffee", "Taco", "Pizza", "Burger"],
    menuItemIds: [
      "fco-coldbrew-orange",
      "fco-drink-tonic",
      "fco-taco-fiesta",
      "fco-pizza-bbq",
      "fco-burger-veggie",
    ],
    translations: {
      en: {
        name: "FCO Drinks Lounge",
        description: "Cold brew, tonic highballs, taco fiesta, BBQ pizza and a veggie burger.",
        story:
          "An 18-hour cold brew bar pairs coffee and tonics with tacos and pizza so you can snack, sip and share in one stop.",
        city: "District 2, Ho Chi Minh City",
        deliveryTime: "Fast delivery",
      },
    },
  },
  {
    id: "fco-taco-hub",
    slug: "taco-hub",
    badge: "Taco Hub",
    img: tacos,
    name: "FCO Taco Hub",
    description: "Taco Mexico, burger Hàn, pizza rau củ và mocktail Sunrise đầy màu sắc.",
    story:
      "Taco Mexico, burger fusion, bánh mì Wagyu, bánh mì breakfast. Nơi ăn nhẹ với những công thức fusion độc đáo của FCO.",
    city: "Quận 7, TP. Hồ Chí Minh",
    deliveryTime: "Giao nhanh",
    tags: ["Taco", "Burger", "Pizza", "Mocktail"],
    menuItemIds: [
      "fco-burger-korean",
      "fco-mixology-sunrise",
      "fco-pizza-veggie",
      "fco-snack-tempura",
    ],
    translations: {
      en: {
        name: "FCO Taco Hub",
        description: "Mexican tacos, Korean burgers, veggie pizza and a colorful Sunrise mocktail.",
        story:
          "Fusion taco recipes share the table with Korean bulgogi burgers, wholesome veggie pizza and a vibrant mocktail bar.",
        city: "District 7, Ho Chi Minh City",
        deliveryTime: "Fast delivery",
      },
    },
  },
];

export default restaurants;
