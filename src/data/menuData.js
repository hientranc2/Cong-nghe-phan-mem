import pizzaPhoMai from "../assets/pizzaphomai.jpg"; 
import bery from "../assets/bery.jpg";
import burger from "../assets/burger.jpg";
import camxa from "../assets/camxa.jpg";
import canhgabo from "../assets/canhgabo.jpg";
import cheese from "../assets/cheese.jpg";
import expresso from "../assets/expresso.jpg";
import garancay from "../assets/garancay.jpg";
import gavien from "../assets/gavien.jpg";
import haisan from "../assets/haisan.jpg";
import matcha from "../assets/matcha.jpg";
import phomaixanh from "../assets/phomaixanh.jpg";
import pizzanam from "../assets/pizzanam.jpg";
import raucu from "../assets/raucu.jpg";
import tacos from "../assets/tacos.jpg";
import tomchien from "../assets/tomchien.jpg";
import tradao from "../assets/tradao.jpg";
export const categories = [
  {
    id: "cat-burger",
    slug: "burger",
    icon: "🍔",
    title: "Burger Artisan",
    description: "Bánh burger nướng than cùng nguyên liệu nhập khẩu tươi mới.",
    heroTitle: "Burger Artisan chuẩn vị lửa than",
    heroDescription:
      "Tận hưởng burger bò Mỹ nướng than, phô mai nhập khẩu và sốt signature FCO được chế biến mới mỗi ngày.",
    translations: {
      vi: {
        title: "Burger Artisan",
        description: "Bánh burger nướng than cùng nguyên liệu nhập khẩu tươi mới.",
        heroTitle: "Burger Artisan chuẩn vị lửa than",
        heroDescription:
          "Tận hưởng burger bò Mỹ nướng than, phô mai nhập khẩu và sốt signature FCO được chế biến mới mỗi ngày.",
      },
      en: {
        title: "Artisan burgers",
        description: "Char-grilled burgers with freshly imported premium ingredients.",
        heroTitle: "Char-grilled artisan burgers",
        heroDescription:
          "Savor American Angus beef seared over charcoal, imported cheese and FCO signature sauces prepared fresh daily.",
      },
    },
  },
  {
    id: "cat-pizza",
    slug: "pizza",
    icon: "🍕",
    title: "Pizza 18 inch",
    description: "Đế mỏng kiểu Ý, phô mai nhập khẩu và sốt signature FCO.",
    heroTitle: "Pizza thủ công 18 inch chuẩn Ý",
    heroDescription:
      "Từ đế bột ủ lạnh 48h tới phô mai mozzarella tan chảy, mỗi chiếc pizza được nướng trên đá nóng 400°C.",
    translations: {
      vi: {
        title: "Pizza 18 inch",
        description: "Đế mỏng kiểu Ý, phô mai nhập khẩu và sốt signature FCO.",
        heroTitle: "Pizza thủ công 18 inch chuẩn Ý",
        heroDescription:
          "Từ đế bột ủ lạnh 48h tới phô mai mozzarella tan chảy, mỗi chiếc pizza được nướng trên đá nóng 400°C.",
      },
      en: {
        title: "18-inch pizzas",
        description: "Thin-crust Italian dough, imported cheese and FCO signature sauce.",
        heroTitle: "Handcrafted 18-inch Italian pizzas",
        heroDescription:
          "From 48-hour cold-proofed dough to molten mozzarella, each pizza is baked on a 400°C stone deck.",
      },
    },
  },
  {
    id: "cat-fried",
    slug: "fried-snack",
    icon: "🍗",
    title: "Gà rán & Snack",
    description: "Các món chiên giòn tan, sốt pha chuẩn vị chuyên gia.",
    heroTitle: "Gà rán & snack phủ sốt đặc biệt",
    heroDescription:
      "Khám phá những món gà rán cay, khoai tây phô mai và taco Mexico với công thức độc quyền tại FCO.",
    translations: {
      vi: {
        title: "Gà rán & Snack",
        description: "Các món chiên giòn tan, sốt pha chuẩn vị chuyên gia.",
        heroTitle: "Gà rán & snack phủ sốt đặc biệt",
        heroDescription:
          "Khám phá những món gà rán cay, khoai tây phô mai và taco Mexico với công thức độc quyền tại FCO.",
      },
      en: {
        title: "Fried chicken & snacks",
        description: "Crispy fried bites glazed with chef-crafted signature sauces.",
        heroTitle: "Fried chicken & snacks with signature sauces",
        heroDescription:
          "Discover spicy fried chicken, cheesy fries and Mexican tacos made with FCO's secret recipes.",
      },
    },
  },
  {
    id: "cat-drink",
    slug: "mixology",
    icon: "🥤",
    title: "Đồ uống mixology",
    description: "Trà trái cây, soda signature và cà phê cold brew làm mới mỗi ngày.",
    heroTitle: "Quầy đồ uống mixology tươi mới",
    heroDescription:
      "Từ trà hoa quả mát lạnh đến cold brew rang xay tại chỗ, đội ngũ bartender của FCO luôn sẵn sàng sáng tạo.",
    translations: {
      vi: {
        title: "Đồ uống mixology",
        description: "Trà trái cây, soda signature và cà phê cold brew làm mới mỗi ngày.",
        heroTitle: "Quầy đồ uống mixology tươi mới",
        heroDescription:
          "Từ trà hoa quả mát lạnh đến cold brew rang xay tại chỗ, đội ngũ bartender của FCO luôn sẵn sàng sáng tạo.",
      },
      en: {
        title: "Craft mixology drinks",
        description: "Fruit teas, signature sodas and cold brew made fresh every day.",
        heroTitle: "Fresh craft mixology bar",
        heroDescription:
          "From chilled fruit teas to hand-brewed cold brew, our bartenders are ready to shake up something new.",
      },
    },
  },
];

