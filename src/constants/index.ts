import { DocType, MedicalRecord, Person } from '../types';

export const COLORS = {
  teal50: '#f0fdfa',
  teal100: '#ccfbf1',
  teal200: '#99f6e4',
  teal500: '#14b8a6',
  teal600: '#0d9488',
  teal700: '#0f766e',
  gray50: '#f9fafb',
  gray100: '#f3f4f6',
  gray200: '#e5e7eb',
  gray300: '#d1d5db',
  gray400: '#9ca3af',
  gray500: '#6b7280',
  gray600: '#4b5563',
  gray700: '#374151',
  gray800: '#1f2937',
  gray900: '#111827',
  red500: '#ef4444',
  red50: '#fef2f2',
  blue500: '#3b82f6',
  emerald500: '#10b981',
  orange500: '#f97316',
  white: '#ffffff',
  black: '#000000',
};

export const FAMILY_MEMBERS: Person[] = [
  { id: 'p1', name: '张三', avatarColor: COLORS.blue500 },
  { id: 'p2', name: '李四', avatarColor: COLORS.emerald500 },
  { id: 'p3', name: '王五', avatarColor: COLORS.orange500 },
];

export const MOCK_RECORDS: MedicalRecord[] = [
  {
    id: 'r1',
    patientId: 'p1',
    date: '2025-11-01',
    hospital: '广东省人民医院',
    type: DocType.LAB_TEST,
    images: [
      { id: 'i1', url: 'https://picsum.photos/400/600?random=1', label: '生化检验' },
      { id: 'i2', url: 'https://picsum.photos/400/600?random=2', label: '血常规' }
    ],
    ocrText: "白细胞计数 12.5... 中性粒细胞比率..."
  },
  {
    id: 'r2',
    patientId: 'p1',
    date: '2025-10-15',
    hospital: '中山大学附属第一医院',
    type: DocType.ULTRASOUND,
    images: [
      { id: 'i3', url: 'https://picsum.photos/400/600?random=3', label: '腹部B超' }
    ],
    ocrText: "肝脏形态正常... 胆囊未见异常..."
  },
  {
    id: 'r3',
    patientId: 'p2',
    date: '2025-09-20',
    hospital: '南方医科大学南方医院',
    type: DocType.PRESCRIPTION,
    images: [
      { id: 'i4', url: 'https://picsum.photos/400/600?random=4', label: '处方单' }
    ],
    ocrText: "阿莫西林胶囊 0.5g... 每日3次..."
  },
];