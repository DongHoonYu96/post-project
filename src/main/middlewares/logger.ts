import {Request} from "../was/request";
import {Response} from "../was/response";
import {randomUUID} from "node:crypto";

const colors = {
    green: '\x1b[32m',
    cyan: '\x1b[36m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    reset: '\x1b[0m',
}
const methodColorMap = {
    get: colors.green,
    post: colors.cyan,
    put: colors.yellow,
    delete: colors.red
}

export const logger = (req : Request, res : Response, next) => {
    const coloredMethod = method => {
        return `${methodColorMap[method.toLowerCase()]}${method}${colors.reset}`
    }

    const uid = randomUUID();
    console.log(`[${uid}] [${coloredMethod(req.method)}] [${req.path}]`);
    next();
}
