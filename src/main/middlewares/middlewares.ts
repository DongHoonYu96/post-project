import {Request} from "../was/request";
import {Response} from "../was/response";
import * as path from "node:path";
import * as fs from "node:fs";


export const staticServe = async (req : Request, res : Response) => {
    const mimeType = {
        ".ico": "image/x-icon",
        ".html": "text/html",
        ".js": "text/javascript",
        ".css": "text/css",
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".eot": "appliaction/vnd.ms-fontobject",
        ".ttf": "aplication/font-sfnt",
    }
    const ext = path.parse(req.path).ext
    const publicPath = path.join(process.cwd(), 'dist','views');

    if (Object.keys(mimeType).includes(ext)) {
        try{
            const file = await fs.promises.readFile(`${publicPath}${req.path}`);
            res.render(file,mimeType[ext]);
            return true;
        }catch (error) {
            console.error('File read error:', error);
            res.status(404).send('File Not Found');
            return false;
        }
    }
    return false;
}