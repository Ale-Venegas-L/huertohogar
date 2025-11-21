// src/services/crudManager.js
import { 
  getCollection, 
  addDocument, 
  updateDocument, 
  deleteDocument 
} from './crudFunctions';
import { where } from 'firebase/firestore';

class CrudManager {
  constructor(collectionName) {
    this.collectionName = collectionName;
  }

  async getAll(conditions = []) {
    try {
      console.log(`[CrudManager] Getting all documents from ${this.collectionName}`);
      const results = await getCollection(this.collectionName, conditions);
      console.log(`[CrudManager] Successfully retrieved ${results.length} documents from ${this.collectionName}`);
      return results;
    } catch (error) {
      console.error(`[CrudManager] Error in getAll for ${this.collectionName}:`, error);
      throw error;
    }
  }

  async getById(id) {
    try {
      console.log(`[CrudManager] Getting document ${id} from ${this.collectionName}`);
      const items = await getCollection(this.collectionName, [where('id', '==', id)]);
      const result = items[0] || null;
      console.log(`[CrudManager] ${result ? 'Found' : 'Did not find'} document ${id} in ${this.collectionName}`);
      return result;
    } catch (error) {
      console.error(`[CrudManager] Error in getById for ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }

  async create(data) {
    try {
      console.log(`[CrudManager] Creating document in ${this.collectionName}:`, data);
      const result = await addDocument(this.collectionName, data);
      console.log(`[CrudManager] Successfully created document in ${this.collectionName} with ID: ${result.id}`);
      return result;
    } catch (error) {
      console.error(`[CrudManager] Error creating in ${this.collectionName}:`, error);
      throw error;
    }
  }

  async update(id, data) {
    try {
      console.log(`[CrudManager] Updating document ${id} in ${this.collectionName}:`, data);
      const result = await updateDocument(this.collectionName, id, data);
      console.log(`[CrudManager] Successfully updated document ${id} in ${this.collectionName}`);
      return result;
    } catch (error) {
      console.error(`[CrudManager] Error updating in ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }

  async delete(id) {
    try {
      console.log(`[CrudManager] Deleting document ${id} from ${this.collectionName}`);
      await deleteDocument(this.collectionName, id);
      console.log(`[CrudManager] Successfully deleted document ${id} from ${this.collectionName}`);
      return { id };
    } catch (error) {
      console.error(`[CrudManager] Error deleting from ${this.collectionName}/${id}:`, error);
      throw error;
    }
  }
}

// Export instances for different collections
export const userManager = new CrudManager('usuario');
export const productManager = new CrudManager('producto');
export const orderManager = new CrudManager('compras');
// Note: If you don't have a 'categorias' collection, you can remove or comment this line
export const categoryManager = new CrudManager('categorias');