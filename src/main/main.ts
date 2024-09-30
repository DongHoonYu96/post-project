import * as path from 'path';
import * as fs from 'fs/promises';
import { Server } from './was/server';
import { Router } from './was/router';
import { Request } from './was/request';
import { Response } from './was/response';
import { COMMON_MIME_TYPES } from './was/const/httpConsts';

async function main() {
    const app = new Server();
    const router = new Router();

    const staticDir = path.join(__dirname, 'views');
    app.static(staticDir);
    app.use(router);

    router.get('/', async (req: Request, res: Response) => {
        try {
            const indexPath = path.join(staticDir, 'index.html');
            const content = await fs.readFile(indexPath);
            res.setCacheControl('60').render(content, COMMON_MIME_TYPES.html);
        } catch (error) {
            console.error('Error serving index.html:', error);
            res.status(500).send('Internal Server Error');
        }
    });

    const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

    app.listen(port, () => {
        console.log(`HTTP server running on http://localhost:${port}`);
    });

    // 에러 처리
    process.on('uncaughtException', (error) => {
        console.error('Uncaught Exception:', error);
        process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
        console.error('Unhandled Rejection at:', promise, 'reason:', reason);
        process.exit(1);
    });
}

main().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});