export const restaurants = [
  {
    id: "fco-central-kitchen",
    slug: "central-kitchen",
    badge: "Trung tâm",
    cover:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=900&q=80",
    name: "Nhà hàng FCO Central Kitchen",
    description: "Trải nghiệm burger và pizza thượng hạng tại trung tâm Quận 1.",
    story:
      "Bếp trung tâm của FCO phục vụ hơn 1.200 suất mỗi ngày với dây chuyền nướng than và lò đá Ý. Các đầu bếp chuẩn hóa từng bước để đảm bảo món ăn giữ trọn hương vị dù giao đi đâu.",
    city: "Quận 1, TP. Hồ Chí Minh",
    deliveryTime: "15-25 phút",
    tags: ["Burger", "Pizza", "Char-grilled"],
    menuItemIds: [
      "fco-burger-blaze",
      "fco-burger-truffle",
      "fco-burger-veggie",
      "fco-pizza-lava",
      "fco-pizza-seafood",
      "fco-pizza-veggie",
    ],
    translations: {
      en: {
        name: "FCO Central Kitchen",
        description:
          "Char-grilled burgers and signature Italian pizzas from District 1.",
        story:
          "Our flagship kitchen fires over 1,200 portions daily. The charcoal grill line and Italian stone deck keep every burger and pizza consistent before couriers head out.",
        city: "District 1, Ho Chi Minh City",
        deliveryTime: "15-25 min",
      },
    },
  },
  {
    id: "fco-river-lounge",
    slug: "riverside-lounge",
    badge: "River lounge",
    cover:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=900&q=80",
    name: "FCO Riverside Lounge",
    description:
      "Nhà hàng kề sông với burger fusion, pizza hải sản và đồ uống mixology.",
    story:
      "Không gian mở nhìn ra sông Sài Gòn, nơi các đầu bếp thực hiện menu fusion liên tục đổi mới theo mùa. Khu bar mixology cung cấp hơn 15 công thức signature.",
    city: "Quận 2, TP. Hồ Chí Minh",
    deliveryTime: "18-30 phút",
    tags: ["Fusion", "Cocktails", "Open kitchen"],
    menuItemIds: [
      "fco-burger-korean",
      "fco-burger-blue",
      "fco-burger-double",
      "fco-pizza-bbq",
      "fco-pizza-carbonara",
      "fco-pizza-truffle",
      "fco-wings-honey",
      "fco-taco-fiesta",
      "fco-banhmi-fusion",
      "fco-soup-lobster",
      "fco-dessert-tiramisu",
      "fco-seafood-platter",
      "fco-soda-ginger",
    ],
    translations: {
      en: {
        name: "FCO Riverside Lounge",
        description:
          "Riverfront dining with fusion burgers, gourmet pizzas, and crafted cocktails.",
        story:
          "Open kitchens overlook Saigon River while chefs push seasonal fusion ideas. The mixology bar serves 15+ rotating signatures shaken to order.",
        city: "District 2, Ho Chi Minh City",
        deliveryTime: "18-30 min",
      },
    },
  },
  {
    id: "fco-sky-garden",
    slug: "sky-garden",
    badge: "Sky garden",
    cover:
      "https://images.unsplash.com/photo-1432139555190-58524dae6a55?auto=format&fit=crop&w=900&q=80",
    name: "FCO Sky Garden",
    description: "Tầng thượng với snack chiên giòn và mixology signature.",
    story:
      "Sky Garden nổi tiếng với các set snack ăn kèm cocktail. Dàn DJ biểu diễn cuối tuần và quầy bar thủ công cold brew giúp bạn thư giãn trên cao.",
    city: "Quận 3, TP. Hồ Chí Minh",
    deliveryTime: "20-35 phút",
    tags: ["Snack", "Mixology", "Terrace"],
    menuItemIds: [
      "fco-chicken-crispy",
      "fco-snack-parmesan",
      "fco-snack-popcorn",
      "fco-snack-tempura",
      "fco-mixology-sunrise",
      "fco-coldbrew-orange",
      "fco-berry-soda",
      "fco-drink-peachtea",
      "fco-drink-matcha",
      "fco-drink-tonic",
      "fco-coldbrew-caramel",
      "fco-cheesecake-passion",
    ],
    translations: {
      en: {
        name: "FCO Sky Garden",
        description:
          "Rooftop terrace serving crispy snacks, signature mixology and fresh brews.",
        story:
          "Our rooftop lounge pairs crunchy sharing snacks with signature cocktails and cold brew on tap. Weekends feature resident DJs for a sky-high vibe.",
        city: "District 3, Ho Chi Minh City",
        deliveryTime: "20-35 min",
      },
    },
  },
  {
    id: "fco-garden-terrace",
    slug: "garden-terrace",
    badge: "Garden",
    cover:
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=1200&q=80",
    name: "FCO Garden Terrace",
    description: "Không gian xanh ở Quận 7 với salad, pasta và nước ép lạnh.",
    story:
      "Garden Terrace mang đến brunch nhẹ nhàng với nguyên liệu xanh, nước ép cold-pressed và pasta thủ công phơi gió.",
    city: "Quận 7, TP. Hồ Chí Minh",
    deliveryTime: "16-28 phút",
    tags: ["Brunch", "Salad", "Cold-pressed"],
    menuItemIds: [
      "fco-salad-quinoa",
      "fco-pasta-pesto",
      "fco-juice-green",
      "fco-crab-pho",
      "fco-rice-teriyaki",
      "fco-noodle-bowl",
      "fco-milk-tea-brown",
      "fco-breakfast-banhmi",
    ],
    translations: {
      en: {
        name: "FCO Garden Terrace",
        description:
          "A leafy Q7 terrace serving salads, fresh pasta and cold-pressed juices.",
        story:
          "Weekend brunch happens under the canopy with handmade pasta and green juices pressed to order.",
        city: "District 7, Ho Chi Minh City",
        deliveryTime: "16-28 min",
      },
    },
  }
];

