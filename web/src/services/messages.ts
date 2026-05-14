import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  Timestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const messagesRef = collection(db, 'messages');

type CreateMessageInput = {
  userId: string;
  connectionId: string;
  contactIds: string[];
  content: string;
  scheduledFor: Date | null;
};

export async function createMessage(input: CreateMessageInput) {
  const now = new Date();
  const isScheduled =
    input.scheduledFor !== null && input.scheduledFor.getTime() > now.getTime();

  return addDoc(messagesRef, {
    userId: input.userId,
    connectionId: input.connectionId,
    contactIds: input.contactIds,
    content: input.content.trim(),
    status: isScheduled ? 'scheduled' : 'sent',
    scheduledFor: isScheduled ? Timestamp.fromDate(input.scheduledFor!) : null,
    sentAt: isScheduled ? null : serverTimestamp(),
    createdAt: serverTimestamp(),
  });
}

type UpdateMessageInput = {
  content: string;
  scheduledFor: Date | null;
};

export async function updateScheduledMessage(
  id: string,
  input: UpdateMessageInput,
) {
  const now = new Date();
  const isScheduled =
    input.scheduledFor !== null && input.scheduledFor.getTime() > now.getTime();

  return updateDoc(doc(db, 'messages', id), {
    content: input.content.trim(),
    status: isScheduled ? 'scheduled' : 'sent',
    scheduledFor: isScheduled ? Timestamp.fromDate(input.scheduledFor!) : null,
    sentAt: isScheduled ? null : serverTimestamp(),
  });
}

export async function deleteMessage(id: string) {
  return deleteDoc(doc(db, 'messages', id));
}
