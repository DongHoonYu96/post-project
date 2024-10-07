import { Server } from './was/server';
import {logger} from "./middlewares/logger";
import * as cookieParser from 'cookie-parser';
import {authMiddleware} from "./middlewares/Auth";

async function main() {
    const app = new Server();

    app.use(logger);
    app.use(cookieParser());
    app.use(authMiddleware);
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