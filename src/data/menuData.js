export const categories = [
  {
    id: "cat-burger",
    slug: "burger",
    icon: "🍔",
    translations: {
      vi: {
        title: "Burger Artisan",
        description: "Bánh burger nướng than cùng nguyên liệu nhập khẩu tươi mới.",
        heroTitle: "Burger Artisan chuẩn vị lửa than",
        heroDescription:
          "Tận hưởng burger bò Mỹ nướng than, phô mai nhập khẩu và sốt signature FCO được chế biến mới mỗi ngày.",
      },
      en: {
        title: "Artisan Burgers",
        description: "Charcoal grilled burgers made with premium imported ingredients.",
        heroTitle: "Char-grilled Artisan Burgers",
        heroDescription:
          "Savor American beef patties fired over charcoal, imported cheese and our freshly made FCO signature sauce.",
      },
    },
  },
  {
    id: "cat-pizza",
    slug: "pizza",
    icon: "🍕",
    translations: {
      vi: {
        title: "Pizza 18 inch",
        description: "Đế mỏng kiểu Ý, phô mai nhập khẩu và sốt signature FCO.",
        heroTitle: "Pizza thủ công 18 inch chuẩn Ý",
        heroDescription:
          "Từ đế bột ủ lạnh 48h tới phô mai mozzarella tan chảy, mỗi chiếc pizza được nướng trên đá nóng 400°C.",
      },
      en: {
        title: "18\" Hand-tossed Pizza",
        description: "Thin-crust Italian style pizza with imported cheese and FCO signature sauce.",
        heroTitle: "Handcrafted 18\" Italian Pizza",
        heroDescription:
          "From 48-hour cold fermented dough to bubbling mozzarella, every pizza is baked on 400°C stone decks.",
      },
    },
  },
  {
    id: "cat-fried",
    slug: "fried-snack",
    icon: "🍗",
    translations: {
      vi: {
        title: "Gà rán & Snack",
        description: "Các món chiên giòn tan, sốt pha chuẩn vị chuyên gia.",
        heroTitle: "Gà rán & snack phủ sốt đặc biệt",
        heroDescription:
          "Khám phá những món gà rán cay, khoai tây phô mai và taco Mexico với công thức độc quyền tại FCO.",
      },
      en: {
        title: "Fried Chicken & Snacks",
        description: "Crispy bites paired with house crafted specialty sauces.",
        heroTitle: "Crispy Chicken & Snacks with Signature Glazes",
        heroDescription:
          "Explore spicy fried chicken, cheesy tornado fries and Mexican tacos with FCO's secret recipes.",
      },
    },
  },
  {
    id: "cat-drink",
    slug: "mixology",
    icon: "🥤",
    translations: {
      vi: {
        title: "Đồ uống mixology",
        description: "Trà trái cây, soda signature và cà phê cold brew làm mới mỗi ngày.",
        heroTitle: "Quầy đồ uống mixology tươi mới",
        heroDescription:
          "Từ trà hoa quả mát lạnh đến cold brew rang xay tại chỗ, đội ngũ bartender của FCO luôn sẵn sàng sáng tạo.",
      },
      en: {
        title: "Mixology Beverages",
        description: "Fruit teas, signature sodas and cold brew coffee crafted daily.",
        heroTitle: "Fresh Mixology Bar",
        heroDescription:
          "From refreshing fruit teas to house-roasted cold brew, our bartenders are ready to create your favorite drinks.",
      },
    },
  },
];

