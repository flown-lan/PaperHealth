/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  StatusBar,
  ScrollView,
  Alert,
} from 'react-native';
import { FAMILY_MEMBERS, MOCK_RECORDS, COLORS } from './src/constants';
import { ViewMode } from './src/types';
import { RecordCard } from './src/components/RecordCard';
import { TopBar } from './src/components/TopBar';
import { DetailView } from './src/components/DetailView';
import { PersonManage } from './src/components/PersonManage';
import { Settings } from './src/components/Settings';

const App: React.FC = () => {
  const [activePersonId, setActivePersonId] = useState(FAMILY_MEMBERS[0].id);
  const [members, setMembers] = useState(FAMILY_MEMBERS);
  const [records, setRecords] = useState(MOCK_RECORDS);
  const [viewMode, setViewMode] = useState<ViewMode>('TIMELINE');
  const [selectedRecordId, setSelectedRecordId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSelectionMode, setIsSelectionMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const activePerson = members.find(p => p.id === activePersonId) || members[0];

  const filteredRecords = useMemo(() => {
    return records
      .filter(r => r.patientId === activePersonId)
      .filter(r =>
        r.hospital.includes(searchQuery) ||
        r.ocrText.includes(searchQuery) ||
        r.type.includes(searchQuery)
      )
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [records, activePersonId, searchQuery]);

  const selectedRecord = records.find(r => r.id === selectedRecordId);

  const handleRecordPress = (recordId: string) => {
    if (isSelectionMode) {
      const newSelectedIds = new Set(selectedIds);
      if (newSelectedIds.has(recordId)) {
        newSelectedIds.delete(recordId);
      } else {
        newSelectedIds.add(recordId);
      }
      setSelectedIds(newSelectedIds);
    } else {
      setSelectedRecordId(recordId);
    }
  };

  const handleRecordLongPress = (recordId: string) => {
    if (!isSelectionMode) {
      setIsSelectionMode(true);
      setSelectedIds(new Set([recordId]));
    }
  };

  const handleCancelSelection = () => {
    setIsSelectionMode(false);
    setSelectedIds(new Set());
  };

  const handleDeleteSelected = () => {
    Alert.alert(
      '确认删除',
      `确定要删除 ${selectedIds.size} 条记录吗？`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            setRecords(records.filter(r => !selectedIds.has(r.id)));
            handleCancelSelection();
          },
        },
      ]
    );
  };

  const handleGroupSelected = () => {
    if (selectedIds.size < 2) {
      Alert.alert('提示', '请至少选择2条记录进行分组');
      return;
    }

    const selectedRecords = records.filter(r => selectedIds.has(r.id));
    const dates = selectedRecords.map(r => new Date(r.date).getTime());
    const minDate = new Date(Math.min(...dates));
    const maxDate = new Date(Math.max(...dates));

    Alert.alert(
      '确认分组',
      `将 ${selectedIds.size} 条记录分组？\n时间范围: ${minDate.toLocaleDateString()} - ${maxDate.toLocaleDateString()}`,
      [
        { text: '取消', style: 'cancel' },
        {
          text: '确认',
          onPress: () => {
            // TODO: 实现分组逻辑
            Alert.alert('成功', '记录已分组');
            handleCancelSelection();
          },
        },
      ]
    );
  };

  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleDeleteRecord = () => {
    if (selectedRecordId) {
      setRecords(records.filter(r => r.id !== selectedRecordId));
      setSelectedRecordId(null);
    }
  };

  const handleEditRecord = () => {
    Alert.alert('提示', '编辑功能即将开发');
  };

  const handleGenerateSummary = () => {
    Alert.alert('提示', '正在生成AI摘要...');
    // TODO: 调用AI生成摘要
  };

  const handleSaveMembers = (newMembers: typeof members) => {
    setMembers(newMembers);
    // 如果当前选中的人员被删除，切换到第一个人员
    if (!newMembers.find(m => m.id === activePersonId)) {
      setActivePersonId(newMembers[0].id);
    }
  };

  // 人员管理页面
  if (viewMode === 'PERSON_MANAGE') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <PersonManage
          members={members}
          onClose={() => setViewMode('TIMELINE')}
          onSave={handleSaveMembers}
        />
      </SafeAreaView>
    );
  }

  // 设置页面
  if (viewMode === 'SETTINGS') {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <Settings
          onClose={() => setViewMode('TIMELINE')}
          onExportData={() => Alert.alert('提示', '导出功能开发中')}
          onImportData={() => Alert.alert('提示', '导入功能开发中')}
          onClearCache={() => {}}
        />
      </SafeAreaView>
    );
  }

  // 详情页
  if (selectedRecord) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
        <DetailView
          record={selectedRecord}
          onClose={() => setSelectedRecordId(null)}
          onEdit={handleEditRecord}
          onDelete={handleDeleteRecord}
          onGenerateSummary={handleGenerateSummary}
        />
      </SafeAreaView>
    );
  }

  // 时间轴列表页
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.white} />
      
      <TopBar
        activePerson={activePerson}
        members={members}
        onPersonChange={setActivePersonId}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        viewMode={viewMode}
        onViewModeChange={handleViewModeChange}
        isSelectionMode={isSelectionMode}
        selectedCount={selectedIds.size}
        onCancelSelection={handleCancelSelection}
        onDeleteSelected={handleDeleteSelected}
        onGroupSelected={handleGroupSelected}
      />

      <ScrollView style={styles.scrollView}>
        {filteredRecords.map(record => (
          <RecordCard
            key={record.id}
            record={record}
            onPress={() => handleRecordPress(record.id)}
            onLongPress={() => handleRecordLongPress(record.id)}
            isSelected={selectedIds.has(record.id)}
            isSelectionMode={isSelectionMode}
          />
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.gray50,
  },
  scrollView: {
    flex: 1,
  },
});

export default App;
