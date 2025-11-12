import React, { useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";

import { promotions } from "../data/homepage";

const PromoCard = ({ title, content }) => (
  <View style={styles.card}>
    <Text style={styles.cardTitle}>{title}</Text>
    <Text style={styles.cardContent}>{content}</Text>
    <Text style={styles.cardLink}>Tìm hiểu thêm</Text>
  </View>
);

const PromoScreen = () => {
  const [headerHeight, setHeaderHeight] = useState(200);

  return (
    <View style={styles.container}>
      <View
        style={styles.header}
        onLayout={({ nativeEvent }) => setHeaderHeight(nativeEvent.layout.height)}
      >
        <Text style={styles.heading}>Khuyến mãi</Text>
        <Text style={styles.subheading}>Ưu đãi & chương trình thành viên</Text>
        <Text style={styles.description}>
          Tham gia FCO Rewards để không bỏ lỡ bất kỳ deal nào.
        </Text>
      </View>
      <FlatList
        data={promotions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PromoCard title={item.title} content={item.content} />
        )}
        contentContainerStyle={[
          styles.listContent,
          { paddingTop: headerHeight + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
  header: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingTop: 16,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: "#fff8f2",
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 6,
    zIndex: 10,
  },
  heading: {
    fontSize: 28,
    fontWeight: "800",
    color: "#1b1b1f",
  },
  subheading: {
    marginTop: 6,
    fontSize: 18,
    fontWeight: "600",
    color: "#f04e23",
  },
  description: {
    marginTop: 8,
    fontSize: 14,
    color: "#6b7280",
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 220,
  },
  card: {
    backgroundColor: "#ffffff",
    padding: 24,
    borderRadius: 28,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 4,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1f2937",
  },
  cardContent: {
    marginTop: 10,
    fontSize: 14,
    lineHeight: 20,
    color: "#4b5563",
  },
  cardLink: {
    marginTop: 16,
    fontSize: 14,
    fontWeight: "700",
    color: "#f97316",
  },
});

export default PromoScreen;
