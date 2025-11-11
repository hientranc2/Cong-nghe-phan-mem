import React from "react";
import {
  SafeAreaView,
  StatusBar,
  ScrollView,
  View,
  Text,
  StyleSheet,
  ImageBackground,
  TouchableOpacity,
  Image,
} from "react-native";
import { StatusBar as ExpoStatusBar } from "expo-status-bar";
import {
  heroBackground,
  heroContent,
  headerContent,
  stats,
  categories,
  bestSellers,
  combos,
  promotions,
  aboutContent,
  footerContent,
} from "./src/data/homepage";

const SectionHeader = ({ title, description }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {description ? (
      <Text style={styles.sectionDescription}>{description}</Text>
    ) : null}
  </View>
);

const HeaderSection = () => (
  <View style={styles.header}>
    <View style={styles.headerTop}>
      <Text style={styles.headerTopText}>{headerContent.topMessage}</Text>
    </View>
    <View style={styles.headerMain}>
      <View style={styles.headerBrand}>
        <View style={styles.headerLogoWrapper}>
          <Text style={styles.headerLogo}>FCO</Text>
        </View>
        <View>
          <Text style={styles.headerBrandName}>{headerContent.brandName}</Text>
          <Text style={styles.headerTagline}>{headerContent.tagline}</Text>
        </View>
      </View>
      <View style={styles.headerActions}>
        {headerContent.actions.map((action) => (
          <View key={action.id} style={styles.headerAction}>
            <Text style={styles.headerActionIcon}>{action.icon}</Text>
            <Text style={styles.headerActionLabel}>{action.label}</Text>
          </View>
        ))}
      </View>
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.headerNav}
    >
      {headerContent.navigation.map((item) => (
        <View key={item.id} style={styles.headerNavItem}>
          <Text style={styles.headerNavLabel}>{item.label}</Text>
        </View>
      ))}
    </ScrollView>
  </View>
);

const HeroSection = () => (
  <ImageBackground
    source={{ uri: heroBackground }}
    style={styles.hero}
    imageStyle={styles.heroImage}
  >
    <View style={styles.heroOverlay} />
    <View style={styles.heroContent}>
      <Text style={styles.heroTitle}>{heroContent.title}</Text>
      <Text style={styles.heroDescription}>{heroContent.description}</Text>
      <View style={styles.heroActions}>
        <TouchableOpacity
          style={[styles.button, styles.buttonPrimary, styles.heroActionButton]}
        >
          <Text style={styles.buttonPrimaryLabel}>
            {heroContent.primaryCta}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, styles.buttonSecondary]}>
          <Text style={styles.buttonSecondaryLabel}>
            {heroContent.secondaryCta}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.heroHighlights}>
        {heroContent.highlights.map((item) => (
          <Text key={item} style={styles.heroHighlight}>
            {item}
          </Text>
        ))}
      </View>
    </View>
  </ImageBackground>
);

const StatsSection = () => (
  <View style={styles.statsSection}>
    {stats.map((stat) => (
      <View key={stat.label} style={styles.statCard}>
        <Text style={styles.statValue}>{stat.value}</Text>
        <Text style={styles.statLabel}>{stat.label}</Text>
      </View>
    ))}
  </View>
);

