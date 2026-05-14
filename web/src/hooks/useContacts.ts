import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Contact } from '../types';

export function useContacts(
  userId: string | undefined,
  connectionId: string | undefined,
) {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !connectionId) {
      setContacts([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'contacts'),
      where('userId', '==', userId),
      where('connectionId', '==', connectionId),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Contact, 'id'>),
      }));
      setContacts(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId, connectionId]);

  return { contacts, loading };
}
