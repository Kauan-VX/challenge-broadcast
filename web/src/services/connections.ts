import {
  addDoc,
  collection,
  doc,
  getDocs,
  query,
  serverTimestamp,
  updateDoc,
  where,
  writeBatch,
} from 'firebase/firestore';
import { db } from '../lib/firebase';

const connectionsRef = collection(db, 'connections');

export async function createConnection(userId: string, name: string) {
  return addDoc(connectionsRef, {
    userId,
    name: name.trim(),
    createdAt: serverTimestamp(),
  });
}

export async function updateConnection(id: string, name: string) {
  return updateDoc(doc(db, 'connections', id), { name: name.trim() });
}

export async function deleteConnection(userId: string, id: string) {
  const batch = writeBatch(db);

  const contactsSnap = await getDocs(
    query(
      collection(db, 'contacts'),
      where('userId', '==', userId),
      where('connectionId', '==', id),
    ),
  );
  contactsSnap.forEach((d) => batch.delete(d.ref));

  const messagesSnap = await getDocs(
    query(
      collection(db, 'messages'),
      where('userId', '==', userId),
      where('connectionId', '==', id),
    ),
  );
  messagesSnap.forEach((d) => batch.delete(d.ref));

  batch.delete(doc(db, 'connections', id));
  await batch.commit();
}