const CategorySection = () => (
  <View style={styles.section}>
    <SectionHeader
      title="Khám phá danh mục nổi bật"
      description="Nguyên liệu tuyển chọn mỗi sáng, chế biến tại bếp trung tâm và giao đến bạn trong thời gian nhanh nhất."
    />
    <View style={styles.categoryGrid}>
      {categories.map((category) => (
        <View key={category.id} style={styles.categoryCard}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <Text style={styles.categoryTitle}>{category.title}</Text>
          <Text style={styles.categoryDescription}>{category.description}</Text>
          <TouchableOpacity>
            <Text style={styles.link}>Xem món</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </View>
);

const BestSellerSection = () => (
  <View style={styles.section}>
    <SectionHeader
      title="Món bán chạy tại FCO"
      description="Chọn món yêu thích và thêm vào giỏ trong một chạm."
    />
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.menuList}
    >
      {bestSellers.map((item) => (
        <View key={item.id} style={styles.menuCard}>
          <Image source={{ uri: item.image }} style={styles.menuImage} />
          <View style={styles.menuBody}>
            <Text style={styles.menuTag}>{item.tag}</Text>
            <Text style={styles.menuTitle}>{item.name}</Text>
            <Text style={styles.menuDescription}>{item.description}</Text>
          </View>
          <View style={styles.menuFooter}>
            <Text style={styles.menuPrice}>{item.price}k</Text>
            <TouchableOpacity style={styles.addButton}>
              <Text style={styles.addButtonLabel}>Thêm</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </ScrollView>
  </View>
);

const ComboSection = () => (
  <View style={styles.section}>
    <SectionHeader
      title="Combo chia sẻ siêu tiết kiệm"
      description="Thiết kế riêng cho từng bữa ăn của bạn: gia đình, hẹn hò hay văn phòng."
    />
    <View style={styles.comboList}>
      {combos.map((combo) => (
        <View key={combo.id} style={styles.comboCard}>
          <View style={styles.comboBadge}>
            <Text style={styles.comboBadgeText}>{combo.badge}</Text>
          </View>
          <Text style={styles.comboTitle}>{combo.name}</Text>
          <Text style={styles.comboDescription}>{combo.desc}</Text>
          <View style={styles.comboFooter}>
            <Text style={styles.comboPrice}>{combo.price}k</Text>
            <TouchableOpacity style={styles.comboButton}>
              <Text style={styles.comboButtonLabel}>Đặt combo</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const PromotionSection = () => (
  <View style={styles.section}>
    <SectionHeader
      title="Ưu đãi & chương trình thành viên"
      description="Tham gia FCO Rewards để không bỏ lỡ bất kỳ deal nào."
    />
    <View style={styles.promotionGrid}>
      {promotions.map((promo) => (
        <View key={promo.id} style={styles.promotionCard}>
          <Text style={styles.promotionTitle}>{promo.title}</Text>
          <Text style={styles.promotionDescription}>{promo.content}</Text>
          <TouchableOpacity>
            <Text style={styles.link}>Tìm hiểu thêm →</Text>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  </View>
);

const AboutSection = () => (
  <View style={styles.section}>
    <SectionHeader title={aboutContent.heading} description={aboutContent.description} />
    <View style={styles.aboutContent}>
      <View style={styles.aboutText}>
        {aboutContent.highlights.map((item) => (
          <Text key={item} style={styles.aboutListItem}>
            {item}
          </Text>
        ))}
      </View>
      <View style={styles.aboutVisual}>
        <Image source={{ uri: aboutContent.image }} style={styles.aboutImage} />
        <View style={styles.aboutBadge}>
          <Text style={styles.aboutBadgeValue}>{aboutContent.badgeValue}</Text>
          <Text style={styles.aboutBadgeLabel}>{aboutContent.badgeLabel}</Text>
        </View>
      </View>
    </View>
  </View>
);

const FooterSection = () => {
  const year = new Date().getFullYear();
  const rightsText = footerContent.rights.replace("{year}", String(year));

  return (
    <View style={styles.footer}>
      <View style={styles.footerBrand}>
        <View style={styles.footerLogoWrapper}>
          <Text style={styles.footerLogo}>FCO</Text>
        </View>
        <View style={styles.footerTextGroup}>
          <Text style={styles.footerBrandName}>{headerContent.brandName}</Text>
          <Text style={styles.footerDescription}>{footerContent.description}</Text>
          <Text style={styles.footerAddress}>{footerContent.address}</Text>
        </View>
      </View>
      <View style={styles.footerColumns}>
        {footerContent.columns.map((column) => (
          <View key={column.title} style={styles.footerColumn}>
            <Text style={styles.footerColumnTitle}>{column.title}</Text>
            {column.items.map((item) => (
              <Text key={item} style={styles.footerColumnItem}>
                {item}
              </Text>
            ))}
          </View>
        ))}
      </View>
      <View style={styles.footerBottom}>
        <Text style={styles.footerRights}>{rightsText}</Text>
      </View>
    </View>
  );
};

export default function App() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" />
      <ExpoStatusBar style="light" />
      <ScrollView contentContainerStyle={styles.container}>
        <HeaderSection />
        <HeroSection />
        <StatsSection />
        <CategorySection />
        <BestSellerSection />
        <ComboSection />
        <PromotionSection />
        <AboutSection />
        <FooterSection />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#0b1120",
  },
  container: {
    paddingBottom: 48,
    backgroundColor: "#f8fafc",
  },
  header: {
    backgroundColor: "#0b1120",
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerTop: {
    paddingHorizontal: 20,
    paddingVertical: 6,
  },
  headerTopText: {
    color: "#94a3b8",
    fontSize: 12,
    textAlign: "center",
  },
  headerMain: {
    paddingHorizontal: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerBrand: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  headerLogoWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#f97316",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  headerLogo: {
    color: "#0b1120",
    fontSize: 20,
    fontWeight: "700",
  },
  headerBrandName: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  headerTagline: {
    color: "#cbd5f5",
    fontSize: 13,
    marginTop: 4,
  },
  headerActions: {
    flexDirection: "row",
    marginLeft: 12,
  },
  headerAction: {
    backgroundColor: "rgba(148, 163, 184, 0.18)",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginLeft: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  headerActionIcon: {
    fontSize: 16,
    marginRight: 6,
  },
  headerActionLabel: {
    color: "#e2e8f0",
    fontSize: 13,
    fontWeight: "600",
  },
  headerNav: {
    paddingHorizontal: 16,
    paddingTop: 14,
    paddingBottom: 6,
  },
  headerNavItem: {
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    marginRight: 10,
  },
  headerNavLabel: {
    color: "#f8fafc",
    fontSize: 13,
    fontWeight: "600",
    textTransform: "uppercase",
  },
  hero: {
    height: 420,
    justifyContent: "flex-end",
  },
  heroImage: {
    transform: [{ scale: 1.05 }],
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(11, 17, 32, 0.65)",
  },
  heroContent: {
    padding: 24,
  },
  heroTitle: {
    fontSize: 32,
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: 12,
  },
  heroDescription: {
    fontSize: 16,
    lineHeight: 22,
    color: "#e2e8f0",
  },
  heroActions: {
    flexDirection: "row",
    marginTop: 20,
  },
  heroActionButton: {
    marginRight: 12,
  },
  button: {
    borderRadius: 24,
    paddingVertical: 12,
    paddingHorizontal: 20,
  },
  buttonPrimary: {
    backgroundColor: "#f97316",
  },
  buttonSecondary: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },
  buttonPrimaryLabel: {
    color: "#0b1120",
    fontWeight: "600",
    fontSize: 16,
  },
  buttonSecondaryLabel: {
    color: "#e2e8f0",
    fontWeight: "600",
    fontSize: 16,
  },
  heroHighlights: {
    marginTop: 16,
    flexDirection: "row",
    flexWrap: "wrap",
  },
  heroHighlight: {
    color: "#94a3b8",
    fontSize: 14,
    marginRight: 12,
    marginBottom: 8,
  },
  statsSection: {
    backgroundColor: "#0f172a",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingVertical: 24,
    paddingHorizontal: 12,
  },
  statCard: {
    width: "45%",
    marginVertical: 12,
  },
  statValue: {
    fontSize: 26,
    fontWeight: "700",
    color: "#f97316",
  },
  statLabel: {
    color: "#e2e8f0",
    marginTop: 4,
    fontSize: 14,
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 32,
  },
  sectionHeader: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#0f172a",
  },
  sectionDescription: {
    marginTop: 8,
    color: "#475569",
    fontSize: 15,
    lineHeight: 21,
  },
  categoryGrid: {
    marginBottom: 8,
  },
  categoryCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 16,
  },
  categoryIcon: {
    fontSize: 28,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 8,
    color: "#0f172a",
  },
  categoryDescription: {
    marginTop: 6,
    color: "#475569",
    lineHeight: 20,
  },
  link: {
    marginTop: 12,
    color: "#f97316",
    fontWeight: "600",
  },
  menuList: {
    paddingRight: 20,
  },
  menuCard: {
    width: 260,
    backgroundColor: "#ffffff",
    borderRadius: 20,
    marginRight: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  menuImage: {
    width: "100%",
    height: 160,
  },
  menuBody: {
    padding: 16,
  },
  menuTag: {
    color: "#f97316",
    fontWeight: "600",
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
    marginTop: 6,
  },
  menuDescription: {
    color: "#475569",
    fontSize: 14,
    lineHeight: 19,
    marginTop: 6,
  },
  menuFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: "#e2e8f0",
  },
  menuPrice: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  addButton: {
    backgroundColor: "#0f172a",
    borderRadius: 999,
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  addButtonLabel: {
    color: "#ffffff",
    fontWeight: "600",
  },
  comboList: {
    marginBottom: 8,
  },
  comboCard: {
    backgroundColor: "#111827",
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
  },
  comboBadge: {
    backgroundColor: "rgba(249, 115, 22, 0.15)",
    alignSelf: "flex-start",
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 999,
    marginBottom: 12,
  },
  comboBadgeText: {
    color: "#f97316",
    fontWeight: "600",
  },
  comboTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
  },
  comboDescription: {
    color: "#cbd5f5",
    marginTop: 8,
    lineHeight: 20,
  },
  comboFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 20,
  },
  comboPrice: {
    color: "#f97316",
    fontSize: 20,
    fontWeight: "700",
  },
  comboButton: {
    backgroundColor: "#f97316",
    borderRadius: 999,
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  comboButtonLabel: {
    color: "#111827",
    fontWeight: "700",
  },
  promotionGrid: {
    marginBottom: 8,
  },
  promotionCard: {
    backgroundColor: "#ffffff",
    borderRadius: 16,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    marginBottom: 16,
  },
  promotionTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  promotionDescription: {
    marginTop: 8,
    color: "#475569",
    lineHeight: 20,
  },
  aboutContent: {
    backgroundColor: "#0f172a",
    borderRadius: 24,
    padding: 20,
  },
  aboutText: {
    marginBottom: 20,
  },
  aboutListItem: {
    color: "#e2e8f0",
    fontSize: 15,
    lineHeight: 22,
    marginBottom: 12,
  },
  aboutVisual: {
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
  },
  aboutImage: {
    width: "100%",
    height: 220,
  },
  aboutBadge: {
    position: "absolute",
    bottom: 16,
    right: 16,
    backgroundColor: "rgba(15, 23, 42, 0.85)",
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  aboutBadgeValue: {
    color: "#f97316",
    fontSize: 22,
    fontWeight: "700",
  },
  aboutBadgeLabel: {
    color: "#e2e8f0",
    fontSize: 12,
    marginTop: 4,
    textAlign: "center",
  },
  footer: {
    backgroundColor: "#0f172a",
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 48,
    marginTop: 32,
  },
  footerBrand: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  footerLogoWrapper: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: "#f97316",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 16,
  },
  footerLogo: {
    color: "#0b1120",
    fontSize: 22,
    fontWeight: "700",
  },
  footerTextGroup: {
    flex: 1,
  },
  footerBrandName: {
    color: "#f8fafc",
    fontSize: 18,
    fontWeight: "700",
  },
  footerDescription: {
    color: "#cbd5f5",
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
  },
  footerAddress: {
    color: "#94a3b8",
    fontSize: 13,
    marginTop: 10,
  },
  footerColumns: {
    marginTop: 28,
  },
  footerColumn: {
    marginBottom: 20,
  },
  footerColumnTitle: {
    color: "#f97316",
    fontSize: 15,
    fontWeight: "700",
    marginBottom: 10,
  },
  footerColumnItem: {
    color: "#e2e8f0",
    fontSize: 14,
    marginBottom: 6,
  },
  footerBottom: {
    marginTop: 32,
    borderTopWidth: 1,
    borderTopColor: "rgba(148, 163, 184, 0.2)",
    paddingTop: 16,
  },
  footerRights: {
    color: "#64748b",
    fontSize: 12,
    textAlign: "center",
  },
});
