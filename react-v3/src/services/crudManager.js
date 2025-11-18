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
    return getCollection(this.collectionName, conditions);
  }

  async getById(id) {
    const items = await getCollection(this.collectionName, [where('id', '==', id)]);
    return items[0] || null;
  }

  async create(data) {
    return addDocument(this.collectionName, data);
  }

  async update(id, data) {
    return updateDocument(this.collectionName, id, data);
  }

  async delete(id) {
    return deleteDocument(this.collectionName, id);
  }
}

// Export instances for different collections
export const userManager = new CrudManager('usuarios');
export const productManager = new CrudManager('productos');
export const orderManager = new CrudManager('ordenes');
export const categoryManager = new CrudManager('categorias');