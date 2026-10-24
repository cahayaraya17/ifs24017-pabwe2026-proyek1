import dotenv from 'dotenv';
import path from 'node:path';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
const { app } = await import('./app.js');
const port = Number(process.env.PORT || 4000);
app.listen(port,()=>console.log(`CampusPulse API running on http://localhost:${port}`));
