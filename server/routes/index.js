import { Router } from 'express';
import materialsRoutes from './materialsRoutes.js';
import vendorsRoutes from './vendorsRoutes.js';
import reuseRoutes from './reuseRoutes.js';
import disposalRoutes from './disposalRoutes.js';
import textilesRoutes from './textilesRoutes.js';
import matchRoutes from './matchRoutes.js';
import ordersRoutes from './ordersRoutes.js';
import collectionPointsRoutes from './collectionPointsRoutes.js';
import contactRoutes from './contactRoutes.js';
import authRoutes from './authRoutes.js';
import aiRoutes from './aiRoutes.js';

const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/ai', aiRoutes);
apiRouter.use('/materials', materialsRoutes);
apiRouter.use('/vendors', vendorsRoutes);
apiRouter.use('/reuse-options', reuseRoutes);
apiRouter.use('/disposal-options', disposalRoutes);
apiRouter.use('/textiles', textilesRoutes);
apiRouter.use('/match', matchRoutes);
apiRouter.use('/orders', ordersRoutes);
apiRouter.use('/collection-points', collectionPointsRoutes);
apiRouter.use('/', contactRoutes);

// Health / Status endpoint
apiRouter.get('/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'TexLoop / ReTextile Platform API',
    version: '1.0.0-full',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

export default apiRouter;
