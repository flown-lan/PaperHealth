import React from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Platform,
} from 'react-native';
import { COLORS } from '../constants';
import { Person, ViewMode } from '../types';

interface TopBarProps {
  activePerson: Person;
  members: Person[];
  onPersonChange: (personId: string) => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
  isSelectionMode: boolean;
  selectedCount: number;
  onCancelSelection: () => void;
  onDeleteSelected?: () => void;
  onGroupSelected?: () => void;
}

export const TopBar: React.FC<TopBarProps> = ({
  activePerson,
  members,
  onPersonChange,
  searchQuery,
  onSearchChange,
  viewMode,
  onViewModeChange,
  isSelectionMode,
  selectedCount,
  onCancelSelection,
  onDeleteSelected,
  onGroupSelected,
}) => {
  if (isSelectionMode) {
    // 选择模式下的顶部栏
    return (
      <View style={styles.selectionHeader}>
        <TouchableOpacity onPress={onCancelSelection}>
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.selectionTitle}>已选择 {selectedCount} 项</Text>
        <View style={styles.selectionActions}>
          {onGroupSelected && selectedCount > 1 && (
            <TouchableOpacity 
              onPress={onGroupSelected}
              style={styles.actionButton}
            >
              <Text style={styles.actionText}>📋</Text>
            </TouchableOpacity>
          )}
          {onDeleteSelected && (
            <TouchableOpacity 
              onPress={onDeleteSelected}
              style={styles.actionButton}
            >
              <Text style={styles.actionText}>🗑️</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }

  // 正常模式下的顶部栏
  return (
    <View style={styles.container}>
      {/* 标题栏 */}
      <View style={styles.titleBar}>
        <Text style={styles.title}>PaperHealth</Text>
        <TouchableOpacity 
          onPress={() => onViewModeChange('SETTINGS')}
          style={styles.settingsButton}
        >
          <Text style={styles.settingsIcon}>⚙️</Text>
        </TouchableOpacity>
      </View>

      {/* 人员选择器 */}
      <View style={styles.personSelector}>
        {members.map((person) => (
          <TouchableOpacity
            key={person.id}
            style={[
              styles.personChip,
              activePerson.id === person.id && styles.personChipActive,
            ]}
            onPress={() => onPersonChange(person.id)}
          >
            <View
              style={[
                styles.avatar,
                { backgroundColor: person.avatarColor },
              ]}
            >
              <Text style={styles.avatarText}>
                {person.name.charAt(0)}
              </Text>
            </View>
            <Text
              style={[
                styles.personName,
                activePerson.id === person.id && styles.personNameActive,
              ]}
            >
              {person.name}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity 
          onPress={() => onViewModeChange('PERSON_MANAGE')}
          style={styles.addPersonButton}
        >
          <Text style={styles.addPersonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 搜索框 */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索医院、检查类型..."
          placeholderTextColor={COLORS.gray400}
          value={searchQuery}
          onChangeText={onSearchChange}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => onSearchChange('')}>
            <Text style={styles.clearIcon}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* 视图切换 */}
      <View style={styles.viewToggle}>
        <TouchableOpacity
          style={[
            styles.viewButton,
            viewMode === 'TIMELINE' && styles.viewButtonActive,
          ]}
          onPress={() => onViewModeChange('TIMELINE')}
        >
          <Text
            style={[
              styles.viewButtonText,
              viewMode === 'TIMELINE' && styles.viewButtonTextActive,
            ]}
          >
            📋 时间轴
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.viewButton,
            viewMode === 'SPLIT_VIEW' && styles.viewButtonActive,
          ]}
          onPress={() => onViewModeChange('SPLIT_VIEW')}
        >
          <Text
            style={[
              styles.viewButtonText,
              viewMode === 'SPLIT_VIEW' && styles.viewButtonTextActive,
            ]}
          >
            📊 分屏
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    paddingTop: Platform.OS === 'ios' ? 0 : 16,
    paddingBottom: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  titleBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: COLORS.teal600,
  },
  settingsButton: {
    padding: 4,
  },
  settingsIcon: {
    fontSize: 24,
  },
  personSelector: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  personChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    backgroundColor: COLORS.gray100,
    gap: 6,
  },
  personChipActive: {
    backgroundColor: COLORS.teal500,
  },
  avatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 12,
    fontWeight: 'bold',
  },
  personName: {
    fontSize: 14,
    color: COLORS.gray700,
    fontWeight: '500',
  },
  personNameActive: {
    color: COLORS.white,
  },
  addPersonButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: COLORS.gray100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  addPersonText: {
    fontSize: 20,
    color: COLORS.gray600,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.gray100,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    gap: 8,
  },
  searchIcon: {
    fontSize: 16,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.gray900,
    padding: 0,
  },
  clearIcon: {
    fontSize: 16,
    color: COLORS.gray400,
  },
  viewToggle: {
    flexDirection: 'row',
    gap: 8,
  },
  viewButton: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.gray100,
    alignItems: 'center',
  },
  viewButtonActive: {
    backgroundColor: COLORS.teal500,
  },
  viewButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: COLORS.gray700,
  },
  viewButtonTextActive: {
    color: COLORS.white,
  },
  // 选择模式样式
  selectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: COLORS.teal600,
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cancelText: {
    color: COLORS.white,
    fontSize: 16,
  },
  selectionTitle: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  selectionActions: {
    flexDirection: 'row',
    gap: 12,
  },
  actionButton: {
    padding: 4,
  },
  actionText: {
    fontSize: 20,
  },
});