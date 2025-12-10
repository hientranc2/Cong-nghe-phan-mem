import React, { useEffect, useMemo, useState } from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Dimensions,
} from "react-native";

import { resolveImageSource } from "../../utils/image";

const formatCurrency = (value) => {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    return '--';
  }

  try {
    const formatted = new Intl.NumberFormat('vi-VN').format(value);
    return formatted + ' đ';
  } catch (err) {
    return String(value) + ' đ';
  }
};



const ProductDetailModal = ({ product, visible, onClose, onAddToCart }) => {
  const [quantity, setQuantity] = useState(1);
  const [activeImage, setActiveImage] = useState(0);

  const imageSources = useMemo(() => {
    const collected = [];
    const addImage = (value) => {
      if (!value) return;
      if (!collected.includes(value)) {
        collected.push(value);
      }
    };

    addImage(product?.image);

    if (Array.isArray(product?.gallery)) {
      product.gallery.forEach(addImage);
    }

    if (Array.isArray(product?.images)) {
      product.images.forEach(addImage);
    }

    if (product?.secondaryImage) {
      addImage(product.secondaryImage);
    }

    // Nếu chưa có ảnh thứ hai, nhân bản ảnh đầu để người dùng vẫn có thể vuốt
    if (collected.length === 1) {
      collected.push(collected[0]);
    }

    return collected;
  }, [product]);

  useEffect(() => {
    if (visible) {
      setQuantity(1);
      setActiveImage(0);
    }
  }, [visible, product?.id]);

  const handleIncrease = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const totalPrice = useMemo(() => {
    if (!product) return 0;
    const unitPrice =
      typeof product.price === "number" ? product.price : Number(product.price);
    if (Number.isNaN(unitPrice)) {
      return 0;
    }
    return unitPrice * quantity;
  }, [product, quantity]);

  const handleAddToCart = () => {
    if (!product) {
      return;
    }

    onAddToCart?.(product, quantity);
  };

  const slideWidth = useMemo(() => Dimensions.get("window").width - 40, []);

  if (!product) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Chi tiết phần ăn</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Text style={styles.closeLabel}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            bounces={false}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.heroWrapper}>
              <ScrollView
                horizontal
                pagingEnabled
                decelerationRate="fast"
                snapToAlignment="center"
                snapToInterval={slideWidth}
                showsHorizontalScrollIndicator={false}
                style={[styles.heroCarousel, { width: slideWidth }]}
                onMomentumScrollEnd={(event) => {
                  const { contentOffset, layoutMeasurement } = event.nativeEvent;
                  if (layoutMeasurement?.width) {
                    const index = Math.round(contentOffset.x / layoutMeasurement.width);
                    setActiveImage(index);
                  }
                }}
              >
                {(imageSources.length > 0 ? imageSources : [product.image]).map(
                  (img, index) => (
                    <View
                      style={[styles.heroImageContainer, { width: slideWidth }]}
                      key={index}
                    >
                      <Image
                        source={resolveImageSource(img)}
                        style={styles.heroImage}
                      />
                    </View>
                  )
                )}
              </ScrollView>
              {imageSources.length > 1 ? (
                <View style={styles.dots}>
                  {imageSources.map((_, index) => (
                    <View
                      key={index}
                      style={[
                        styles.dot,
                        activeImage === index && styles.dotActive,
                      ]}
                    />
                  ))}
                </View>
              ) : null}
              {product.tag ? (
                <View style={styles.tagChip}>
                  <Text style={styles.tagText}>{product.tag}</Text>
                </View>
              ) : null}
            </View>

            <View style={styles.infoBlock}>
              <Text style={styles.productName}>{product.name}</Text>
              <Text style={styles.productDescription}>{product.description}</Text>
              <Text style={styles.productPrice}>
                {formatCurrency(
                  typeof product.price === "number" ? product.price : null
                )}
              </Text>
            </View>

            <View style={styles.sectionDivider} />

            <View style={styles.quantityBlock}>
              <Text style={styles.sectionTitle}>Số lượng</Text>
              <View style={styles.stepper}>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleDecrease}
                  style={[styles.stepperButton, quantity === 1 && styles.stepperDisabled]}
                >
                  <Text style={[styles.stepperLabel, quantity === 1 && styles.stepperDisabledLabel]}>-</Text>
                </TouchableOpacity>
                <View style={styles.stepperValueWrapper}>
                  <Text style={styles.stepperValue}>{quantity}</Text>
                </View>
                <TouchableOpacity
                  activeOpacity={0.85}
                  onPress={handleIncrease}
                  style={styles.stepperButton}
                >
                  <Text style={styles.stepperLabel}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>

          <View style={styles.bottomBar}>
            <View>
              <Text style={styles.totalLabel}>Tạm tính</Text>
              <Text style={styles.totalValue}>{formatCurrency(totalPrice)}</Text>
            </View>
            <TouchableOpacity
              activeOpacity={0.9}
              style={styles.primaryButton}
              onPress={handleAddToCart}
            >
              <Text style={styles.primaryButtonLabel}>Thêm vào giỏ hàng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1b1b1f",
  },
  closeButton: {
    height: 36,
    width: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f4f4f4",
  },
  closeLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1b1b1f",
  },
  scrollContent: {
    paddingBottom: 32,
  },
  heroWrapper: {
    marginHorizontal: 20,
    borderRadius: 20,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#fff6ed",
  },
  heroCarousel: {
    width: "100%",
  },
  heroImageContainer: {
    aspectRatio: 1.2,
    alignItems: "center",
    justifyContent: "center",
    padding: 16,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    resizeMode: "contain",
  },
  dots: {
    position: "absolute",
    bottom: 12,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.55)",
  },
  dotActive: {
    backgroundColor: "#ff5a1f",
  },
  tagChip: {
    position: "absolute",
    top: 16,
    left: 16,
    backgroundColor: "#ff5a1f",
    borderRadius: 14,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    color: "#fff",
    fontWeight: "700",
    fontSize: 12,
    textTransform: "uppercase",
  },
  infoBlock: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 12,
  },
  productName: {
    fontSize: 22,
    fontWeight: "700",
    color: "#1b1b1f",
  },
  productDescription: {
    fontSize: 15,
    lineHeight: 22,
    color: "#4a4a55",
  },
  productPrice: {
    marginTop: 6,
    fontSize: 17,
    fontWeight: "700",
    color: "#f04e23",
  },
  sectionDivider: {
    height: 8,
    backgroundColor: "#f5f5f7",
    marginTop: 28,
  },
  quantityBlock: {
    paddingHorizontal: 20,
    paddingTop: 24,
    paddingBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1b1b1f",
    marginBottom: 16,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 14,
    borderWidth: 1,
    borderColor: "#e2e2e9",
    overflow: "hidden",
  },
  stepperButton: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  stepperDisabled: {
    backgroundColor: "#f6f6f6",
  },
  stepperLabel: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff5a1f",
  },
  stepperDisabledLabel: {
    color: "#c5c5ce",
  },
  stepperValueWrapper: {
    paddingHorizontal: 24,
  },
  stepperValue: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1b1b1f",
  },
  bottomBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderTopWidth: 1,
    borderTopColor: "#ededf1",
    backgroundColor: "#fff",
  },
  totalLabel: {
    fontSize: 12,
    color: "#6d6d7a",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    color: "#ff5a1f",
    marginTop: 4,
  },
  primaryButton: {
    backgroundColor: "#ff5a1f",
    borderRadius: 16,
    paddingHorizontal: 24,
    paddingVertical: 14,
  },
  primaryButtonLabel: {
    color: "#fff",
    fontSize: 15,
    fontWeight: "700",
  },
});

export default ProductDetailModal;