export const menuItems = [
  {
    id: "fco-burger-blaze",
    categoryId: "cat-burger",
    price: 69,
    img: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    calories: 520,
    time: 12,
    isBestSeller: true,
    translations: {
      vi: {
        name: "Burger Blaze Bò Mỹ",
        description:
          "Bánh burger bò Mỹ nướng than, sốt phô mai cheddar và bacon giòn.",
        tag: "Best Seller",
      },
      en: {
        name: "Blaze American Beef Burger",
        description:
          "Charcoal grilled American beef patty with cheddar cheese sauce and crispy bacon.",
        tag: "Best Seller",
      },
    },
  },
  {
    id: "fco-burger-truffle",
    categoryId: "cat-burger",
    price: 95,
    img: "https://images.unsplash.com/photo-1606755962773-0e7d4c90924c?auto=format&fit=crop&w=800&q=80",
    calories: 610,
    time: 14,
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
          "Australian beef layered with truffle cream sauce and imported gruyere cheese.",
        tag: "Chef's Choice",
      },
    },
  },
  {
    id: "fco-burger-veggie",
    categoryId: "cat-burger",
    price: 72,
    img: "https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=800&q=80",
    calories: 430,
    time: 11,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Burger Rau Củ Sốt Miso",
        description:
          "Patty đậu gà, rau củ nướng và sốt miso ngọt mặn dành cho thực khách eat clean.",
        tag: "Eat Clean",
      },
      en: {
        name: "Miso Veggie Burger",
        description:
          "Chickpea patty, roasted vegetables and sweet-savoury miso glaze for clean eaters.",
        tag: "Eat Clean",
      },
    },
  },
  {
    id: "fco-burger-kimchi",
    categoryId: "cat-burger",
    price: 78,
    img: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=800&q=80",
    calories: 540,
    time: 12,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Burger Bò Kimchi",
        description:
          "Thịt bò nướng kết hợp kimchi handmade và sốt mayo cay kiểu Hàn.",
        tag: "Fusion",
      },
      en: {
        name: "Korean Kimchi Beef Burger",
        description:
          "Grilled beef patty topped with house-made kimchi and spicy Korean mayo.",
        tag: "Fusion",
      },
    },
  },
  {
    id: "fco-burger-double",
    categoryId: "cat-burger",
    price: 109,
    img: "https://images.unsplash.com/photo-1515003197210-e0cd71810b5f?auto=format&fit=crop&w=800&q=80",
    calories: 720,
    time: 15,
    isBestSeller: true,
    translations: {
      vi: {
        name: "Burger Double Cheese XL",
        description:
          "Hai lớp patty bò Mỹ 120g, phô mai cheddar kép và sốt BBQ hun khói.",
        tag: "Mega Size",
      },
      en: {
        name: "Double Cheese XL Burger",
        description:
          "Two 120g American beef patties with double cheddar and smoky BBQ sauce.",
        tag: "Mega Size",
      },
    },
  },
  {
    id: "fco-burger-brie",
    categoryId: "cat-burger",
    price: 88,
    img: "https://images.unsplash.com/photo-1612874471028-1c1ff6c4b4fc?auto=format&fit=crop&w=800&q=80",
    calories: 560,
    time: 13,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Burger Gà Nướng Phô Mai Brie",
        description:
          "Ức gà nướng than, phô mai brie mềm và sốt mật ong mù tạt.",
        tag: "New",
      },
      en: {
        name: "Grilled Chicken Brie Burger",
        description:
          "Char-grilled chicken breast, creamy brie cheese and honey mustard glaze.",
        tag: "New",
      },
    },
  },
  {
    id: "fco-pizza-lava",
    categoryId: "cat-pizza",
    price: 119,
    img: "https://images.unsplash.com/photo-1600628422019-90c75f062526?auto=format&fit=crop&w=800&q=80",
    calories: 730,
    time: 15,
    isBestSeller: true,
    translations: {
      vi: {
        name: "Pizza Phô Mai Lava",
        description:
          "Đế mỏng kiểu Ý, phủ phô mai mozzarella lava và pepperoni cay.",
        tag: "FCO Signature",
      },
      en: {
        name: "Cheese Lava Pizza",
        description:
          "Italian thin crust topped with molten mozzarella lava and spicy pepperoni.",
        tag: "FCO Signature",
      },
    },
  },
  {
    id: "fco-pizza-seafood",
    categoryId: "cat-pizza",
    price: 135,
    img: "https://images.unsplash.com/photo-1548366086-7f1abaa0f4b4?auto=format&fit=crop&w=800&q=80",
    calories: 690,
    time: 16,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Pizza Hải Sản Đặc Biệt",
        description: "Tôm, mực và nghêu tươi với sốt kem tỏi và phô mai parmesan.",
        tag: "Premium",
      },
      en: {
        name: "Deluxe Seafood Pizza",
        description:
          "Fresh prawns, squid and clams with garlic cream sauce and parmesan cheese.",
        tag: "Premium",
      },
    },
  },
  {
    id: "fco-pizza-veggie",
    categoryId: "cat-pizza",
    price: 102,
    img: "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
    calories: 560,
    time: 14,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Pizza Rau Củ 4 Mùa",
        description: "Ớt chuông, nấm, bông cải xanh cùng phô mai ricotta nhẹ nhàng.",
        tag: "Healthy",
      },
      en: {
        name: "Four Seasons Veggie Pizza",
        description:
          "Bell peppers, mushrooms and broccoli paired with light ricotta cheese.",
        tag: "Healthy",
      },
    },
  },
  {
    id: "fco-pizza-bbq",
    categoryId: "cat-pizza",
    price: 128,
    img: "https://images.unsplash.com/photo-1548365328-9f5473428c1b?auto=format&fit=crop&w=800&q=80",
    calories: 710,
    time: 17,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Pizza Thịt Xông Khói BBQ",
        description:
          "Thịt xông khói hun khói lạnh, hành tím caramen và sốt BBQ mật ong.",
        tag: "Yêu thích",
      },
      en: {
        name: "BBQ Smoked Bacon Pizza",
        description:
          "Cold-smoked bacon, caramelised red onions and honey BBQ glaze.",
        tag: "Favorite",
      },
    },
  },
  {
    id: "fco-pizza-pesto",
    categoryId: "cat-pizza",
    price: 125,
    img: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
    calories: 640,
    time: 15,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Pizza Pesto Gà Nướng",
        description:
          "Gà nướng thảo mộc, sốt pesto basil và phô mai mozzarella tươi.",
        tag: "Chef's Pick",
      },
      en: {
        name: "Herb Chicken Pesto Pizza",
        description:
          "Herb roasted chicken, basil pesto sauce and fresh mozzarella pearls.",
        tag: "Chef's Pick",
      },
    },
  },
  {
    id: "fco-pizza-dessert",
    categoryId: "cat-pizza",
    price: 92,
    img: "https://images.unsplash.com/photo-1566843972142-a7fcb41d870a?auto=format&fit=crop&w=800&q=80",
    calories: 480,
    time: 12,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Pizza Tráng Miệng Tiramisu",
        description:
          "Đế mỏng nướng giòn, sốt mascarpone cà phê và cacao dusting.",
        tag: "Dessert",
      },
      en: {
        name: "Tiramisu Dessert Pizza",
        description:
          "Crispy thin crust with coffee mascarpone spread and cocoa dusting.",
        tag: "Dessert",
      },
    },
  },
  {
    id: "fco-chicken-crispy",
    categoryId: "cat-fried",
    price: 82,
    img: "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
    calories: 610,
    time: 10,
    isBestSeller: true,
    translations: {
      vi: {
        name: "Gà Rán Cay Đậm",
        description:
          "Gà rán sốt cay Nashville, phục vụ cùng salad bắp cải và khoai tây nghiền.",
        tag: "Hot",
      },
      en: {
        name: "Nashville Hot Fried Chicken",
        description:
          "Crispy chicken glazed with Nashville hot sauce, served with slaw and mashed potatoes.",
        tag: "Hot",
      },
    },
  },
  {
    id: "fco-wings-honey",
    categoryId: "cat-fried",
    price: 75,
    img: "https://images.unsplash.com/photo-1517940310602-26535839fe91?auto=format&fit=crop&w=800&q=80",
    calories: 520,
    time: 9,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Cánh Gà Mật Ong Bơ",
        description:
          "Cánh gà chiên giòn phủ sốt mật ong bơ và mè rang thơm lừng.",
        tag: "Sweet & Spicy",
      },
      en: {
        name: "Honey Butter Chicken Wings",
        description:
          "Crispy wings coated in honey butter glaze with toasted sesame seeds.",
        tag: "Sweet & Spicy",
      },
    },
  },
  {
    id: "fco-taco-fiesta",
    categoryId: "cat-fried",
    price: 65,
    img: "https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=800&q=80",
    calories: 450,
    time: 9,
    isBestSeller: true,
    translations: {
      vi: {
        name: "Taco Fiesta Mexico",
        description:
          "Taco bò kéo sợi, salsa xoài và sốt kem chua đặc biệt của FCO.",
        tag: "Món mới",
      },
      en: {
        name: "Fiesta Beef Tacos",
        description:
          "Shredded beef tacos with mango salsa and FCO signature crema.",
        tag: "New",
      },
    },
  },
  {
    id: "fco-fries-parmesan",
    categoryId: "cat-fried",
    price: 52,
    img: "https://images.unsplash.com/photo-1585238341570-088b0ec038f0?auto=format&fit=crop&w=800&q=80",
    calories: 390,
    time: 7,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Khoai Tây Lốc Xoáy Parmesan",
        description:
          "Khoai tây cắt xoắn, chiên giòn phủ parmesan và bột tỏi.",
        tag: "Snack",
      },
      en: {
        name: "Parmesan Tornado Fries",
        description:
          "Spiral-cut fries fried crisp then dusted with parmesan and garlic powder.",
        tag: "Snack",
      },
    },
  },
  {
    id: "fco-chicken-popcorn",
    categoryId: "cat-fried",
    price: 68,
    img: "https://images.unsplash.com/photo-1604909052743-91dbc0f7d050?auto=format&fit=crop&w=800&q=80",
    calories: 480,
    time: 8,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Gà Viên Phủ Phô Mai",
        description:
          "Gà popcorn lắc sốt phô mai cheddar và bơ tỏi.",
        tag: "Yêu thích",
      },
      en: {
        name: "Cheddar Popcorn Chicken",
        description:
          "Crispy popcorn chicken tossed in cheddar cheese dust and garlic butter.",
        tag: "Favorite",
      },
    },
  },
  {
    id: "fco-salad-coleslaw",
    categoryId: "cat-fried",
    price: 49,
    img: "https://images.unsplash.com/photo-1608039985538-4561b195eac7?auto=format&fit=crop&w=800&q=80",
    calories: 210,
    time: 5,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Salad Coleslaw Táo Xanh",
        description:
          "Bắp cải giòn, táo xanh và sốt yogurt chanh dây thanh mát.",
        tag: "Healthy",
      },
      en: {
        name: "Green Apple Coleslaw",
        description:
          "Crunchy cabbage, green apple and passionfruit yogurt dressing.",
        tag: "Healthy",
      },
    },
  },
  {
    id: "fco-mixology-sunrise",
    categoryId: "cat-drink",
    price: 49,
    img: "https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80",
    calories: 180,
    time: 3,
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
          "Orange and pineapple juice with hibiscus syrup for a vibrant gradient.",
        tag: "Bartender Pick",
      },
    },
  },
  {
    id: "fco-coldbrew-orange",
    categoryId: "cat-drink",
    price: 58,
    img: "https://images.unsplash.com/photo-1527169402691-876a38310f5f?auto=format&fit=crop&w=800&q=80",
    calories: 90,
    time: 4,
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
          "18-hour steeped cold brew with orange lemongrass syrup and signature ice cubes.",
        tag: "Limited",
      },
    },
  },
  {
    id: "fco-berry-soda",
    categoryId: "cat-drink",
    price: 45,
    img: "https://images.unsplash.com/photo-1527169402700-6209d58cf10a?auto=format&fit=crop&w=800&q=80",
    calories: 150,
    time: 2,
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
          "Blueberry and mulberry soda with fresh mint for instant refreshment.",
        tag: "Refreshing",
      },
    },
  },
  {
    id: "fco-matcha-latte",
    categoryId: "cat-drink",
    price: 52,
    img: "https://images.unsplash.com/photo-1527169402691-feff5539e52c?auto=format&fit=crop&w=800&q=80&sat=-50",
    calories: 210,
    time: 3,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Matcha Latte Kem Muối",
        description:
          "Matcha Nhật Bản whisking cùng sữa tươi và lớp kem muối béo nhẹ.",
        tag: "Best Seller",
      },
      en: {
        name: "Salted Cream Matcha Latte",
        description:
          "Ceremonial matcha whisked with fresh milk and a silky salted cream cap.",
        tag: "Best Seller",
      },
    },
  },
  {
    id: "fco-passion-tea",
    categoryId: "cat-drink",
    price: 46,
    img: "https://images.unsplash.com/photo-1527169402691-876a38310f5f?auto=format&fit=crop&w=800&q=80&sat=30",
    calories: 120,
    time: 2,
    isBestSeller: false,
    translations: {
      vi: {
        name: "Trà Chanh Dây Hạt Basil",
        description:
          "Trà ô long ủ lạnh, chanh dây tươi và hạt basil mát lạnh.",
        tag: "Tea Time",
      },
      en: {
        name: "Passionfruit Basil Seed Tea",
        description:
          "Cold brewed oolong with fresh passionfruit and cooling basil seeds.",
        tag: "Tea Time",
      },
    },
  },
  {
    id: "fco-nitro-coldbrew",
    categoryId: "cat-drink",
    price: 62,
    img: "https://images.unsplash.com/photo-1541167760496-1628856ab772?auto=format&fit=crop&w=800&q=80",
    calories: 70,
    time: 4,
    isBestSeller: true,
    translations: {
      vi: {
        name: "Nitro Cold Brew Socola",
        description:
          "Cold brew sục nitro, syrup socola đen và kem vani.",
        tag: "Special",
      },
      en: {
        name: "Nitro Chocolate Cold Brew",
        description:
          "Nitro-infused cold brew with dark chocolate syrup and vanilla cream.",
        tag: "Special",
      },
    },
  },
];
