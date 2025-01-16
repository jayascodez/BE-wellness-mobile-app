import express from 'express';
import cors from 'cors';
import getMoods from './controllers/moods.controller.js';
import getActivities from './controllers/activities.controller.js';
import {getJournalEntries, postJournalEntry} from './controllers/journal.controller.js';
import getUsersById from './controllers/users.controller.js'

const app = express();

app.use(cors());
app.use(express.json());

app.get('/moods', getMoods);

app.get('/activities', getActivities);

app.get('/user/:id', getUsersById)

app.get('/user/:id/journal', getJournalEntries);

app.post('/user/:id/journal', postJournalEntry)


export default app;