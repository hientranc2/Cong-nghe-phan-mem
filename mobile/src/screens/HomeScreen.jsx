import React, { useCallback, useMemo, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";

import HomeHeader from "../components/HomeHeader.jsx";
import BestSellerSection from "../components/product/BestSellerSection.jsx";
import FloatingCartButton from "../components/FloatingCartButton.jsx";
import BottomTabBar from "../components/BottomTabBar.jsx";
import MenuScreen from "./MenuScreen.jsx";
import ProductDetailModal from "../components/product/ProductDetailModal.jsx";
import CartSuccessModal from "../components/feedback/CartSuccessModal.jsx";

import { useCart } from "../context/CartContext.jsx";

import { bestSellers } from "../data/homepage";
import { menuItems } from "../data/menu";

const HOME_TAB = "home";
const MENU_TAB = "menu";

const HomeScreen = ({ onPressLogin, user }) => {
  const [activeTab, setActiveTab] = useState(HOME_TAB);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [confirmation, setConfirmation] = useState({
    visible: false,
    productName: "",
    quantity: 0,
  });
  const { addToCart } = useCart();

  const handleTabPress = useCallback((tabId) => {
    setActiveTab(tabId === MENU_TAB ? MENU_TAB : HOME_TAB);
  }, []);

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
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <HomeHeader onLoginPress={onPressLogin} user={user} />
          <BestSellerSection
            onProductPress={handleProductPress}
            onAddToCart={handleAddToCart}
          />
        </ScrollView>
      )}
      <FloatingCartButton />
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
  content: {
    paddingBottom: 180,
  },
});

export default HomeScreen;
