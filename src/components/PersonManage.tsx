import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { Person } from '../types';
import { COLORS } from '../constants';

interface PersonManageProps {
  members: Person[];
  onClose: () => void;
  onSave: (members: Person[]) => void;
}

const AVATAR_COLORS = [
  COLORS.blue500,
  COLORS.emerald500,
  COLORS.orange500,
  COLORS.red500,
  COLORS.teal500,
  COLORS.gray600,
];

export const PersonManage: React.FC<PersonManageProps> = ({
  members,
  onClose,
  onSave,
}) => {
  const [editingMembers, setEditingMembers] = useState<Person[]>([...members]);
  const [newMemberName, setNewMemberName] = useState('');

  const handleAddMember = () => {
    if (!newMemberName.trim()) {
      Alert.alert('提示', '请输入姓名');
      return;
    }

    const newMember: Person = {
      id: `p${Date.now()}`,
      name: newMemberName.trim(),
      avatarColor: AVATAR_COLORS[editingMembers.length % AVATAR_COLORS.length],
    };

    setEditingMembers([...editingMembers, newMember]);
    setNewMemberName('');
  };

  const handleDeleteMember = (id: string) => {
    if (editingMembers.length <= 1) {
      Alert.alert('提示', '至少需要保留一个成员');
      return;
    }

    Alert.alert(
      '确认删除',
      '确定要删除这个成员吗？相关的医疗记录不会被删除。',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: () => {
            setEditingMembers(editingMembers.filter(m => m.id !== id));
          },
        },
      ]
    );
  };

  const handleUpdateName = (id: string, newName: string) => {
    setEditingMembers(
      editingMembers.map(m =>
        m.id === id ? { ...m, name: newName } : m
      )
    );
  };

  const handleChangeColor = (id: string) => {
    const member = editingMembers.find(m => m.id === id);
    if (!member) return;

    const currentIndex = AVATAR_COLORS.indexOf(member.avatarColor);
    const nextColor = AVATAR_COLORS[(currentIndex + 1) % AVATAR_COLORS.length];

    setEditingMembers(
      editingMembers.map(m =>
        m.id === id ? { ...m, avatarColor: nextColor } : m
      )
    );
  };

  const handleSave = () => {
    const hasEmptyName = editingMembers.some(m => !m.name.trim());
    if (hasEmptyName) {
      Alert.alert('提示', '所有成员必须有姓名');
      return;
    }

    onSave(editingMembers);
    onClose();
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onClose}>
          <Text style={styles.cancelText}>取消</Text>
        </TouchableOpacity>
        <Text style={styles.title}>管理成员</Text>
        <TouchableOpacity onPress={handleSave}>
          <Text style={styles.saveText}>保存</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        {/* 成员列表 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>家庭成员</Text>
          {editingMembers.map((member) => (
            <View key={member.id} style={styles.memberItem}>
              <TouchableOpacity
                style={[styles.avatar, { backgroundColor: member.avatarColor }]}
                onPress={() => handleChangeColor(member.id)}
              >
                <Text style={styles.avatarText}>
                  {member.name.charAt(0) || '?'}
                </Text>
              </TouchableOpacity>
              <TextInput
                style={styles.nameInput}
                value={member.name}
                onChangeText={(text) => handleUpdateName(member.id, text)}
                placeholder="输入姓名"
                placeholderTextColor={COLORS.gray400}
              />
              <TouchableOpacity
                onPress={() => handleDeleteMember(member.id)}
                style={styles.deleteButton}
              >
                <Text style={styles.deleteText}>🗑️</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* 添加新成员 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>添加新成员</Text>
          <View style={styles.addMemberContainer}>
            <TextInput
              style={styles.addInput}
              value={newMemberName}
              onChangeText={setNewMemberName}
              placeholder="输入新成员姓名"
              placeholderTextColor={COLORS.gray400}
              onSubmitEditing={handleAddMember}
            />
            <TouchableOpacity
              style={styles.addButton}
              onPress={handleAddMember}
            >
              <Text style={styles.addButtonText}>添加</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 提示信息 */}
        <View style={styles.hintContainer}>
          <Text style={styles.hintText}>💡 点击头像可以更换颜色</Text>
        </View>
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray200,
  },
  cancelText: {
    fontSize: 16,
    color: COLORS.gray600,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.gray900,
  },
  saveText: {
    fontSize: 16,
    color: COLORS.teal600,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.gray900,
    marginBottom: 16,
  },
  memberItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.gray100,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: COLORS.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
  nameInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.gray900,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: COLORS.gray50,
    borderRadius: 8,
  },
  deleteButton: {
    marginLeft: 12,
    padding: 8,
  },
  deleteText: {
    fontSize: 20,
  },
  addMemberContainer: {
    flexDirection: 'row',
    gap: 12,
  },
  addInput: {
    flex: 1,
    fontSize: 16,
    color: COLORS.gray900,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: COLORS.gray50,
    borderRadius: 8,
  },
  addButton: {
    backgroundColor: COLORS.teal500,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    justifyContent: 'center',
  },
  addButtonText: {
    color: COLORS.white,
    fontSize: 16,
    fontWeight: '600',
  },
  hintContainer: {
    margin: 16,
    padding: 12,
    backgroundColor: COLORS.teal50,
    borderRadius: 8,
  },
  hintText: {
    fontSize: 14,
    color: COLORS.gray700,
  },
});