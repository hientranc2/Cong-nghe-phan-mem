import React from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

const quickLinks = [
  { id: "about", label: "Về chúng tôi" },
  { id: "stores", label: "Danh sách cửa hàng" },
  { id: "policy", label: "Chính sách" },
];

const socialLinks = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
];

const MoreScreen = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}
  >
    <View style={styles.linksCard}>
      {quickLinks.map((item, index) => (
        <TouchableOpacity
          key={item.id}
          style={[styles.linkRow, index < quickLinks.length - 1 && styles.linkDivider]}
          activeOpacity={0.6}
        >
          <Text style={styles.linkLabel}>{item.label}</Text>
          <Text style={styles.linkArrow}>›</Text>
        </TouchableOpacity>
      ))}
    </View>

    <View style={styles.hotlineSection}>
      <View style={styles.logoBadge}>
        <Text style={styles.logoText}>FCO</Text>
      </View>
      <Text style={styles.hotlineLabel}>Hotline hỗ trợ đặt hàng</Text>
      <Text style={styles.hotlineNumber}>1900 6008</Text>
    </View>

    <View style={styles.socialCard}>
      <Text style={styles.socialHeading}>Kết nối với chúng tôi</Text>
      <View style={styles.socialList}>
        {socialLinks.map((item) => (
          <TouchableOpacity key={item.id} style={styles.socialChip} activeOpacity={0.7}>
            <Text style={styles.socialChipLabel}>{item.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.languageButton} activeOpacity={0.7}>
        <Text style={styles.languageButtonText}>Switch to English</Text>
      </TouchableOpacity>
      <View style={styles.noticeBadge}>
        <Text style={styles.noticeText}>ĐÃ THÔNG BÁO</Text>
        <Text style={styles.noticeText}>BỘ CÔNG THƯƠNG</Text>
      </View>
    </View>
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff8f2",
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 120,
    gap: 24,
  },
  linksCard: {
    borderRadius: 20,
    backgroundColor: "#ffffff",
    paddingHorizontal: 20,
    paddingVertical: 12,
    shadowColor: "#171717",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  linkRow: {
    paddingVertical: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  linkDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "#f1f1f5",
  },
  linkLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  linkArrow: {
    fontSize: 22,
    color: "#9ca3af",
    marginLeft: 12,
  },
  hotlineSection: {
    alignItems: "center",
    gap: 8,
  },
  logoBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#f97316",
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#f97316",
    shadowOpacity: 0.4,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 20,
    elevation: 6,
  },
  logoText: {
    fontSize: 40,
    fontWeight: "800",
    color: "#ffffff",
    letterSpacing: 2,
  },
  hotlineLabel: {
    fontSize: 16,
    color: "#f97316",
    fontWeight: "600",
  },
  hotlineNumber: {
    fontSize: 28,
    fontWeight: "800",
    color: "#f97316",
    letterSpacing: 2,
  },
  socialCard: {
    borderRadius: 20,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingVertical: 24,
    alignItems: "center",
    gap: 20,
    shadowColor: "#171717",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
  },
  socialHeading: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  socialList: {
    flexDirection: "row",
    gap: 12,
  },
  socialChip: {
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: "#fff4ec",
  },
  socialChipLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#f97316",
  },
  languageButton: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: "#f97316",
  },
  languageButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f97316",
    textTransform: "uppercase",
  },
  noticeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: "#f3f4f6",
    alignItems: "center",
  },
  noticeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#4b5563",
    letterSpacing: 1,
  },
});

export default MoreScreen;
