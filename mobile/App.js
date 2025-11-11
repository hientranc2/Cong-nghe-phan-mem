import React from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import { headerContent, bestSellers } from "./src/data/homepage";

const HomeHeader = () => (
  <View style={styles.header}>
    <View style={styles.headerBanner}>
      <Text style={styles.headerBannerText}>{headerContent.topMessage}</Text>
    </View>
    <View style={styles.headerMain}>
      <View style={styles.headerLogoWrapper}>
        <Text style={styles.headerLogo}>FCO</Text>
      </View>
      <View style={styles.headerTextGroup}>
        <Text style={styles.headerTitle}>Món ngon phải thử</Text>
        <Text numberOfLines={2} style={styles.headerDescription}>
          {headerContent.tagline}
        </Text>
      </View>
    </View>
  </View>
);

const BestSellerSection = () => (
  <View style={styles.section}>
    <View style={styles.sectionHeader}>
      <View>
        <Text style={styles.sectionTitle}>Món bán chạy tại FCO</Text>
        <Text style={styles.sectionDescription}>
          Chọn món yêu thích và thêm vào giỏ trong một chạm.
        </Text>
      </View>
      <TouchableOpacity>
        <Text style={styles.sectionLink}>Xem tất cả</Text>
      </TouchableOpacity>
    </View>
    <View style={styles.productGrid}>
      {bestSellers.map((item) => (
        <View key={item.id} style={styles.productCard}>
          <Image source={{ uri: item.image }} style={styles.productImage} />
          <View style={styles.productBody}>
            <Text style={styles.productTag}>{item.tag}</Text>
            <Text style={styles.productName}>{item.name}</Text>
            <Text numberOfLines={2} style={styles.productDescription}>
              {item.description}
            </Text>
          </View>
          <View style={styles.productFooter}>
            <Text style={styles.productPrice}>{item.price}k</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonLabel}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const tabs = [
  { id: "home", label: "Trang chủ", icon: "🏠", active: true },
  { id: "menu", label: "Thực đơn", icon: "🍽️" },
  { id: "promo", label: "Khuyến mãi", icon: "🎁" },
  { id: "orders", label: "Đơn hàng", icon: "🧾" },
  { id: "more", label: "Xem thêm", icon: "☰" },
];

const BottomTabBar = () => (
  <View style={styles.bottomTabBar}>
    {tabs.map((tab) => (
      <TouchableOpacity key={tab.id} style={styles.tabItem}>
        <Text
          style={[
            styles.tabIcon,
            tab.active ? styles.tabIconActive : undefined,
          ]}
        >
          {tab.icon}
        </Text>
        <Text
          style={[
            styles.tabLabel,
            tab.active ? styles.tabLabelActive : undefined,
          ]}
        >
          {tab.label}
        </Text>
      </TouchableOpacity>
    ))}
  </View>
);

const FloatingCartButton = () => (
  <TouchableOpacity style={styles.cartButton}>
    <Text style={styles.cartButtonIcon}>🛒</Text>
  </TouchableOpacity>
);

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      <ExpoStatusBar style="dark" />
      <View style={styles.screen}>
        <ScrollView contentContainerStyle={styles.content}>
          <HomeHeader />
          <BestSellerSection />
        </ScrollView>
        <FloatingCartButton />
        <BottomTabBar />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
  screen: {
    flex: 1,
    position: "relative",
    backgroundColor: "#fff8f2",
  },
  content: {
    paddingBottom: 180,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
  },
  headerBanner: {
    alignSelf: "flex-start",
    backgroundColor: "#ffe3d4",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 999,
  },
  headerBannerText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#f04e23",
  },
  headerMain: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
    gap: 16,
  },
  headerLogoWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f04e23",
    alignItems: "center",
    justifyContent: "center",
  },
  headerLogo: {
    color: "#fff",
    fontSize: 20,
    fontWeight: "700",
  },
  headerTextGroup: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#2c1e16",
  },
  headerDescription: {
    marginTop: 6,
    fontSize: 13,
    color: "#6c4c3a",
    lineHeight: 18,
  },
  section: {
    marginTop: 32,
    paddingHorizontal: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "700",
    color: "#2c1e16",
  },
  sectionDescription: {
    marginTop: 6,
    fontSize: 13,
    color: "#7b6a5f",
    lineHeight: 18,
    maxWidth: 220,
  },
  sectionLink: {
    fontSize: 13,
    fontWeight: "600",
    color: "#f04e23",
  },
  productGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 18,
  },
  productCard: {
    width: "48%",
    backgroundColor: "#fff",
    borderRadius: 24,
    overflow: "hidden",
    shadowColor: "#f6af8d",
    shadowOpacity: 0.22,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 6,
  },
  productImage: {
    width: "100%",
    height: 140,
  },
  productBody: {
    paddingHorizontal: 14,
    paddingTop: 14,
  },
  productTag: {
    color: "#f04e23",
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.6,
  },
  productName: {
    marginTop: 6,
    fontSize: 16,
    fontWeight: "700",
    color: "#2c1e16",
  },
  productDescription: {
    marginTop: 6,
    fontSize: 12,
    color: "#7b6a5f",
    lineHeight: 17,
  },
  productFooter: {
    paddingHorizontal: 14,
    paddingBottom: 16,
    paddingTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  productPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f04e23",
  },
  addButton: {
    backgroundColor: "#f04e23",
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
  },
  addButtonLabel: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 13,
  },
  bottomTabBar: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingBottom: 18,
    paddingTop: 14,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: -4 },
    shadowRadius: 12,
    elevation: 10,
  },
  tabItem: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  tabIcon: {
    fontSize: 20,
    color: "#9a8c84",
  },
  tabIconActive: {
    color: "#f04e23",
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 12,
    fontWeight: "500",
    color: "#9a8c84",
  },
  tabLabelActive: {
    color: "#f04e23",
    fontWeight: "700",
  },
  cartButton: {
    position: "absolute",
    bottom: 78,
    alignSelf: "center",
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: "#f04e23",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f04e23",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 8 },
    shadowRadius: 16,
    elevation: 12,
  },
  cartButtonIcon: {
    fontSize: 28,
    color: "#fff",
  },
});
