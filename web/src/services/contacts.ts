import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const contactsRef = collection(db, 'contacts');

type ContactInput = {
  userId: string;
  connectionId: string;
  name: string;
  phone: string;
};

export async function createContact(input: ContactInput) {
  return addDoc(contactsRef, {
    userId: input.userId,
    connectionId: input.connectionId,
    name: input.name.trim(),
    phone: input.phone.trim(),
    createdAt: serverTimestamp(),
  });
}

export async function updateContact(id: string, name: string, phone: string) {
  return updateDoc(doc(db, 'contacts', id), {
    name: name.trim(),
    phone: phone.trim(),
  });
}

export async function deleteContact(id: string) {
  return deleteDoc(doc(db, 'contacts', id));
}
