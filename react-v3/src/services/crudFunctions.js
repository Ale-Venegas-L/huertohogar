// src/services/crudFunctions.js
import { db } from '../config/firebase';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc,
  query,
  where,
  serverTimestamp
} from 'firebase/firestore';

export const getCollection = async (collectionName, conditions = []) => {
  try {
    console.log(`[Firestore] Fetching collection: ${collectionName}`);
    let q = collection(db, collectionName);
    
    if (conditions.length > 0) {
      console.log(`[Firestore] Applying ${conditions.length} conditions to ${collectionName}`);
      q = query(q, ...conditions);
    }

    console.log(`[Firestore] Executing Firestore query for ${collectionName}`);
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));

    console.log(`[Firestore] Retrieved ${results.length} documents from ${collectionName}`);
    return results;
  } catch (error) {
    console.error(`[Firestore] Error getting ${collectionName}:`, error);
    throw new Error(`Failed to fetch ${collectionName}: ${error.message}`);
  }
};

export const addDocument = async (collectionName, data) => {
  try {
    console.log(`[Firestore] Adding document to ${collectionName}:`, data);
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp()
    });
    console.log(`[Firestore] Document added with ID: ${docRef.id}`);
    return { id: docRef.id, ...data };
  } catch (error) {
    console.error(`[Firestore] Error adding to ${collectionName}:`, error);
    throw new Error(`Failed to add document: ${error.message}`);
  }
};

export const updateDocument = async (collectionName, id, data) => {
  try {
    console.log(`[Firestore] Updating document ${collectionName}/${id}:`, data);
    const docRef = doc(db, collectionName, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: serverTimestamp()
    });
    console.log(`[Firestore] Successfully updated ${collectionName}/${id}`);
    return { id, ...data };
  } catch (error) {
    console.error(`[Firestore] Error updating ${collectionName}/${id}:`, error);
    throw new Error(`Failed to update document: ${error.message}`);
  }
};

export const deleteDocument = async (collectionName, id) => {
  try {
    console.log(`[Firestore] Deleting document ${collectionName}/${id}`);
    await deleteDoc(doc(db, collectionName, id));
    console.log(`[Firestore] Successfully deleted ${collectionName}/${id}`);
    return id;
  } catch (error) {
    console.error(`[Firestore] Error deleting ${collectionName}/${id}:`, error);
    throw new Error(`Failed to delete document: ${error.message}`);
  }
};