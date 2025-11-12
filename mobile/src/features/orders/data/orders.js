export const activeOrders = [
  {
    id: "order-1762982787477",
    code: "ORD-1762982787477",
    restaurantName: "Tia Taco Fiesta Mexico",
    placedAt: "11/03/2024, 4:56:27 AM",
    totalAmount: "65k",
    status: {
      label: "Drone đang giao",
      description:
        "Drone giao hàng đang trên đường đến điểm giao, bạn có thể theo dõi trực tiếp.",
      color: "#f97316",
    },
    actions: [
      { id: "cancel", label: "Hủy đơn hàng", variant: "secondary" },
      { id: "summary", label: "Xem tóm tắt", variant: "ghost" },
      { id: "track", label: "Theo dõi hành trình", variant: "primary" },
    ],
  },
];
