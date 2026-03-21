import { db } from './firebase';
import { 
  collection, 
  addDoc, 
  query, 
  where, 
  orderBy, 
  limit, 
  getDocs,
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp 
} from 'firebase/firestore';

const COLLECTION_NAME = 'bibliography_entries';

// Save a new bibliography entry
export const saveBibliographyEntry = async (userId, entryData, researchFocus) => {
  try {
    // Build backward-compatible citation from source_info
    const citation = entryData.source_info
      ? `${entryData.source_info.author} (${entryData.source_info.year}). ${entryData.source_info.title}. ${entryData.source_info.publication}`
      : entryData.citation || '';

    const docRef = await addDoc(collection(db, COLLECTION_NAME), {
      userId,
      researchFocus,
      citation,
      source_info: entryData.source_info || null,
      key_arguments: entryData.key_arguments || null,
      interesting_angles: entryData.interesting_angles || null,
      notable_passages: entryData.notable_passages || [],
      perspective_value: entryData.perspective_value || null,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error saving bibliography entry:', error);
    return { success: false, error: error.message };
  }
};

// Get user's bibliography entries
export const getUserBibliographyEntries = async (userId, limitCount = 10) => {
  try {
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const entries = [];
    
    querySnapshot.forEach((doc) => {
      entries.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return { success: true, entries };
  } catch (error) {
    console.error('Error fetching bibliography entries:', error);
    return { success: false, error: error.message };
  }
};

// Get a single bibliography entry
export const getBibliographyEntry = async (entryId) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, entryId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { 
        success: true, 
        entry: { id: docSnap.id, ...docSnap.data() } 
      };
    } else {
      return { success: false, error: 'Entry not found' };
    }
  } catch (error) {
    console.error('Error getting bibliography entry:', error);
    return { success: false, error: error.message };
  }
};

// Update a bibliography entry
export const updateBibliographyEntry = async (entryId, updates) => {
  try {
    const docRef = doc(db, COLLECTION_NAME, entryId);
    await updateDoc(docRef, {
      ...updates,
      updatedAt: serverTimestamp()
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating bibliography entry:', error);
    return { success: false, error: error.message };
  }
};

// Delete a bibliography entry
export const deleteBibliographyEntry = async (entryId) => {
  try {
    await deleteDoc(doc(db, COLLECTION_NAME, entryId));
    return { success: true };
  } catch (error) {
    console.error('Error deleting bibliography entry:', error);
    return { success: false, error: error.message };
  }
};

// Search bibliography entries
export const searchBibliographyEntries = async (userId, searchTerm) => {
  try {
    // Note: This is a basic search. For more advanced search, consider using 
    // Algolia or Elasticsearch integration
    const q = query(
      collection(db, COLLECTION_NAME),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    
    const querySnapshot = await getDocs(q);
    const entries = [];
    
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      const searchableText = [
        data.citation,
        data.narrative_overview,
        data.key_arguments,
        data.interesting_angles,
        data.core_findings,
        data.perspective_value,
        data.researchFocus,
        data.source_info?.title,
        data.source_info?.author
      ].filter(Boolean).join(' ').toLowerCase();
      
      if (searchableText.includes(searchTerm.toLowerCase())) {
        entries.push({
          id: doc.id,
          ...data
        });
      }
    });
    
    return { success: true, entries };
  } catch (error) {
    console.error('Error searching bibliography entries:', error);
    return { success: false, error: error.message };
  }
};