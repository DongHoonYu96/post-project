import { Server } from './was/server';
import {logger} from "./middlewares/logger";
import {authMiddleware} from "./middlewares/Auth";
import {MyCookieParser} from "./middlewares/MyCookieParser";
import "dotenv/config";
import {AppDataSource} from "./repositories/AppDataSource";
import {MakeUser2Req} from "./middlewares/MakeUser2Req";
import {ViewCountManager} from "./domain/post/ViewCountManager";

async function main() {
    const app = new Server();
    const viewCountManager = ViewCountManager.getInstance();

    AppDataSource.getInstance().initialize().
    then(() => {
        console.log("Data Source has been initialized!")
    }).catch((err) => {
        console.error("Error during Data Source initialization", err)
    })

    app.use(logger);
    app.use(MyCookieParser);
    // app.use(authMiddleware);
    app.use(MakeUser2Req);

    const port = 3000;

    app.listen(port, () => {
        console.log(`HTTP server running on http://localhost:${port}`);
    });

    // 주기적으로 동기화 작업 실행 (예: 5초마다)
    setInterval(() => {
        // console.log('Syncing view counts to database...');
        viewCountManager.syncViewCountsToDatabase()
            .catch(console.error);
    }, 5000);

    // 에러 처리
    // process.on('uncaughtException', (error) => {
    //     console.error('Uncaught Exception:', error);
    //     // process.exit(1);
    // });
    //
    // process.on('unhandledRejection', (reason, promise) => {
    //     console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    //     // process.exit(1);
    // });
}

main().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
});