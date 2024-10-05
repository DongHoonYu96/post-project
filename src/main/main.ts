import * as path from 'path';
import * as fs from 'fs/promises';
import { Server } from './was/server';
import { Router } from './was/router';
import { Request } from './was/request';
import { Response } from './was/response';
import { COMMON_MIME_TYPES } from './was/const/httpConsts';
import {logger} from "./middlewares/logger";
import {staticServe} from "./middlewares/middlewares";

async function main() {
    const app = new Server();

    app.use(logger);
    // app.use(staticServe);

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