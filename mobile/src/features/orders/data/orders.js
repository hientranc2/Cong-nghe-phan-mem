export const activeOrders = [
  {
    id: "order-1762982787477",
    code: "ORD-1762982787477",
    restaurantName: "Tia Taco Fiesta Mexico",
    placedAt: "11/03/2024, 4:56:27 AM",
    totalAmount: "65k",
    status: {
      label: "Đang giao",
      description: "Tài xế đang trên đường giao món",
      color: "#f97316",
    },
    actions: [
      { id: "cancel", label: "Hủy đơn hàng", variant: "secondary" },
      { id: "view", label: "Xem lộ trình", variant: "ghost" },
      { id: "track", label: "Theo dõi hành trình", variant: "primary" },
    ],
  },
];