const rawMenuItems = [
  {
    id: "fco-burger-blaze",
    categoryId: "cat-burger",
    name: "Burger Blaze Bò Mỹ",
    description: "Bánh burger bò Mỹ nướng than, sốt phô mai cheddar và bacon giòn.",
    price: 69,
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    calories: 520,
    time: 12,
    tag: "Best Seller",
    isBestSeller: true,
    translations: {
      vi: {
        name: "Burger Blaze Bò Mỹ",
        description:
          "Bánh burger bò Mỹ nướng than, sốt phô mai cheddar và bacon giòn.",
        tag: "Best Seller",
      },
      en: {
        name: "Blaze Angus Burger",
        description:
          "Char-grilled American beef burger with cheddar cheese sauce and crispy bacon.",
        tag: "Best Seller",
      },
    },
  },
  {
    id: "fco-burger-truffle",
    categoryId: "cat-burger",
    name: "Burger Nấm Truffle",
    description: "Thịt bò Úc kết hợp sốt kem nấm truffle và phô mai gruyere nhập khẩu.",
    price: 95,
    img: burger,
    calories: 610,
    time: 14,
    tag: "Chef's Choice",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Burger Nấm Truffle",
        description:
          "Thịt bò Úc kết hợp sốt kem nấm truffle và phô mai gruyere nhập khẩu.",
        tag: "Chef's Choice",
      },
      en: {
        name: "Truffle Mushroom Burger",
        description:
          "Australian beef patty with truffle mushroom cream sauce and imported gruyere cheese.",
        tag: "Chef's Choice",
      },
    },
  },
  {
    id: "fco-burger-veggie",
    categoryId: "cat-burger",
    name: "Burger Rau Củ Sốt Miso",
    description: "Patty đậu gà, rau củ nướng và sốt miso ngọt mặn dành cho thực khách eat clean.",
    price: 72,
    img: raucu,
    calories: 430,
    time: 11,
    tag: "Eat Clean",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Burger Rau Củ Sốt Miso",
        description:
          "Patty đậu gà, rau củ nướng và sốt miso ngọt mặn dành cho thực khách eat clean.",
        tag: "Eat Clean",
      },
      en: {
        name: "Miso Glazed Veggie Burger",
        description:
          "Chickpea patty with roasted vegetables and a sweet-savory miso glaze for clean eaters.",
        tag: "Eat Clean",
      },
    },
  },
  {
    id: "fco-pizza-lava",
    categoryId: "cat-pizza",
    name: "Pizza Phô Mai Lava",
    description: "Đế mỏng kiểu Ý, phủ phô mai mozzarella lava và pepperoni cay.",
    price: 119,
    img: pizzaPhoMai,
    calories: 730,
    time: 15,
    tag: "FCO Signature",
    isBestSeller: true,
    translations: {
      vi: {
        name: "Pizza Phô Mai Lava",
        description:
          "Đế mỏng kiểu Ý, phủ phô mai mozzarella lava và pepperoni cay.",
        tag: "FCO Signature",
      },
      en: {
        name: "Lava Cheese Pizza",
        description:
          "Thin Italian crust layered with molten mozzarella lava and spicy pepperoni.",
        tag: "FCO Signature",
      },
    },
  },
  {
    id: "fco-pizza-seafood",
    categoryId: "cat-pizza",
    name: "Pizza Hải Sản Đặc Biệt",
    description: "Tôm, mực và nghêu tươi với sốt kem tỏi và phô mai parmesan.",
    price: 135,
    img: haisan,
    calories: 690,
    time: 16,
    tag: "Premium",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Pizza Hải Sản Đặc Biệt",
        description:
          "Tôm, mực và nghêu tươi với sốt kem tỏi và phô mai parmesan.",
        tag: "Premium",
      },
      en: {
        name: "Signature Seafood Pizza",
        description:
          "Fresh shrimp, squid and clams over garlic cream sauce with parmesan cheese.",
        tag: "Premium",
      },
    },
  },
  {
    id: "fco-pizza-veggie",
    categoryId: "cat-pizza",
    name: "Pizza Rau Củ 4 Mùa",
    description: "Ớt chuông, nấm, bông cải xanh cùng phô mai ricotta nhẹ nhàng.",
    price: 102,
    img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
    calories: 560,
    time: 14,
    tag: "Healthy",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Pizza Rau Củ 4 Mùa",
        description:
          "Ớt chuông, nấm, bông cải xanh cùng phô mai ricotta nhẹ nhàng.",
        tag: "Healthy",
      },
      en: {
        name: "Four Seasons Veggie Pizza",
        description:
          "Bell peppers, mushrooms and broccoli topped with light ricotta cheese.",
        tag: "Healthy",
      },
    },
  },
  {
    id: "fco-chicken-crispy",
    categoryId: "cat-fried",
    name: "Gà Rán Cay Đậm",
    description: "Gà rán sốt cay Nashville, phục vụ cùng salad bắp cải và khoai tây nghiền.",
    price: 82,
    img: garancay,
    calories: 610,
    time: 10,
    tag: "Hot",
    isBestSeller: true,
    translations: {
      vi: {
        name: "Gà Rán Cay Đậm",
        description:
          "Gà rán sốt cay Nashville, phục vụ cùng salad bắp cải và khoai tây nghiền.",
        tag: "Hot",
      },
      en: {
        name: "Nashville Blaze Fried Chicken",
        description:
          "Crispy chicken tossed in Nashville hot sauce with coleslaw and mashed potatoes.",
        tag: "Hot",
      },
    },
  },
  {
    id: "fco-wings-honey",
    categoryId: "cat-fried",
    name: "Cánh Gà Mật Ong Bơ",
    description: "Cánh gà chiên giòn phủ sốt mật ong bơ và mè rang thơm lừng.",
    price: 75,
    img: canhgabo,
    calories: 520,
    time: 9,
    tag: "Sweet & Spicy",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Cánh Gà Mật Ong Bơ",
        description:
          "Cánh gà chiên giòn phủ sốt mật ong bơ và mè rang thơm lừng.",
        tag: "Sweet & Spicy",
      },
      en: {
        name: "Honey Butter Wings",
        description:
          "Crispy wings coated in a honey butter glaze with toasted sesame seeds.",
        tag: "Sweet & Spicy",
      },
    },
  },
  {
    id: "fco-taco-fiesta",
    categoryId: "cat-fried",
    name: "Taco Fiesta Mexico",
    description: "Taco bò kéo sợi, salsa xoài và sốt kem chua đặc biệt của FCO.",
    price: 65,
    img: tacos,
    calories: 450,
    time: 9,
    tag: "Món mới",
    isBestSeller: true,
    translations: {
      vi: {
        name: "Taco Fiesta Mexico",
        description:
          "Taco bò kéo sợi, salsa xoài và sốt kem chua đặc biệt của FCO.",
        tag: "Món mới",
      },
      en: {
        name: "Fiesta Shredded Beef Taco",
        description:
          "Shredded beef tacos with mango salsa and FCO's signature sour cream sauce.",
        tag: "New",
      },
    },
  },
  {
    id: "fco-mixology-sunrise",
    categoryId: "cat-drink",
    name: "Mocktail Tropical Sunrise",
    description: "Nước ép cam, dứa và syrup hoa dâm bụt tạo nên tầng màu rực rỡ.",
    price: 49,
    img: "https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80",
    calories: 180,
    time: 3,
    tag: "Bartender Pick",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Mocktail Tropical Sunrise",
        description:
          "Nước ép cam, dứa và syrup hoa dâm bụt tạo nên tầng màu rực rỡ.",
        tag: "Bartender Pick",
      },
      en: {
        name: "Tropical Sunrise Mocktail",
        description:
          "Orange and pineapple juice layered with hibiscus syrup for vibrant color.",
        tag: "Bartender Pick",
      },
    },
  },
  {
    id: "fco-coldbrew-orange",
    categoryId: "cat-drink",
    name: "Cold Brew Cam Sả",
    description: "Cold brew ủ lạnh 18h kết hợp syrup cam sả và đá viên đặc biệt.",
    price: 58,
    img: camxa,
    calories: 90,
    time: 4,
    tag: "Limited",
    isBestSeller: true,
    translations: {
      vi: {
        name: "Cold Brew Cam Sả",
        description:
          "Cold brew ủ lạnh 18h kết hợp syrup cam sả và đá viên đặc biệt.",
        tag: "Limited",
      },
      en: {
        name: "Orange Lemongrass Cold Brew",
        description:
          "18-hour steeped cold brew blended with orange-lemongrass syrup and crystal ice.",
        tag: "Limited",
      },
    },
  },
  {
    id: "fco-berry-soda",
    categoryId: "cat-drink",
    name: "Soda Berry Garden",
    description: "Soda việt quất, dâu tằm và bạc hà tươi giúp giải nhiệt tức thì.",
    price: 45,
    img: bery,
    calories: 150,
    time: 2,
    tag: "Refreshing",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Soda Berry Garden",
        description:
          "Soda việt quất, dâu tằm và bạc hà tươi giúp giải nhiệt tức thì.",
        tag: "Refreshing",
      },
      en: {
        name: "Berry Garden Soda",
        description:
          "Blueberry, mulberry and fresh mint soda for instant refreshment.",
        tag: "Refreshing",
      },
    },
  },
  {
    id: "fco-burger-korean",
    categoryId: "cat-burger",
    name: "Burger Bulgogi Seoul",
    description: "Burger bò ướp bulgogi, kimchi caramel và sốt mayo gochujang.",
    price: 78,
    img: "https://images.unsplash.com/photo-1553979459-d2229ba7433b?auto=format&fit=crop&w=800&q=80",
    calories: 560,
    time: 13,
    tag: "Fusion",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Burger Bulgogi Seoul",
        description:
          "Burger bò ướp bulgogi, kimchi caramel và sốt mayo gochujang.",
        tag: "Fusion",
      },
      en: {
        name: "Seoul Bulgogi Burger",
        description:
          "Beef patty marinated in bulgogi glaze with caramelized kimchi and gochujang mayo.",
        tag: "Fusion",
      },
    },
  },
  {
    id: "fco-burger-blue",
    categoryId: "cat-burger",
    name: "Burger Phô Mai Xanh",
    description: "Burger bò Úc phủ phô mai xanh, hành tím ngâm và sốt mật ong cay.",
    price: 88,
    img: phomaixanh,
    calories: 600,
    time: 12,
    tag: "Gourmet",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Burger Phô Mai Xanh",
        description:
          "Burger bò Úc phủ phô mai xanh, hành tím ngâm và sốt mật ong cay.",
        tag: "Gourmet",
      },
      en: {
        name: "Blue Cheese Gourmet Burger",
        description:
          "Australian beef burger topped with blue cheese, pickled shallots and spicy honey glaze.",
        tag: "Gourmet",
      },
    },
  },
  {
    id: "fco-burger-double",
    categoryId: "cat-burger",
    name: "Double Cheese Smash",
    description: "Hai lớp bò smash, phô mai cheddar đôi và sốt tỏi nướng.",
    price: 89,
    img: cheese,
    calories: 720,
    time: 15,
    tag: "Double",
    isBestSeller: true,
    translations: {
      vi: {
        name: "Double Cheese Smash",
        description:
          "Hai lớp bò smash, phô mai cheddar đôi và sốt tỏi nướng.",
        tag: "Double",
      },
      en: {
        name: "Double Cheese Smash",
        description:
          "Two smash beef patties, double cheddar slices and roasted garlic sauce.",
        tag: "Double",
      },
    },
  },
  {
    id: "fco-pizza-bbq",
    categoryId: "cat-pizza",
    name: "Pizza BBQ Khói",
    description: "Sườn heo xé, sốt BBQ khói và hành tây caramel trên đế mỏng.",
    price: 128,
    img: "https://images.unsplash.com/photo-1528137871618-79d2761e3fd5?auto=format&fit=crop&w=800&q=80",
    calories: 680,
    time: 17,
    tag: "Smoky",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Pizza BBQ Khói",
        description:
          "Sườn heo xé, sốt BBQ khói và hành tây caramel trên đế mỏng.",
        tag: "Smoky",
      },
      en: {
        name: "Smoked BBQ Pizza",
        description:
          "Shredded pork ribs, smoky BBQ sauce and caramelized onions on a thin crust.",
        tag: "Smoky",
      },
    },
  },
  {
    id: "fco-pizza-carbonara",
    categoryId: "cat-pizza",
    name: "Pizza Carbonara",
    description: "Thịt xông khói, trứng lòng đào và phô mai pecorino béo ngậy.",
    price: 132,
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    calories: 720,
    time: 16,
    tag: "Creamy",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Pizza Carbonara",
        description:
          "Thịt xông khói, trứng lòng đào và phô mai pecorino béo ngậy.",
        tag: "Creamy",
      },
      en: {
        name: "Carbonara Pizza",
        description:
          "Bacon, soft-set egg and pecorino cheese over a silky cream base.",
        tag: "Creamy",
      },
    },
  },
  {
    id: "fco-pizza-truffle",
    categoryId: "cat-pizza",
    name: "Pizza Truffle Rừng",
    description: "Nấm rừng, dầu truffle đen và ricotta tươi.",
    price: 145,
    img: pizzanam,
    calories: 650,
    time: 18,
    tag: "Chef's pick",
    isBestSeller: true,
    translations: {
      vi: {
        name: "Pizza Truffle Rừng",
        description: "Nấm rừng, dầu truffle đen và ricotta tươi.",
        tag: "Chef's pick",
      },
      en: {
        name: "Forest Truffle Pizza",
        description: "Wild mushrooms, black truffle oil and fresh ricotta.",
        tag: "Chef's pick",
      },
    },
  },
  {
    id: "fco-snack-parmesan",
    categoryId: "cat-fried",
    name: "Khoai Xoắn Parmesan",
    description: "Khoai tây xoắn chiên bơ tỏi, rắc parmesan và rau thơm.",
    price: 59,
    img: "https://images.unsplash.com/photo-1541592106381-b31e9677c0e5?auto=format&fit=crop&w=800&q=80",
    calories: 430,
    time: 7,
    tag: "Snack",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Khoai Xoắn Parmesan",
        description: "Khoai tây xoắn chiên bơ tỏi, rắc parmesan và rau thơm.",
        tag: "Snack",
      },
      en: {
        name: "Parmesan Twist Fries",
        description:
          "Spiral fries tossed in garlic butter, parmesan and herbs.",
        tag: "Snack",
      },
    },
  },
  {
    id: "fco-snack-popcorn",
    categoryId: "cat-fried",
    name: "Gà Viên Popcorn",
    description: "Gà popcorn chiên giòn, áo sốt mayo mật ong và tiêu hồng.",
    price: 68,
    img: gavien,
    calories: 480,
    time: 8,
    tag: "Kid's pick",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Gà Viên Popcorn",
        description:
          "Gà popcorn chiên giòn, áo sốt mayo mật ong và tiêu hồng.",
        tag: "Kid's pick",
      },
      en: {
        name: "Honey Pepper Popcorn Chicken",
        description:
          "Crispy popcorn chicken glazed with honey mayo and pink peppercorns.",
        tag: "Kid's pick",
      },
    },
  },
  {
    id: "fco-snack-tempura",
    categoryId: "cat-fried",
    name: "Tôm Tempura Sốt Ponzu",
    description: "Tôm chiên tempura, sốt ponzu cam và mè rang.",
    price: 92,
    img: tomchien,
    calories: 510,
    time: 9,
    tag: "Premium",
    isBestSeller: true,
    translations: {
      vi: {
        name: "Tôm Tempura Sốt Ponzu",
        description: "Tôm chiên tempura, sốt ponzu cam và mè rang.",
        tag: "Premium",
      },
      en: {
        name: "Ponzu Tempura Shrimp",
        description:
          "Crispy tempura shrimp with citrus ponzu sauce and toasted sesame.",
        tag: "Premium",
      },
    },
  },
  {
    id: "fco-drink-peachtea",
    categoryId: "cat-drink",
    name: "Trà Đào Cam Sả",
    description: "Trà đen ủ lạnh, đào vàng, cam tươi và sả thơm.",
    price: 42,
    img: tradao,
    calories: 120,
    time: 4,
    tag: "Best seller",
    isBestSeller: true,
    translations: {
      vi: {
        name: "Trà Đào Cam Sả",
        description: "Trà đen ủ lạnh, đào vàng, cam tươi và sả thơm.",
        tag: "Best seller",
      },
      en: {
        name: "Peach Citrus Tea",
        description:
          "Cold-brewed black tea with golden peach, fresh orange and lemongrass.",
        tag: "Best seller",
      },
    },
  },
  {
    id: "fco-drink-matcha",
    categoryId: "cat-drink",
    name: "Matcha Dừa Kem Sữa",
    description: "Matcha Nhật, sữa dừa và lớp kem cheese mặn ngọt.",
    price: 55,
    img: matcha,
    calories: 240,
    time: 5,
    tag: "Creamy",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Matcha Dừa Kem Sữa",
        description: "Matcha Nhật, sữa dừa và lớp kem cheese mặn ngọt.",
        tag: "Creamy",
      },
      en: {
        name: "Creamy Coconut Matcha",
        description:
          "Japanese matcha with coconut milk topped with salted cheese foam.",
        tag: "Creamy",
      },
    },
  },
  {
    id: "fco-drink-tonic",
    categoryId: "cat-drink",
    name: "Espresso Tonic Citrus",
    description: "Espresso rang đậm, tonic và syrup quýt tươi.",
    price: 62,
    img: expresso,
    calories: 95,
    time: 3,
    tag: "Signature",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Espresso Tonic Citrus",
        description: "Espresso rang đậm, tonic và syrup quýt tươi.",
        tag: "Signature",
      },
      en: {
        name: "Citrus Espresso Tonic",
        description:
          "Dark roast espresso shaken with tonic water and mandarin syrup.",
        tag: "Signature",
      },
    },
  },
  {
    id: "fco-salad-quinoa",
    categoryId: "cat-fried",
    name: "Quinoa Garden Salad",
    description: "Quinoa, rau baby, trai cam va pho mai feta.",
    price: 82,
    img: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?auto=format&fit=crop&w=800&q=80",
    calories: 360,
    time: 10,
    tag: "Brunch",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Salad Quinoa Garden",
        description: "Quinoa, rau baby, cam segmen và phô mai feta.",
        tag: "Brunch",
      },
      en: {
        name: "Quinoa Garden Salad",
        description: "Quinoa, baby greens, orange supremes and creamy feta.",
        tag: "Brunch",
      },
    },
  },
  {
    id: "fco-pasta-pesto",
    categoryId: "cat-pizza",
    name: "Pasta Pesto Basil",
    description: "Pasta tuoi tron pesto basil, dau thong va parmesan.",
    price: 96,
    img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
    calories: 520,
    time: 13,
    tag: "Handmade",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Pasta Pesto Basil",
        description: "Pasta tươi trộn pesto basil, hạt thông và phô mai parmesan.",
        tag: "Handmade",
      },
      en: {
        name: "Fresh Basil Pesto Pasta",
        description: "Hand-cut pasta tossed in basil pesto with pine nuts and parmesan.",
        tag: "Handmade",
      },
    },
  },
  {
    id: "fco-juice-green",
    categoryId: "cat-drink",
    name: "Green Detox Juice",
    description: "Can tay, dua leo, tao xanh va chanh leo.",
    price: 58,
    img: "https://images.unsplash.com/photo-1467453678174-768ec283a940?auto=format&fit=crop&w=800&q=80",
    calories: 110,
    time: 4,
    tag: "Cold-pressed",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Nước ép xanh detox",
        description: "Cần tây, dưa leo, táo xanh và chanh leo tươi.",
        tag: "Cold-pressed",
      },
      en: {
        name: "Green Detox Juice",
        description: "Celery, cucumber, green apple and passionfruit cold-pressed.",
        tag: "Cold-pressed",
      },
    },
  },
  {
    id: "fco-banhmi-fusion",
    categoryId: "cat-burger",
    name: "Banh Mi Fusion Wagyu",
    description: "Wagyu nuong, pate gan ngong va pickles handmade.",
    price: 125,
    img: "https://images.unsplash.com/photo-1504366269671-1509e2aeea3f?auto=format&fit=crop&w=800&q=80",
    calories: 640,
    time: 14,
    tag: "Chef table",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Bánh mì Wagyu Fusion",
        description: "Thịt Wagyu nướng, pate gan ngỗng và pickles thủ công.",
        tag: "Chef table",
      },
      en: {
        name: "Wagyu Fusion Banh Mi",
        description: "Charred wagyu, foie gras pâté and house pickles.",
        tag: "Chef table",
      },
    },
  },
  {
    id: "fco-soup-lobster",
    categoryId: "cat-fried",
    name: "Lobster Bisque Foie Gras",
    description: "Súp bisque tom hùm, kem cognac va banh sourdough.",
    price: 148,
    img: "https://images.unsplash.com/photo-1473093226795-af9932fe5856?auto=format&fit=crop&w=800&q=80",
    calories: 420,
    time: 12,
    tag: "Premium",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Bisque tôm hùm Foie Gras",
        description: "Súp tôm hùm nấu cognac, bọt kem và bánh sourdough.",
        tag: "Premium",
      },
      en: {
        name: "Foie Gras Lobster Bisque",
        description: "Silky lobster bisque finished with cognac cream and sourdough.",
        tag: "Premium",
      },
    },
  },
  {
    id: "fco-dessert-tiramisu",
    categoryId: "cat-fried",
    name: "Tiramisu Caphe Muoi",
    description: "Lop mascarpone, ca phe muoi va cacao nguyen chat.",
    price: 78,
    img: "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=800&q=80",
    calories: 480,
    time: 8,
    tag: "Dessert",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Tiramisu cà phê muối",
        description: "Mascarpone, cà phê muối và cacao nguyên chất.",
        tag: "Dessert",
      },
      en: {
        name: "Salted Coffee Tiramisu",
        description: "Mascarpone cream layered with salted coffee and cocoa.",
        tag: "Dessert",
      },
    },
  },
  {
    id: "fco-seafood-platter",
    categoryId: "cat-pizza",
    name: "Seafood Flame Platter",
    description: "Hai san nuong than, sot nam chanh leo.",
    price: 168,
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    calories: 690,
    time: 18,
    tag: "Seafood",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Platter hải sản lửa",
        description: "Hải sản nướng than ăn kèm sốt nấm chanh leo.",
        tag: "Seafood",
      },
      en: {
        name: "Flame Seafood Platter",
        description: "Char-gilled seafood with mushroom passionfruit sauce.",
        tag: "Seafood",
      },
    },
  },
  {
    id: "fco-crab-pho",
    categoryId: "cat-fried",
    name: "Pho Gach Cua Roasted",
    description: "Nuoc pho 18h, gach cua rang bot va rau thom.",
    price: 132,
    img: "https://images.unsplash.com/photo-1481931098730-318b6f776db0?auto=format&fit=crop&w=800&q=80",
    calories: 540,
    time: 14,
    tag: "Signature",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Phở gạch cua nướng",
        description: "Nước phở 18h, gạch cua, rau thơm và hành phi.",
        tag: "Signature",
      },
      en: {
        name: "Roasted Crab Pho",
        description: "18-hour pho broth with roasted crab roe and herbs.",
        tag: "Signature",
      },
    },
  },
  {
    id: "fco-soda-ginger",
    categoryId: "cat-drink",
    name: "Ginger Sea Breeze",
    description: "Soda gung tuoi, cam vang va muoi bien.",
    price: 52,
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    calories: 95,
    time: 3,
    tag: "Refresh",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Ginger Sea Breeze",
        description: "Soda gừng tươi, cam vàng và muối biển.",
        tag: "Refresh",
      },
      en: {
        name: "Ginger Sea Breeze",
        description: "Fresh ginger soda with orange and sea salt rim.",
        tag: "Refresh",
      },
    },
  },
  {
    id: "fco-rice-teriyaki",
    categoryId: "cat-burger",
    name: "Com Teriyaki Ga Quay",
    description: "Ga quay sot teriyaki, rau cu va com gao lut.",
    price: 78,
    img: "https://images.unsplash.com/photo-1505935428862-770b6f24f629?auto=format&fit=crop&w=800&q=80",
    calories: 610,
    time: 12,
    tag: "Balanced",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Cơm gà Teriyaki",
        description: "Gà quay sốt teriyaki ăn kèm rau củ và gạo lứt.",
        tag: "Balanced",
      },
      en: {
        name: "Teriyaki Roast Chicken Rice",
        description: "Roasted chicken glazed in teriyaki over brown rice.",
        tag: "Balanced",
      },
    },
  },
  {
    id: "fco-noodle-bowl",
    categoryId: "cat-fried",
    name: "Noodle Bowl Saigon",
    description: "Bun luon, bo vien nuong va rau thai soi.",
    price: 72,
    img: "https://images.unsplash.com/photo-1542444459-db68bcd6ad1d?auto=format&fit=crop&w=800&q=80",
    calories: 520,
    time: 11,
    tag: "Office lunch",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Bún Saigon Bowl",
        description: "Bún lươn, bò viên nướng và rau thái sợi.",
        tag: "Office lunch",
      },
      en: {
        name: "Saigon Noodle Bowl",
        description: "Rice noodles with grilled meatballs and herbs.",
        tag: "Office lunch",
      },
    },
  },
  {
    id: "fco-milk-tea-brown",
    categoryId: "cat-drink",
    name: "Milk Tea Brown Sugar",
    description: "Tra den, sua tuoi va tran chau duong den.",
    price: 48,
    img: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
    calories: 320,
    time: 4,
    tag: "Sweet",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Sữa tươi trân châu đường đen",
        description: "Trà đen, sữa tươi và trân châu nấu đường đen.",
        tag: "Sweet",
      },
      en: {
        name: "Brown Sugar Milk Tea",
        description: "Black tea with fresh milk and brown sugar pearls.",
        tag: "Sweet",
      },
    },
  },
  {
    id: "fco-breakfast-banhmi",
    categoryId: "cat-burger",
    name: "Banh Mi Breakfast Bacon",
    description: "Trung op la, bacon xong khoi va pate nha lam.",
    price: 65,
    img: "https://images.unsplash.com/photo-1550317138-3d22d4d254c4?auto=format&fit=crop&w=800&q=80",
    calories: 540,
    time: 7,
    tag: "Breakfast",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Bánh mì breakfast bacon",
        description: "Trứng ốp la, bacon xông khói và pate nhà làm.",
        tag: "Breakfast",
      },
      en: {
        name: "Breakfast Bacon Banh Mi",
        description: "Sunny-side eggs, smoked bacon and house pâté.",
        tag: "Breakfast",
      },
    },
  },
  {
    id: "fco-coldbrew-caramel",
    categoryId: "cat-drink",
    name: "Coldbrew Caramel Foam",
    description: "Coldbrew arabica, caramel va kem muoi.",
    price: 62,
    img: "https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80",
    calories: 180,
    time: 5,
    tag: "Coffee",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Coldbrew caramel muối",
        description: "Cà phê cold brew arabica, caramel và kem muối.",
        tag: "Coffee",
      },
      en: {
        name: "Caramel Cold Brew",
        description: "Slow-steeped cold brew topped with salted caramel foam.",
        tag: "Coffee",
      },
    },
  },
  {
    id: "fco-cheesecake-passion",
    categoryId: "cat-fried",
    name: "Cheesecake Passion Fruit",
    description: "Cheesecake nuong kieu New York va sot chanh leo.",
    price: 75,
    img: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?auto=format&fit=crop&w=800&q=80",
    calories: 510,
    time: 6,
    tag: "Bakery",
    isBestSeller: false,
    translations: {
      vi: {
        name: "Cheesecake chanh leo",
        description: "Cheesecake nướng New York ăn kèm sốt chanh leo.",
        tag: "Bakery",
      },
      en: {
        name: "Passion Fruit Cheesecake",
        description: "Baked cheesecake with tangy passionfruit sauce.",
        tag: "Bakery",
      },
    },
  },
];

