import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Modal,
  Alert,
} from 'react-native';
import { MedicalRecord } from '../types';
import { COLORS } from '../constants';

interface DetailViewProps {
  record: MedicalRecord;
  onClose: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onGenerateSummary?: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const DetailView: React.FC<DetailViewProps> = ({
  record,
  onClose,
  onEdit,
  onDelete,
  onGenerateSummary,
}) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);
  const [showFullOCR, setShowFullOCR] = useState(false);

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case '生化检验':
        return COLORS.blue500;
      case 'B超报告':
        return COLORS.emerald500;
      case '处方':
        return COLORS.orange500;
      case 'CT':
        return COLORS.red500;
      case 'MR':
        return COLORS.teal500;
      case '出院报告':
        return COLORS.gray600;
      default:
        return COLORS.gray500;
    }
  };

  const handleDelete = () => {
    Alert.alert(
      '确认删除',
      '确定要删除这条记录吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            onDelete?.();
            onClose();
          },
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={styles.closeIcon}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>记录详情</Text>
        <View style={styles.headerActions}>
          {onEdit && (
            <TouchableOpacity onPress={onEdit} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>✏️</Text>
            </TouchableOpacity>
          )}
          {onDelete && (
            <TouchableOpacity onPress={handleDelete} style={styles.headerButton}>
              <Text style={styles.headerButtonText}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView style={styles.content}>
        {/* 基本信息 */}
        <View style={styles.section}>
          <View style={styles.infoRow}>
            <View style={[
              styles.typeBadge,
              { backgroundColor: getTypeColor(record.type) + '20' }
            ]}>
              <Text style={[
                styles.typeBadgeText,
                { color: getTypeColor(record.type) }
              ]}>
                {record.type}
              </Text>
            </View>
            <Text style={styles.date}>{formatDate(record.date)}</Text>
          </View>
          <Text style={styles.hospital}>{record.hospital}</Text>
          
          {record.isGrouped && record.endDate && (
            <View style={styles.groupInfo}>
              <Text style={styles.groupInfoText}>
                📋 分组记录: {formatDate(record.date)} - {formatDate(record.endDate)}
              </Text>
            </View>
          )}
        </View>

        {/* 图片展示 */}
        {record.images.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>图片 ({record.images.length})</Text>
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              style={styles.imagesScroll}
            >
              {record.images.map((img, index) => (
                <TouchableOpacity
                  key={img.id}
                  onPress={() => setSelectedImageIndex(index)}
                  style={styles.imageContainer}
                >
                  <Image
                    source={{ uri: img.url }}
                    style={styles.thumbnail}
                    resizeMode="cover"
                  />
                  <Text style={styles.imageLabel}>{img.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* AI摘要 */}
        {record.summary ? (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>AI摘要</Text>
            </View>
            <View style={styles.summaryBox}>
              <Text style={styles.summaryText}>{record.summary}</Text>
            </View>
          </View>
        ) : onGenerateSummary ? (
          <View style={styles.section}>
            <TouchableOpacity 
              style={styles.generateButton}
              onPress={onGenerateSummary}
            >
              <Text style={styles.generateButtonText}>🤖 生成AI摘要</Text>
            </TouchableOpacity>
          </View>
        ) : null}

        {/* OCR文本 */}
        {record.ocrText && (
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>识别文本</Text>
              <TouchableOpacity onPress={() => setShowFullOCR(!showFullOCR)}>
                <Text style={styles.expandButton}>
                  {showFullOCR ? '收起' : '展开'}
                </Text>
              </TouchableOpacity>
            </View>
            <View style={styles.ocrBox}>
              <Text 
                style={styles.ocrText}
                numberOfLines={showFullOCR ? undefined : 5}
              >
                {record.ocrText}
              </Text>
            </View>
          </View>
        )}
      </ScrollView>

      {/* 图片全屏查看模态框 */}
      <Modal
        visible={selectedImageIndex !== null}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setSelectedImageIndex(null)}
      >
        <View style={styles.modalContainer}>
          <TouchableOpacity 
            style={styles.modalClose}
            onPress={() => setSelectedImageIndex(null)}
          >
            <Text style={styles.modalCloseText}>✕</Text>
          </TouchableOpacity>
          
          {selectedImageIndex !== null && (
            <View style={styles.modalContent}>
              <Image
                source={{ uri: record.images[selectedImageIndex].url }}
                style={styles.fullImage}
                resizeMode="contain"
              />
              <View style={styles.imageInfo}>
                <Text style={styles.imageInfoText}>
                  {record.images[selectedImageIndex].label}
                </Text>
                <Text style={styles.imageCounter}>
                  {selectedImageIndex + 1} / {record.images.length}
                </Text>
              </View>
              
              {/* 切换按钮 */}
              <View style={styles.navigationButtons}>
                {selectedImageIndex > 0 && (
                  <TouchableOpacity
                    style={[styles.navButton, styles.navButtonLeft]}
                    onPress={() => setSelectedImageIndex(selectedImageIndex - 1)}
                  >
                    <Text style={styles.navButtonText}>←</Text>
                  </TouchableOpacity>
                )}
                {selectedImageIndex < record.images.length - 1 && (
                  <TouchableOpacity
                    style={[styles.navButton, styles.navButtonRight]}
                    onPress={() => setSelectedImageIndex(selectedImageIndex + 1)}
                  >
                    <Text style={styles.navButtonText}>→</Text>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          )}
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  closeButton: {
    padding: 4,
  },
  closeIcon: {
    fontSize: 24,
    color: COLORS.gray700,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  headerActions: {
    flexDirection: 'row',
    gap: 12,
  },
  headerButton: {
    padding: 4,
  },
  headerButtonText: {
    fontSize: 20,
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  expandButton: {
    fontSize: 14,
    color: COLORS.teal600,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  typeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  typeBadgeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  date: {
    fontSize: 16,
    color: COLORS.gray600,
  },
  hospital: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  groupInfo: {
    marginTop: 8,
    padding: 12,
    backgroundColor: COLORS.gray50,
    borderRadius: 8,
  },
  groupInfoText: {
    fontSize: 14,
    color: COLORS.gray700,
  },
  imagesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  imageContainer: {
    marginRight: 12,
  },
  thumbnail: {
    width: 120,
    height: 160,
    borderRadius: 8,
    backgroundColor: COLORS.gray100,
  },
  imageLabel: {
    marginTop: 4,
    fontSize: 12,
    color: COLORS.gray600,
    textAlign: 'center',
  },
  summaryBox: {
    backgroundColor: COLORS.teal50,
    padding: 16,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: COLORS.teal500,
  },
  summaryText: {
    fontSize: 15,
    lineHeight: 24,
    color: COLORS.gray800,
  },
  generateButton: {
    backgroundColor: COLORS.teal500,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  generateButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  ocrBox: {
    backgroundColor: COLORS.gray50,
    padding: 16,
    borderRadius: 8,
  },
  ocrText: {
    fontSize: 14,
    lineHeight: 22,
    color: COLORS.gray700,
  },
  // 模态框样式
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.95)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalClose: {
    position: 'absolute',
    top: 50,
    right: 20,
    zIndex: 10,
    padding: 8,
  },
  modalCloseText: {
    fontSize: 32,
    color: COLORS.white,
    fontWeight: 'bold',
  },
  modalContent: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT * 0.7,
  },
  imageInfo: {
    position: 'absolute',
    bottom: 100,
    left: 0,
    right: 0,
    padding: 20,
    alignItems: 'center',
  },
  imageInfoText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  imageCounter: {
    color: COLORS.white,
    fontSize: 14,
  },
  navigationButtons: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  navButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
  },
  navButtonLeft: {
    marginLeft: 20,
  },
  navButtonRight: {
    marginRight: 20,
  },
  navButtonText: {
    color: COLORS.white,
    fontSize: 28,
    fontWeight: 'bold',
  },
});