import { useEffect, useState } from 'react';
import {
  collection,
  onSnapshot,
  orderBy,
  query,
  where,
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Connection } from '../types';

export function useConnections(userId: string | undefined) {
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setConnections([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(db, 'connections'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
    );

    const unsubscribe = onSnapshot(q, (snap) => {
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...(d.data() as Omit<Connection, 'id'>),
      }));
      setConnections(items);
      setLoading(false);
    });

    return unsubscribe;
  }, [userId]);

  return { connections, loading };
}