const dishRestaurantMap = {
  "fco-burger-blaze": "fco-central-kitchen",
  "fco-burger-truffle": "fco-central-kitchen",
  "fco-burger-veggie": "fco-central-kitchen",
  "fco-pizza-lava": "fco-central-kitchen",
  "fco-pizza-seafood": "fco-central-kitchen",
  "fco-pizza-veggie": "fco-central-kitchen",
  "fco-chicken-crispy": "fco-sky-garden",
  "fco-wings-honey": "fco-river-lounge",
  "fco-taco-fiesta": "fco-river-lounge",
  "fco-mixology-sunrise": "fco-sky-garden",
  "fco-coldbrew-orange": "fco-sky-garden",
  "fco-berry-soda": "fco-sky-garden",
  "fco-burger-korean": "fco-river-lounge",
  "fco-burger-blue": "fco-river-lounge",
  "fco-burger-double": "fco-river-lounge",
  "fco-pizza-bbq": "fco-river-lounge",
  "fco-pizza-carbonara": "fco-river-lounge",
  "fco-pizza-truffle": "fco-river-lounge",
  "fco-snack-parmesan": "fco-sky-garden",
  "fco-snack-popcorn": "fco-sky-garden",
  "fco-snack-tempura": "fco-sky-garden",
  "fco-drink-peachtea": "fco-sky-garden",
  "fco-drink-matcha": "fco-sky-garden",
  "fco-drink-tonic": "fco-sky-garden",
  "fco-salad-quinoa": "fco-garden-terrace",
  "fco-pasta-pesto": "fco-garden-terrace",
  "fco-juice-green": "fco-garden-terrace",
  "fco-banhmi-fusion": "fco-river-lounge",
  "fco-soup-lobster": "fco-river-lounge",
  "fco-dessert-tiramisu": "fco-river-lounge",
  "fco-seafood-platter": "fco-river-lounge",
  "fco-crab-pho": "fco-garden-terrace",
  "fco-soda-ginger": "fco-river-lounge",
  "fco-rice-teriyaki": "fco-garden-terrace",
  "fco-noodle-bowl": "fco-garden-terrace",
  "fco-milk-tea-brown": "fco-garden-terrace",
  "fco-breakfast-banhmi": "fco-garden-terrace",
  "fco-coldbrew-caramel": "fco-sky-garden",
  "fco-cheesecake-passion": "fco-sky-garden",
};

