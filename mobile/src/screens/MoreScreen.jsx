import React, { useMemo, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
} from "react-native";

const quickLinks = [
  { id: "about", label: "Về chúng tôi" },
  { id: "policy", label: "Chính sách" },
];

const infoSections = [
  {
    id: "about",
    title: "Về chúng tôi",
    description: [
      "FoodCourt Online (FCO) là nền tảng giao món giúp kết nối người dùng với hàng chục gian hàng ẩm thực trong cùng một lần đặt.",
      "Chúng tôi hợp tác với các thương hiệu uy tín và đội ngũ giao nhận dày dặn kinh nghiệm để mang tới trải nghiệm đặt món tiện lợi, nhanh chóng và an toàn.",
    ],
    highlights: [
      { id: "partners", label: "Gian hàng đối tác", value: "50+" },
      { id: "cities", label: "Tỉnh/Thành", value: "10+" },
      { id: "support", label: "Hỗ trợ", value: "24/7" },
    ],
  },
  {
    id: "policy",
    title: "Chính sách",
    description: [
      "Chúng tôi đặt trải nghiệm khách hàng lên hàng đầu với các chính sách minh bạch, dễ hiểu và luôn được cập nhật.",
    ],
    bullets: [
      "Giao hàng tiêu chuẩn trong 30 - 45 phút cùng khả năng theo dõi hành trình theo thời gian thực.",
      "Hoàn tiền hoặc đổi món nếu sản phẩm giao sai, hư hỏng hoặc không đạt chất lượng cam kết.",
      "Bảo vệ dữ liệu cá nhân bằng mã hóa và xác thực nhiều lớp, chỉ sử dụng cho mục đích chăm sóc khách hàng.",
    ],
  },
];

const socialLinks = [
  { id: "facebook", label: "Facebook" },
  { id: "instagram", label: "Instagram" },
];

const MoreScreen = ({ user, onLogout }) => {
  const [activeSectionId, setActiveSectionId] = useState(null);
  const isLoggedIn = Boolean(user);
  const displayName =
    (user?.fullName && user.fullName.trim()) ||
    (user?.phone && user.phone.trim()) ||
    (user?.email && user.email.trim()) ||
    "Quý khách";

  const activeSection = useMemo(
    () => infoSections.find((section) => section.id === activeSectionId) ?? null,
    [activeSectionId]
  );

  const handleLogoutPress = () => {
    if (typeof onLogout === "function") {
      onLogout();
    }
  };

  const handleOpenSection = (sectionId) => {
    setActiveSectionId(sectionId);
  };

  const handleBackToMore = () => {
    setActiveSectionId(null);
  };

  if (activeSection) {
    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity style={styles.backButton} activeOpacity={0.7} onPress={handleBackToMore}>
          <Text style={styles.backIcon}>‹</Text>
          <Text style={styles.backLabel}>Quay lại</Text>
        </TouchableOpacity>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>{activeSection.title}</Text>
          {activeSection.description?.map((paragraph, index) => (
            <Text key={`${activeSection.id}-paragraph-${index}`} style={styles.infoParagraph}>
              {paragraph}
            </Text>
          ))}
          {activeSection.highlights && (
            <View style={styles.highlightRow}>
              {activeSection.highlights.map((highlight) => (
                <View key={highlight.id} style={styles.highlightItem}>
                  <Text style={styles.highlightValue}>{highlight.value}</Text>
                  <Text style={styles.highlightLabel}>{highlight.label}</Text>
                </View>
              ))}
            </View>
          )}
          {activeSection.bullets && (
            <View style={styles.policyList}>
              {activeSection.bullets.map((bullet, index) => (
                <View key={`${activeSection.id}-bullet-${index}`} style={styles.policyItem}>
                  <View style={styles.policyBullet} />
                  <Text style={styles.policyText}>{bullet}</Text>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    );
  }

  return (
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
            onPress={() => handleOpenSection(item.id)}
          >
            <View>
              <Text style={styles.linkLabel}>{item.label}</Text>
              <Text style={styles.linkSubLabel}>
                {item.id === "about"
                  ? "Tìm hiểu thêm về FoodCourt Online"
                  : "Xem chi tiết các cam kết dịch vụ"}
              </Text>
            </View>
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
        {isLoggedIn && (
          <View style={styles.accountCard}>
            <Text style={styles.accountGreeting}>Xin chào,</Text>
            <Text style={styles.accountName}>{displayName}</Text>
            <TouchableOpacity
              style={styles.logoutButton}
              activeOpacity={0.8}
              onPress={handleLogoutPress}
            >
              <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </View>
        )}
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
};

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
  backButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  backIcon: {
    fontSize: 22,
    color: "#f97316",
  },
  backLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#f97316",
    textTransform: "uppercase",
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
    fontWeight: "700",
    color: "#1f2937",
  },
  linkSubLabel: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 4,
  },
  linkArrow: {
    fontSize: 22,
    color: "#9ca3af",
    marginLeft: 12,
  },
  infoCard: {
    borderRadius: 20,
    backgroundColor: "#ffffff",
    paddingHorizontal: 24,
    paddingVertical: 24,
    shadowColor: "#171717",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 10 },
    shadowRadius: 20,
    elevation: 4,
    gap: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#f97316",
  },
  infoParagraph: {
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
  },
  highlightRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
  },
  highlightItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 16,
    backgroundColor: "#fff4ec",
    marginHorizontal: 4,
  },
  highlightValue: {
    fontSize: 20,
    fontWeight: "800",
    color: "#f97316",
  },
  highlightLabel: {
    fontSize: 12,
    color: "#6b7280",
    marginTop: 4,
  },
  policyList: {
    marginTop: 4,
    gap: 8,
  },
  policyItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  policyBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f97316",
    marginTop: 7,
  },
  policyText: {
    flex: 1,
    fontSize: 14,
    color: "#4b5563",
    lineHeight: 20,
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
  accountCard: {
    width: "100%",
    borderRadius: 16,
    backgroundColor: "#fff4ec",
    paddingHorizontal: 16,
    paddingVertical: 16,
    gap: 6,
  },
  accountGreeting: {
    fontSize: 13,
    color: "#6b7280",
  },
  accountName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#f97316",
  },
  logoutButton: {
    marginTop: 12,
    backgroundColor: "#f97316",
    paddingVertical: 12,
    borderRadius: 999,
    alignItems: "center",
  },
  logoutButtonText: {
    color: "#ffffff",
    fontWeight: "700",
    textTransform: "uppercase",
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
