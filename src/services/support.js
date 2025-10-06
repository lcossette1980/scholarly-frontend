// Support message service
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from './firebase';

export const submitSupportMessage = async (messageData) => {
  if (!auth.currentUser) {
    throw new Error('User must be authenticated to send support messages');
  }

  const docRef = await addDoc(collection(db, 'support_messages'), {
    userId: auth.currentUser.uid,
    userEmail: auth.currentUser.email,
    userName: auth.currentUser.displayName || 'Unknown User',
    subject: messageData.subject,
    message: messageData.message,
    category: messageData.category || 'general',
    read: false,
    priority: messageData.priority || 'medium',
    createdAt: serverTimestamp()
  });

  return { success: true, id: docRef.id };
};
