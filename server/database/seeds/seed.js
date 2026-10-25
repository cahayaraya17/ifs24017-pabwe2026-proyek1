import { db } from '../../src/config/database.js';
import { SEED_USERS } from '../../src/seed/demoData.js';
import { seedDemoData } from '../../src/seed/seedDemoData.js';

seedDemoData(db);

console.log(`Database seeded. Demo accounts: ${SEED_USERS.map((user) => user.email).join(', ')}`);
db.close();
