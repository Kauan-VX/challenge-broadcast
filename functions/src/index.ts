import { initializeApp } from 'firebase-admin/app';
import { FieldValue, Timestamp, getFirestore } from 'firebase-admin/firestore';
import { onSchedule } from 'firebase-functions/v2/scheduler';
import { logger } from 'firebase-functions/v2';

initializeApp();

const BATCH_LIMIT = 400;

export const dispatchScheduledMessages = onSchedule(
  {
    schedule: 'every 1 minutes',
    timeZone: 'America/Sao_Paulo',
  },
  async () => {
    const db = getFirestore();
    const now = Timestamp.now();

    const snapshot = await db
      .collection('messages')
      .where('status', '==', 'scheduled')
      .where('scheduledFor', '<=', now)
      .limit(BATCH_LIMIT)
      .get();

    if (snapshot.empty) {
      logger.info('Nenhuma mensagem para disparar.');
      return;
    }

    const batch = db.batch();
    snapshot.forEach((doc) => {
      batch.update(doc.ref, {
        status: 'sent',
        sentAt: FieldValue.serverTimestamp(),
      });
    });

    await batch.commit();
    logger.info(`Disparadas ${snapshot.size} mensagem(ns).`);
  },
);
