import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import HomeHeader from "../components/HomeHeader.jsx";
import BestSellerSection from "../components/product/BestSellerSection.jsx";
import FloatingCartButton from "../components/FloatingCartButton.jsx";
import BottomTabBar from "../components/BottomTabBar.jsx";
import MenuScreen from "./MenuScreen.jsx";
import PromoScreen from "./PromoScreen.jsx";
import MoreScreen from "./MoreScreen.jsx";
import ProductDetailModal from "../components/product/ProductDetailModal.jsx";
import CartSuccessModal from "../components/feedback/CartSuccessModal.jsx";
import { useCart } from "../context/CartContext.jsx";
import OrdersScreen from "../features/orders/screens/OrdersScreen.jsx";

import { bestSellers } from "../data/homepage";
import { menuItems } from "../data/menu";

const HOME_TAB = "home";
const MENU_TAB = "menu";
const PROMO_TAB = "promo";
const ORDERS_TAB = "orders";
const MORE_TAB = "more";

const HomeScreen = ({
  onPressLogin,
  user,
  onViewCart,
  initialTab = HOME_TAB,
  orders,
  onOrdersChange,
  onOrderAction,
  onTabChange,
}) => {
  const [activeTab, setActiveTab] = useState(initialTab ?? HOME_TAB);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [confirmation, setConfirmation] = useState({
    visible: false,
    productName: "",
    quantity: 0,
  });
  const { addToCart } = useCart();

  useEffect(() => {
    if (!initialTab) {
      return;
    }

    setActiveTab((current) => (current === initialTab ? current : initialTab));
  }, [initialTab]);

  const handleTabPress = useCallback(
    (tabId) => {
      if (
        tabId === MENU_TAB ||
        tabId === PROMO_TAB ||
        tabId === HOME_TAB ||
        tabId === ORDERS_TAB ||
        tabId === MORE_TAB
      ) {
        setActiveTab(tabId);
        if (typeof onTabChange === "function") {
          onTabChange(tabId);
        }
        return;
      }

      setActiveTab(HOME_TAB);
      if (typeof onTabChange === "function") {
        onTabChange(HOME_TAB);
      }
    },
    [onTabChange]
  );

  const handleBackToHome = useCallback(() => {
    setActiveTab(HOME_TAB);
    if (typeof onTabChange === "function") {
      onTabChange(HOME_TAB);
    }
  }, [onTabChange]);

  const handleProductPress = useCallback((product) => {
    setSelectedProductId(product?.id ?? null);
  }, []);

  const handleCloseModal = useCallback(() => {
    setSelectedProductId(null);
  }, []);

  const handleShowConfirmation = useCallback((product, quantity) => {
    if (!product) {
      return;
    }

    setConfirmation({
      visible: true,
      productName: product.name,
      quantity,
    });
  }, []);

  const handleHideConfirmation = useCallback(() => {
    setConfirmation((prev) => ({ ...prev, visible: false }));
  }, []);

  const handleViewCart = useCallback(() => {
    if (typeof onViewCart === "function") {
      onViewCart();
    }
  }, [onViewCart]);

  const handleAddToCart = useCallback(
    (product, quantity = 1) => {
      if (!product) {
        return;
      }

      const result = addToCart(product, quantity);
      handleShowConfirmation(result.product ?? product, result.quantity ?? quantity);
    },
    [addToCart, handleShowConfirmation]
  );

  const handleModalAdd = useCallback(
    (product, quantity) => {
      handleAddToCart(product, quantity);
      handleCloseModal();
    },
    [handleAddToCart, handleCloseModal]
  );

  const productLookup = useMemo(() => {
    const lookup = new Map();
    [...bestSellers, ...menuItems].forEach((item) => {
      lookup.set(item.id, item);
    });
    return lookup;
  }, []);

  const selectedProduct = selectedProductId
    ? productLookup.get(selectedProductId) ?? null
    : null;

  return (
    <View style={styles.screen}>
      {activeTab === MENU_TAB ? (
        <MenuScreen
          onProductPress={handleProductPress}
          onAddToCart={handleAddToCart}
        />
      ) : activeTab === PROMO_TAB ? (
        <PromoScreen />
      ) : activeTab === ORDERS_TAB ? (
        <OrdersScreen
          onBackToHome={handleBackToHome}
          orders={orders}
          onOrdersChange={onOrdersChange}
          onActionPress={onOrderAction}
        />
      ) : activeTab === MORE_TAB ? (
        <MoreScreen />
      ) : (
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.content}
          stickyHeaderIndices={[0]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerWrapper}>
            <HomeHeader onLoginPress={onPressLogin} user={user} />
          </View>
          <BestSellerSection
            onProductPress={handleProductPress}
            onAddToCart={handleAddToCart}
          />
        </ScrollView>
      )}
      <FloatingCartButton onPress={handleViewCart} />
      <BottomTabBar activeTab={activeTab} onTabPress={handleTabPress} />
      <ProductDetailModal
        product={selectedProduct}
        visible={Boolean(selectedProduct)}
        onClose={handleCloseModal}
        onAddToCart={handleModalAdd}
      />
      <CartSuccessModal
        visible={confirmation.visible}
        productName={confirmation.productName}
        quantity={confirmation.quantity}
        onDismiss={handleHideConfirmation}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff8f2",
  },
  scroll: {
    flex: 1,
  },
  content: {
    paddingBottom: 180,
  },
  headerWrapper: {
    zIndex: 10,
    backgroundColor: "#f97316",
  },
});

export default HomeScreen;
