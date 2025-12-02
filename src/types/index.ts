export enum DocType {
  LAB_TEST = '生化检验',
  ULTRASOUND = 'B超报告',
  PRESCRIPTION = '处方',
  CT_SCAN = 'CT',
  MRI = 'MR',
  DISCHARGE_SUMMARY = '出院报告',
  OTHER = '其他'
}

export interface ImageAttachment {
  id: string;
  url: string;
  label: string; 
}

export interface MedicalRecord {
  id: string;
  patientId: string;
  date: string;
  hospital: string;
  type: DocType;
  images: ImageAttachment[];
  ocrText: string; 
  summary?: string; 
  isGrouped?: boolean; 
  endDate?: string; 
}

export interface Person {
  id: string;
  name: string;
  avatarColor: string;
}

export type ViewMode = 'TIMELINE' | 'DETAIL' | 'SETTINGS' | 'PERSON_MANAGE' | 'SPLIT_VIEW';