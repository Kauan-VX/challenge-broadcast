import { useEffect, useState } from 'react';
import {
  collection,
  limit as limitFn,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Message } from '../types';

export function useMessages(
  userId: string | undefined,
  connectionId: string | undefined,
  pageSize = 50,
) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !connectionId) {
      setMessages([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'messages'),
      where('userId', '==', userId),
      where('connectionId', '==', connectionId),
      orderBy('createdAt', 'desc'),
      limitFn(pageSize),
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Message, 'id'>),
      }));
      setMessages(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId, connectionId, pageSize]);

  return { messages, loading };
}
