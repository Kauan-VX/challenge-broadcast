import { useEffect, useState } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Connection } from '../types';

export function useConnection(connectionId: string | undefined) {
  const [connection, setConnection] = useState<Connection | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!connectionId) {
      setConnection(null);
      setLoading(false);
      setNotFound(true);
      return;
    }

    setLoading(true);
    setNotFound(false);

    const unsubscribe = onSnapshot(
      doc(db, 'connections', connectionId),
      (snap) => {
        if (snap.exists()) {
          setConnection({ id: snap.id, ...(snap.data() as Omit<Connection, 'id'>) });
          setNotFound(false);
        } else {
          setConnection(null);
          setNotFound(true);
        }
        setLoading(false);
      },
      () => {
        setConnection(null);
        setNotFound(true);
        setLoading(false);
      },
    );

    return unsubscribe;
  }, [connectionId]);

  return { connection, loading, notFound };
}
