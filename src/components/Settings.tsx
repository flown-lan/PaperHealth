import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Linking,
} from 'react-native';
import { COLORS } from '../constants';

interface SettingsProps {
  onClose: () => void;
  onExportData?: () => void;
  onImportData?: () => void;
  onClearCache?: () => void;
}

export const Settings: React.FC<SettingsProps> = ({
  onClose,
  onExportData,
  onImportData,
  onClearCache,
}) => {
  const handleExport = () => {
    Alert.alert('提示', '导出数据功能开发中...');
    onExportData?.();
  };

  const handleImport = () => {
    Alert.alert('提示', '导入数据功能开发中...');
    onImportData?.();
  };

  const handleClearCache = () => {
    Alert.alert(
      '确认清除',
      '确定要清除缓存吗？这不会删除您的医疗记录。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '清除',
          style: 'destructive',
          onPress: () => {
            onClearCache?.();
            Alert.alert('成功', '缓存已清除');
          },
        },
      ]
    );
  };

  const handleAbout = () => {
    Alert.alert(
      'PaperHealth',
      'Version 1.0.0\n\n一个帮助您管理纸质医疗档案的应用\n\n© 2025 PaperHealth Team',
      [{ text: '确定' }]
    );
  };

  const handleFeedback = () => {
    Alert.alert('提示', '反馈功能开发中...');
  };

  const handlePrivacy = () => {
    Alert.alert('隐私政策', '您的数据仅存储在本地设备，我们不会收集或上传任何个人信息。');
  };

  const SettingItem = ({ 
    icon, 
    title, 
    subtitle, 
    onPress,
    showArrow = true,
    destructive = false,
  }: {
    icon: string;
    title: string;
    subtitle?: string;
    onPress: () => void;
    showArrow?: boolean;
    destructive?: boolean;
  }) => (
    <TouchableOpacity style={styles.settingItem} onPress={onPress}>
      <View style={styles.settingLeft}>
        <Text style={styles.settingIcon}>{icon}</Text>
        <View>
          <Text style={[
            styles.settingTitle,
            destructive && styles.destructiveText
          ]}>
            {title}
          </Text>
          {subtitle && (
            <Text style={styles.settingSubtitle}>{subtitle}</Text>
          )}
        </View>
      </View>
      {showArrow && (
        <Text style={styles.arrow}>›</Text>
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.closeText}>关闭</Text>
        </TouchableOpacity>
        <Text style={styles.title}>设置</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* 数据管理 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>数据管理</Text>
          <SettingItem
            icon="📤"
            title="导出数据"
            subtitle="导出所有医疗记录"
            onPress={handleExport}
          />
          <SettingItem
            icon="📥"
            title="导入数据"
            subtitle="从备份文件导入"
            onPress={handleImport}
          />
          <SettingItem
            icon="🗑️"
            title="清除缓存"
            subtitle="清除应用缓存数据"
            onPress={handleClearCache}
            destructive
          />
        </View>

        {/* 通用 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>通用</Text>
          <SettingItem
            icon="🔔"
            title="通知设置"
            subtitle="管理提醒和通知"
            onPress={() => Alert.alert('提示', '功能开发中...')}
          />
          <SettingItem
            icon="🌐"
            title="语言"
            subtitle="简体中文"
            onPress={() => Alert.alert('提示', '功能开发中...')}
          />
          <SettingItem
            icon="🎨"
            title="主题"
            subtitle="浅色模式"
            onPress={() => Alert.alert('提示', '功能开发中...')}
          />
        </View>

        {/* 帮助与反馈 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>帮助与反馈</Text>
          <SettingItem
            icon="📖"
            title="使用帮助"
            onPress={() => Alert.alert('提示', '功能开发中...')}
          />
          <SettingItem
            icon="💬"
            title="意见反馈"
            onPress={handleFeedback}
          />
          <SettingItem
            icon="⭐"
            title="给我们评分"
            onPress={() => Alert.alert('提示', '感谢您的支持！')}
          />
        </View>

        {/* 关于 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>关于</Text>
          <SettingItem
            icon="ℹ️"
            title="关于 PaperHealth"
            subtitle="版本 1.0.0"
            onPress={handleAbout}
          />
          <SettingItem
            icon="🔒"
            title="隐私政策"
            onPress={handlePrivacy}
          />
          <SettingItem
            icon="📄"
            title="使用条款"
            onPress={() => Alert.alert('提示', '功能开发中...')}
          />
        </View>

        {/* 版本信息 */}
        <View style={styles.versionContainer}>
          <Text style={styles.versionText}>PaperHealth v1.0.0</Text>
          <Text style={styles.copyrightText}>© 2025 PaperHealth Team</Text>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  closeText: {
    fontSize: 16,
    color: COLORS.teal600,
    fontWeight: '600',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 20,
    backgroundColor: COLORS.white,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: COLORS.gray500,
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: COLORS.gray50,
    textTransform: 'uppercase',
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  settingTitle: {
    fontSize: 16,
    color: COLORS.gray900,
    fontWeight: '500',
  },
  settingSubtitle: {
    fontSize: 13,
    color: COLORS.gray500,
    marginTop: 2,
  },
  destructiveText: {
    color: COLORS.red500,
  },
  arrow: {
    fontSize: 24,
    color: COLORS.gray400,
    fontWeight: '300',
  },
  versionContainer: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  versionText: {
    fontSize: 14,
    color: COLORS.gray500,
    marginBottom: 4,
  },
  copyrightText: {
    fontSize: 12,
    color: COLORS.gray400,
  },
});