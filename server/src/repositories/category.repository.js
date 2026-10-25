import { db } from '../config/database.js';

export const categoryRepository = {
  findAll() {
    return db.prepare('SELECT * FROM categories ORDER BY name').all();
  },

  exists(id) {
    return Boolean(db.prepare('SELECT 1 FROM categories WHERE id = ?').get(id));
  },
};