const dishMealTimesMap = {
  "fco-burger-blaze": ["lunch", "dinner"],
  "fco-burger-truffle": ["lunch", "dinner"],
  "fco-burger-veggie": ["breakfast", "lunch"],
  "fco-pizza-lava": ["lunch", "dinner"],
  "fco-pizza-seafood": ["lunch", "dinner"],
  "fco-pizza-veggie": ["lunch", "dinner"],
  "fco-chicken-crispy": ["lunch", "dinner"],
  "fco-wings-honey": ["lunch", "dinner"],
  "fco-taco-fiesta": ["lunch", "dinner"],
  "fco-mixology-sunrise": ["drinks", "dinner"],
  "fco-coldbrew-orange": ["breakfast", "drinks"],
  "fco-berry-soda": ["drinks"],
  "fco-burger-korean": ["lunch", "dinner"],
  "fco-burger-blue": ["lunch", "dinner"],
  "fco-burger-double": ["lunch", "dinner"],
  "fco-pizza-bbq": ["lunch", "dinner"],
  "fco-pizza-carbonara": ["lunch", "dinner"],
  "fco-pizza-truffle": ["dinner"],
  "fco-snack-parmesan": ["breakfast", "lunch"],
  "fco-snack-popcorn": ["lunch", "dinner"],
  "fco-snack-tempura": ["dinner"],
  "fco-drink-peachtea": ["breakfast", "drinks"],
  "fco-drink-matcha": ["breakfast", "drinks"],
  "fco-drink-tonic": ["drinks", "dinner"],
  "fco-salad-quinoa": ["breakfast", "lunch"],
  "fco-pasta-pesto": ["lunch", "dinner"],
  "fco-juice-green": ["breakfast", "drinks"],
  "fco-banhmi-fusion": ["lunch", "dinner"],
  "fco-soup-lobster": ["dinner"],
  "fco-dessert-tiramisu": ["dinner"],
  "fco-seafood-platter": ["dinner"],
  "fco-crab-pho": ["lunch", "dinner"],
  "fco-soda-ginger": ["drinks"],
  "fco-rice-teriyaki": ["lunch"],
  "fco-noodle-bowl": ["lunch", "dinner"],
  "fco-milk-tea-brown": ["drinks"],
  "fco-breakfast-banhmi": ["breakfast"],
  "fco-coldbrew-caramel": ["breakfast", "drinks"],
  "fco-cheesecake-passion": ["dinner"],
};

const suggestedDishIds = new Set([
  "fco-burger-blaze",
  "fco-pizza-lava",
  "fco-chicken-crispy",
  "fco-taco-fiesta",
  "fco-snack-parmesan",
  "fco-drink-peachtea",
  "fco-salad-quinoa",
  "fco-banhmi-fusion",
  "fco-seafood-platter",
  "fco-rice-teriyaki",
  "fco-breakfast-banhmi",
]);

export const menuItems = rawMenuItems.map((item) => {
  const restaurantId = dishRestaurantMap[item.id] ?? item.restaurantId ?? null;
  const mealTimes = dishMealTimesMap[item.id] ?? item.mealTimes ?? [];

  return {
    ...item,
    restaurantId,
    mealTimes,
    isSuggested:
      typeof item.isSuggested === "boolean"
        ? item.isSuggested
        : suggestedDishIds.has(item.id),
  };
});
