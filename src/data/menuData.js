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

export const menuItems = [
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
    img: "https://images.unsplash.com/photo-1606755962773-0e7d4c90924c?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1600628422019-90c75f062526?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1548366086-7f1abaa0f4b4?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1517940310602-26535839fe91?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1527169402691-876a38310f5f?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1527169402700-6209d58cf10a?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1526139495367-6105411b8a51?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1612874472184-02475d82c7b7?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1541746972996-4e0b0f43e02a?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1588166746301-cc3f5c38de4b?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1548943487-a2e4e43b4853?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80",
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
    img: "https://images.unsplash.com/photo-1587731359975-81f1e87d21b4?auto=format&fit=crop&w=800&q=80",
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
];
