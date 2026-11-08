import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const isProd = process.env.NODE_ENV === 'production';

app.use(express.json({ limit: '10mb' }));

// Cloud persistence in-memory state with local file persistence
const DATA_DIR = path.join(__dirname, '.cloud_data');
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

const PLANS_FILE = path.join(DATA_DIR, 'lesson_plans.json');
const RESOURCES_FILE = path.join(DATA_DIR, 'resources.json');
const FEEDBACKS_FILE = path.join(DATA_DIR, 'feedbacks.json');

function loadJson<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      return JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  return fallback;
}

function saveJson<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error saving ${filePath}:`, err);
  }
}

// REST Endpoints
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// Get all lesson plans for teacher
app.get('/api/lesson-plans', (req: Request, res: Response) => {
  const plans = loadJson(PLANS_FILE, []);
  res.json(plans);
});

// Save or update lesson plan
app.post('/api/lesson-plans', (req: Request, res: Response) => {
  const newPlan = req.body;
  if (!newPlan || !newPlan.id) {
    return res.status(400).json({ error: 'Invalid plan data' });
  }
  const plans = loadJson<any[]>(PLANS_FILE, []);
  const existingIdx = plans.findIndex((p) => p.id === newPlan.id);
  newPlan.syncStatus = 'synced';
  newPlan.lastModified = new Date().toISOString();
  if (existingIdx >= 0) {
    plans[existingIdx] = newPlan;
  } else {
    plans.unshift(newPlan);
  }
  saveJson(PLANS_FILE, plans);
  res.json({ success: true, plan: newPlan });
});

// Delete lesson plan
app.delete('/api/lesson-plans/:id', (req: Request, res: Response) => {
  const id = req.params.id;
  let plans = loadJson<any[]>(PLANS_FILE, []);
  plans = plans.filter((p) => p.id !== id);
  saveJson(PLANS_FILE, plans);
  res.json({ success: true, id });
});

// Batch Cloud Sync for cross-platform offline-first syncing
app.post('/api/sync', (req: Request, res: Response) => {
  const { plansToUpload } = req.body;
  let serverPlans = loadJson<any[]>(PLANS_FILE, []);
  
  if (Array.isArray(plansToUpload)) {
    for (const clientPlan of plansToUpload) {
      const idx = serverPlans.findIndex((p) => p.id === clientPlan.id);
      clientPlan.syncStatus = 'synced';
      if (idx >= 0) {
        // Merge newest version
        if (new Date(clientPlan.lastModified) >= new Date(serverPlans[idx].lastModified || 0)) {
          serverPlans[idx] = clientPlan;
        }
      } else {
        serverPlans.unshift(clientPlan);
      }
    }
    saveJson(PLANS_FILE, serverPlans);
  }

  res.json({
    success: true,
    serverPlans,
    syncedAt: new Date().toISOString(),
  });
});

// Resources for teacher collaboration
app.get('/api/resources', (req: Request, res: Response) => {
  const resources = loadJson(RESOURCES_FILE, []);
  res.json(resources);
});

app.post('/api/resources', (req: Request, res: Response) => {
  const newRes = req.body;
  const resources = loadJson<any[]>(RESOURCES_FILE, []);
  resources.unshift(newRes);
  saveJson(RESOURCES_FILE, resources);
  res.json({ success: true, resource: newRes });
});

// Administrator feedback submission
app.post('/api/feedback', (req: Request, res: Response) => {
  const { planId, feedback } = req.body;
  if (!planId || !feedback) {
    return res.status(400).json({ error: 'Missing planId or feedback' });
  }
  const plans = loadJson<any[]>(PLANS_FILE, []);
  const targetPlan = plans.find((p) => p.id === planId);
  if (targetPlan) {
    if (!targetPlan.feedbacks) targetPlan.feedbacks = [];
    targetPlan.feedbacks.unshift(feedback);
    targetPlan.status = feedback.status;
    saveJson(PLANS_FILE, plans);
  }
  res.json({ success: true, planId, feedback });
});

// Export iCalendar .ICS for schedule synchronization
app.get('/api/calendar/export.ics', (req: Request, res: Response) => {
  const plans = loadJson<any[]>(PLANS_FILE, []);
  let ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//KruPlano//Cambodia MoEYS Lesson Planner//KM',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:KruPlano MoEYS Schedule',
  ];

  plans.forEach((p) => {
    const d = p.date ? p.date.replace(/-/g, '') : '20261110';
    ics.push('BEGIN:VEVENT');
    ics.push(`UID:${p.id}@kruplano.moeys.gov.kh`);
    ics.push(`DTSTAMP:${d}T070000Z`);
    ics.push(`DTSTART:${d}T073000Z`);
    ics.push(`DTEND:${d}T081500Z`);
    ics.push(`SUMMARY:${p.lessonTitleKm || p.lessonTitleEn} (${p.grade})`);
    ics.push(`DESCRIPTION:Cambodia MoEYS Lesson: ${p.chapterKm || ''} - Teacher: ${p.teacherNameKm || ''}`);
    ics.push(`LOCATION:${p.schoolNameKm || 'Primary School'}`);
    ics.push('END:VEVENT');
  });

  ics.push('END:VCALENDAR');
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="kruplano_schedule.ics"');
  res.send(ics.join('\r\n'));
});

// Setup Vite in Dev or Static files in Prod
async function startServer() {
  if (!isProd) {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`KruPlano server listening on port ${PORT} (prod: ${isProd})`);
  });
}

startServer();
