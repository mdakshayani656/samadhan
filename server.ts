import http from 'http';
import path from 'path';
import express from 'express';
import { WebSocketServer, WebSocket } from 'ws';
import { createServer as createViteServer } from 'vite';
import {
  loadServerDatabase,
  resetServerDatabase,
  createOrMergeProblemOnServer,
  verifyProblemOnServer,
  rejectProblemOnServer,
  submitPrototypeOnServer,
  reviewSolutionOnServer,
  fundProblemOnServer,
  resolveProblemOnServer,
  markAllNotificationsReadOnServer,
  raiseIndustryQueryOnServer,
  respondToIndustryQueryOnServer,
  submitJointProposalOnServer,
  sanctionJointProposalOnServer
} from './server/db';

async function startServer() {
  const app = express();
  const PORT = 3000;
  const httpServer = http.createServer(app);

  // Parse JSON payloads
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // WebSocket Server Setup on /ws
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });

  // Broadcast helper to push realtime delta and syncs to all connected clients
  function broadcast(type: string, data: any) {
    const payload = JSON.stringify({
      type,
      data,
      timestamp: new Date().toISOString()
    });

    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(payload);
        } catch (err) {
          console.error('[WS] Error broadcasting to client:', err);
        }
      }
    });
  }

  wss.on('connection', (ws, req) => {
    console.log(`[WS] Client connected from ${req.socket.remoteAddress}. Active clients: ${wss.clients.size}`);

    // Send initial full real-time database snapshot on connect
    const currentDb = loadServerDatabase();
    ws.send(
      JSON.stringify({
        type: 'INIT_DATA',
        data: currentDb,
        activeClients: wss.clients.size,
        timestamp: new Date().toISOString()
      })
    );

    // Notify all connected clients about presence / live count
    broadcast('PRESENCE_UPDATE', { activeClients: wss.clients.size });

    ws.on('message', (message) => {
      try {
        const parsed = JSON.parse(message.toString());
        if (parsed.type === 'PING') {
          ws.send(JSON.stringify({ type: 'PONG', timestamp: new Date().toISOString() }));
        } else if (parsed.type === 'REQUEST_SYNC') {
          ws.send(
            JSON.stringify({
              type: 'INIT_DATA',
              data: loadServerDatabase(),
              timestamp: new Date().toISOString()
            })
          );
        }
      } catch (err) {
        // Ignore non-json or ping frames
      }
    });

    ws.on('close', () => {
      console.log(`[WS] Client disconnected. Remaining: ${wss.clients.size}`);
      broadcast('PRESENCE_UPDATE', { activeClients: wss.clients.size });
    });
  });

  // REST API Endpoints FIRST

  // Health and realtime status endpoint
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SAMADHAN Realtime Civic Engine',
      activeWebSocketClients: wss.clients.size,
      timestamp: new Date().toISOString()
    });
  });

  // Fetch complete real-time database
  app.get('/api/database', (req, res) => {
    try {
      const db = loadServerDatabase();
      res.json(db);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Reset database to initial seed
  app.post('/api/reset', (req, res) => {
    try {
      const freshDb = resetServerDatabase();
      broadcast('DATABASE_SYNC', freshDb);
      broadcast('DATABASE_RESET', { message: 'Database reset to initial demo seeds.' });
      res.json({ success: true, database: freshDb });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Submit problem with AI deduplication & merging
  app.post('/api/problems', (req, res) => {
    try {
      const { title, description, location, category, priority, photo, citizenName, citizenEmail } = req.body;
      if (!title || !description || !location || !category || !priority) {
        return res.status(400).json({ error: 'Missing required problem fields.' });
      }

      const result = createOrMergeProblemOnServer({
        title,
        description,
        location,
        category,
        priority,
        photo,
        citizenName: citizenName || 'Anonymous Resident',
        citizenEmail: citizenEmail || 'citizen@demo.com'
      });

      // Real-time broadcast to all connected stakeholders
      broadcast('DATABASE_SYNC', result.database);
      if (result.isCombined) {
        broadcast('PROBLEM_MERGED', {
          problem: result.problem,
          aiReport: result.aiReport,
          message: `Multiple reports consolidated into master problem ${result.problem.id}`
        });
      } else {
        broadcast('PROBLEM_CREATED', {
          problem: result.problem,
          aiReport: result.aiReport,
          message: `New problem ${result.problem.id} reported and AI analyzed`
        });
      }

      res.status(201).json(result);
    } catch (err: any) {
      console.error('[API] Error in /api/problems:', err);
      res.status(500).json({ error: err.message });
    }
  });

  // Government field verification
  app.post('/api/problems/:id/verify', (req, res) => {
    try {
      const { remarks, verifiedBy } = req.body;
      const result = verifyProblemOnServer(
        req.params.id,
        remarks || 'Field ground verification completed and signed off.',
        verifiedBy || 'Government Nodal Officer'
      );

      broadcast('DATABASE_SYNC', result.database);
      broadcast('PROBLEM_VERIFIED', {
        problem: result.problem,
        message: `Problem ${result.problem.id} verified by Government`
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Government reject problem
  app.post('/api/problems/:id/reject', (req, res) => {
    try {
      const { remarks, rejectedBy } = req.body;
      const result = rejectProblemOnServer(
        req.params.id,
        remarks || 'Rejected after ground inspection.',
        rejectedBy || 'Government Nodal Officer'
      );

      broadcast('DATABASE_SYNC', result.database);
      broadcast('PROBLEM_REJECTED', {
        problem: result.problem,
        message: `Problem ${result.problem.id} rejected`
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // College submits prototype solution
  app.post('/api/problems/:id/solutions', (req, res) => {
    try {
      const result = submitPrototypeOnServer(req.params.id, req.body);

      broadcast('DATABASE_SYNC', result.database);
      broadcast('PROTOTYPE_SUBMITTED', {
        problem: result.problem,
        message: `Student prototype submitted for ${result.problem.id}`
      });

      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Industry partner reviews and evaluates prototype
  app.post('/api/problems/:id/solutions/:solutionId/review', (req, res) => {
    try {
      const result = reviewSolutionOnServer(req.params.id, req.params.solutionId, req.body);

      broadcast('DATABASE_SYNC', result.database);
      broadcast('PROTOTYPE_REVIEWED', {
        problem: result.problem,
        message: `Industry evaluation complete for ${result.problem.id}`
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Industry raises technical queries / requests modifications
  app.post('/api/problems/:id/solutions/:solutionId/queries', (req, res) => {
    try {
      const result = raiseIndustryQueryOnServer(req.params.id, req.params.solutionId, req.body);
      broadcast('DATABASE_SYNC', result.database);
      broadcast('PROTOTYPE_QUERIES_RAISED', {
        problem: result.problem,
        query: result.query,
        message: `Industry queries raised for ${result.problem.id}`
      });
      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Student team responds to query and submits modified prototype
  app.post('/api/problems/:id/solutions/:solutionId/queries/:queryId/respond', (req, res) => {
    try {
      const result = respondToIndustryQueryOnServer(
        req.params.id,
        req.params.solutionId,
        req.params.queryId,
        req.body
      );
      broadcast('DATABASE_SYNC', result.database);
      broadcast('PROTOTYPE_MODIFIED', {
        problem: result.problem,
        solution: result.solution,
        message: `Student team modified prototype for ${result.problem.id}`
      });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Industry + Student submit joint proposal to government for money sanction
  app.post('/api/problems/:id/solutions/:solutionId/joint-proposal', (req, res) => {
    try {
      const result = submitJointProposalOnServer(
        req.params.id,
        req.params.solutionId,
        req.body
      );
      broadcast('DATABASE_SYNC', result.database);
      broadcast('JOINT_PROPOSAL_SUBMITTED', {
        problem: result.problem,
        proposal: result.proposal,
        message: `Joint industry-student grant proposal submitted to government for ${result.problem.id}`
      });
      res.status(201).json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Government sanctions joint proposal
  app.post('/api/proposals/:proposalId/sanction', (req, res) => {
    try {
      const result = sanctionJointProposalOnServer(req.params.proposalId, req.body);
      broadcast('DATABASE_SYNC', result.database);
      broadcast('JOINT_PROPOSAL_SANCTIONED', {
        problem: result.problem,
        proposal: result.proposal,
        message: `Government grant sanctioned for ${result.problem.id}`
      });
      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Government grants funding
  app.post('/api/problems/:id/fund', (req, res) => {
    try {
      const result = fundProblemOnServer(req.params.id, req.body);

      broadcast('DATABASE_SYNC', result.database);
      broadcast('FUNDING_APPROVED', {
        problem: result.problem,
        message: `Civic innovation grant approved for ${result.problem.id}`
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mark problem solved with photographic evidence
  app.post('/api/problems/:id/resolve', (req, res) => {
    try {
      const result = resolveProblemOnServer(req.params.id, req.body);

      broadcast('DATABASE_SYNC', result.database);
      broadcast('PROBLEM_SOLVED', {
        problem: result.problem,
        message: `Problem ${result.problem.id} marked as Solved on ground!`
      });

      res.json(result);
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Mark all notifications read
  app.post('/api/notifications/read-all', (req, res) => {
    try {
      const db = markAllNotificationsReadOnServer();
      broadcast('DATABASE_SYNC', db);
      res.json({ success: true, notifications: db.notifications });
    } catch (err: any) {
      res.status(500).json({ error: err.message });
    }
  });

  // Vite Middleware Integration
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  httpServer.listen(PORT, '0.0.0.0', () => {
    console.log(`[SAMADHAN Engine] Full-stack Server listening on http://0.0.0.0:${PORT}`);
    console.log(`[SAMADHAN Engine] WebSocket service ready at ws://0.0.0.0:${PORT}/ws`);
  });
}

startServer().catch((err) => {
  console.error('[SAMADHAN Engine] Fatal server startup error:', err);
  process.exit(1);
});
