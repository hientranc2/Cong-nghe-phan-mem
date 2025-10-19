import { StatusBar } from 'expo-status-bar';
import React from 'react';
import {
  ImageBackground,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { palette } from '@cong/theme';

const heroBackground =
  'https://images.unsplash.com/photo-1550317138-10000687a72b?auto=format&fit=crop&w=1600&q=80';

const stats = [
  { label: 'phục vụ mỗi ngày', value: '450+' },
  { label: 'món đặc trưng', value: '36' },
  { label: 'đánh giá 5★', value: '2.1K' },
];

const categories = [
  {
    icon: '🍔',
    title: 'Burger Artisan',
    description: 'Bò Mỹ nướng than, phô mai nhập khẩu và sốt signature.',
  },
  {
    icon: '🍕',
    title: 'Pizza 18 inch',
    description: 'Đế mỏng kiểu Ý, phô mai mozzarella tan chảy.',
  },
  {
    icon: '🍗',
    title: 'Gà rán & Snack',
    description: 'Gà rán phủ sốt cay, khoai phô mai và taco Mexico.',
  },
  {
    icon: '🥤',
    title: 'Đồ uống Mixology',
    description: 'Trà trái cây lạnh và cold brew rang xay mỗi ngày.',
  },
];

const highlights = [
  {
    title: 'Burger Blaze Bò Mỹ',
    description: 'Sốt phô mai cheddar, bacon giòn và hành tím caramen.',
    tag: 'Best Seller',
    price: '69K',
  },
  {
    title: 'Pizza Truffle 18"',
    description: 'Nấm truffle Ý, phô mai burrata tươi và dầu olive.',
    tag: 'Signature',
    price: '189K',
  },
  {
    title: 'Cold Brew Cam Cháy',
    description: 'Cold brew ủ lạnh 18h với syrup cam caramen.',
    tag: 'New',
    price: '59K',
  },
];

export default function App() {
  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          contentContainerStyle={styles.scrollContent}
        >
          <ImageBackground
            source={{ uri: heroBackground }}
            style={styles.hero}
            imageStyle={styles.heroImage}
          >
            <View style={styles.heroOverlay} />
            <View style={styles.heroContent}>
              <Text style={styles.heroTag}>FUSION CULINARY OUTLET</Text>
              <Text style={styles.heroTitle}>
                Trải nghiệm ẩm thực fusion giữa Tây & Á
              </Text>
              <Text style={styles.heroSubtitle}>
                Đặt bàn ngay để khám phá những món ăn thủ công và thức uống mixology được tạo tác bởi đội ngũ đầu bếp FCO.
              </Text>

              <View style={styles.heroActions}>
                <Pressable style={[styles.button, styles.primaryButton]}>
                  <Text style={styles.primaryButtonText}>Đặt bàn</Text>
                </Pressable>
                <Pressable style={[styles.button, styles.secondaryButton]}>
                  <Text style={styles.secondaryButtonText}>Khám phá menu</Text>
                </Pressable>
              </View>

              <View style={styles.heroStats}>
                {stats.map((item) => (
                  <View key={item.label} style={styles.statCard}>
                    <Text style={styles.statValue}>{item.value}</Text>
                    <Text style={styles.statLabel}>{item.label}</Text>
                  </View>
                ))}
              </View>
            </View>
          </ImageBackground>

          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>danh mục nổi bật</Text>
            <Text style={styles.sectionTitle}>Chọn phong cách cho bữa ăn của bạn</Text>
            <Text style={styles.sectionDescription}>
              Bộ sưu tập món ăn đặc trưng được tuyển chọn từ nhà hàng FCO để phù hợp với mọi khoảnh khắc.
            </Text>

            <View style={styles.categoryGrid}>
              {categories.map((category) => (
                <View key={category.title} style={styles.categoryCard}>
                  <Text style={styles.categoryIcon}>{category.icon}</Text>
                  <Text style={styles.categoryTitle}>{category.title}</Text>
                  <Text style={styles.categoryDescription}>{category.description}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionEyebrow}>ưu đãi trong tuần</Text>
            <Text style={styles.sectionTitle}>Đừng bỏ lỡ những món nổi bật</Text>
            <View style={styles.menuList}>
              {highlights.map((item) => (
                <View key={item.title} style={styles.menuCard}>
                  <View style={styles.menuHeader}>
                    <Text style={styles.menuTag}>{item.tag}</Text>
                    <Text style={styles.menuPrice}>{item.price}</Text>
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
              ))}
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: palette.background,
  },
  scrollContent: {
    paddingBottom: 32,
    gap: 28,
  },
  hero: {
    margin: 24,
    borderRadius: 28,
    overflow: 'hidden',
    shadowColor: palette['primary-dark'],
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 12,
  },
  heroImage: {
    borderRadius: 28,
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(31, 31, 31, 0.55)',
  },
  heroContent: {
    paddingHorizontal: 28,
    paddingVertical: 32,
    gap: 16,
  },
  heroTag: {
    color: palette.secondary,
    fontWeight: '700',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  heroTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    lineHeight: 34,
  },
  heroSubtitle: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 15,
    lineHeight: 22,
  },
  heroActions: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 999,
  },
  primaryButton: {
    backgroundColor: '#fff',
  },
  primaryButtonText: {
    color: palette.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  secondaryButton: {
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.55)',
    backgroundColor: 'rgba(255,255,255,0.1)',
  },
  secondaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  heroStats: {
    flexDirection: 'row',
    gap: 12,
    flexWrap: 'wrap',
    marginTop: 8,
  },
  statCard: {
    minWidth: 96,
    padding: 12,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  statValue: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(255,255,255,0.75)',
    fontSize: 12,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  section: {
    paddingHorizontal: 24,
    gap: 16,
  },
  sectionEyebrow: {
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 1.2,
    color: palette.muted,
    fontWeight: '700',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: palette.text,
    lineHeight: 30,
  },
  sectionDescription: {
    color: palette.muted,
    lineHeight: 22,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  categoryCard: {
    flexBasis: '48%',
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: 16,
    gap: 8,
    shadowColor: palette.primary,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 6,
  },
  categoryIcon: {
    fontSize: 22,
  },
  categoryTitle: {
    fontWeight: '700',
    color: palette.text,
  },
  categoryDescription: {
    color: palette.muted,
    lineHeight: 20,
  },
  menuList: {
    gap: 12,
  },
  menuCard: {
    backgroundColor: palette.surface,
    borderRadius: 20,
    padding: 18,
    gap: 8,
    shadowColor: palette.primary,
    shadowOpacity: 0.1,
    shadowRadius: 14,
    shadowOffset: { width: 0, height: 8 },
    elevation: 5,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuTag: {
    color: palette.primary,
    fontWeight: '700',
    textTransform: 'uppercase',
    fontSize: 12,
    letterSpacing: 0.6,
  },
  menuPrice: {
    color: palette.primary,
    fontWeight: '700',
    fontSize: 16,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: palette.text,
  },
  menuDescription: {
    color: palette.muted,
    lineHeight: 21,
  },
});
