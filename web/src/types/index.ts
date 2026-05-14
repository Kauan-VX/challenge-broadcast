import type { Timestamp } from 'firebase/firestore';

export type MessageStatus = 'scheduled' | 'sent';

export type Connection = {
  id: string;
  userId: string;
  name: string;
  createdAt: Timestamp | null;
};

export type Contact = {
  id: string;
  userId: string;
  connectionId: string;
  name: string;
  phone: string;
  createdAt: Timestamp | null;
};

export type Message = {
  id: string;
  userId: string;
  connectionId: string;
  contactIds: string[];
  content: string;
  status: MessageStatus;
  scheduledFor: Timestamp | null;
  sentAt: Timestamp | null;
  createdAt: Timestamp | null;
};

export type MessageFilter = 'all' | 'scheduled' | 'sent';
