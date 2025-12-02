import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { MedicalRecord } from '../types';
import { COLORS } from '../constants';

interface RecordCardProps {
  record: MedicalRecord;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  isSelectionMode?: boolean;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_PADDING = 16;
const CARD_WIDTH = SCREEN_WIDTH - CARD_PADDING * 2;

export const RecordCard: React.FC<RecordCardProps> = ({
  record,
  onPress,
  onLongPress,
  isSelected = false,
  isSelectionMode = false,
}) => {
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

  return (
    <TouchableOpacity
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={0.7}
    >
      {/* 选择指示器 */}
      {isSelectionMode && (
        <View style={styles.selectionIndicator}>
          <View style={[
            styles.checkbox,
            isSelected && styles.checkboxSelected,
          ]}>
            {isSelected && (
              <Text style={styles.checkmark}>✓</Text>
            )}
          </View>
        </View>
      )}

      {/* 卡片头部 */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={[
            styles.typeBadge,
            { backgroundColor: getTypeColor(record.type) + '20' }
          ]}>
            <Text style={[
              styles.typeText,
              { color: getTypeColor(record.type) }
            ]}>
              {record.type}
            </Text>
          </View>
          <Text style={styles.date}>{formatDate(record.date)}</Text>
        </View>
      </View>

      {/* 医院名称 */}
      <Text style={styles.hospital}>{record.hospital}</Text>

      {/* 图片预览 */}
      {record.images.length > 0 && (
        <View style={styles.imagesContainer}>
          {record.images.slice(0, 3).map((img, index) => (
            <View key={img.id} style={styles.imageWrapper}>
              <Image
                source={{ uri: img.url }}
                style={styles.image}
                resizeMode="cover"
              />
              {index === 2 && record.images.length > 3 && (
                <View style={styles.imageOverlay}>
                  <Text style={styles.imageOverlayText}>
                    +{record.images.length - 3}
                  </Text>
                </View>
              )}
            </View>
          ))}
        </View>
      )}

      {/* OCR 文本预览 */}
      {record.ocrText && (
        <Text style={styles.ocrText} numberOfLines={2}>
          {record.ocrText}
        </Text>
      )}

      {/* 摘要 */}
      {record.summary && (
        <View style={styles.summaryContainer}>
          <Text style={styles.summaryLabel}>AI摘要</Text>
          <Text style={styles.summaryText} numberOfLines={2}>
            {record.summary}
          </Text>
        </View>
      )}

      {/* 分组标识 */}
      {record.isGrouped && record.endDate && (
        <View style={styles.groupBadge}>
          <Text style={styles.groupBadgeText}>
            📋 {formatDate(record.date)} - {formatDate(record.endDate)}
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: CARD_PADDING,
    marginVertical: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedContainer: {
    borderWidth: 2,
    borderColor: COLORS.teal500,
    backgroundColor: COLORS.teal50,
  },
  selectionIndicator: {
    position: 'absolute',
    top: 12,
    right: 12,
    zIndex: 10,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: COLORS.gray300,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxSelected: {
    backgroundColor: COLORS.teal500,
    borderColor: COLORS.teal500,
  },
  checkmark: {
    color: COLORS.white,
    fontSize: 14,
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  typeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  date: {
    fontSize: 14,
    color: COLORS.gray600,
  },
  hospital: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray800,
    marginBottom: 12,
  },
  imagesContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  imageWrapper: {
    flex: 1,
    aspectRatio: 3 / 4,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: COLORS.gray100,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageOverlayText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  ocrText: {
    fontSize: 14,
    color: COLORS.gray600,
    lineHeight: 20,
    marginBottom: 8,
  },
  summaryContainer: {
    backgroundColor: COLORS.teal50,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.teal500,
  },
  summaryLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: COLORS.teal700,
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: COLORS.gray700,
    lineHeight: 20,
  },
  groupBadge: {
    marginTop: 8,
    backgroundColor: COLORS.gray100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  groupBadgeText: {
    fontSize: 12,
    color: COLORS.gray600,
  },
});