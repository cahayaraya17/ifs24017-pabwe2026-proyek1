import { categoryRepository } from '../repositories/category.repository.js';

export function listCategories(req, res) {
  res.json({ categories: categoryRepository.findAll() });
}
