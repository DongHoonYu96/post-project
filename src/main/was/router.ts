import { Request } from './request';
import { Response } from './response';

type HttpMethod = 'GET' | 'POST' | 'DELETE' | 'PATCH';
type RouteHandler = (req: Request, res: Response) => void | Promise<void>;

interface Routes {
    [key: string]: {
        [path: string]: RouteHandler;
    };
}

class Router {
    private routes: Routes;

    constructor() {
        this.routes = {
            GET: {},
            POST: {},
            DELETE: {},
            PATCH: {},
        };
    }

    public get(path: string, handler: RouteHandler): void {
        this.addRoute('GET', path, handler);
    }

    public post(path: string, handler: RouteHandler): void {
        this.addRoute('POST', path, handler);
    }

    public delete(path: string, handler: RouteHandler): void {
        this.addRoute('DELETE', path, handler);
    }

    public patch(path: string, handler: RouteHandler): void {
        this.addRoute('PATCH', path, handler);
    }

    private addRoute(method: HttpMethod, path: string, handler: RouteHandler): void {
        this.routes[method][path] = handler;
    }

    public async handle(req: Request, res: Response): Promise<void> {
        const { method, path } = req;
        const handler = this.routes[method as HttpMethod]?.[path];

        if (handler) {
            try {
                await Promise.resolve(handler(req, res));
            } catch (error) {
                console.error('Route handler error:', error);
                res.status(500).send('Internal Server Error');
            }
        } else {
            res.status(404).send('Not Found');
        }
    }

    // 와일드카드 라우팅을 위한 메서드 (옵션)
    private findMatchingRoute(method: HttpMethod, path: string): RouteHandler | undefined {
        const routesForMethod = this.routes[method];
        if (path in routesForMethod) {
            return routesForMethod[path];
        }

        // 와일드카드 매칭 로직
        for (const routePath in routesForMethod) {
            if (this.matchWildcard(routePath, path)) {
                return routesForMethod[routePath];
            }
        }

        return undefined;
    }

    private matchWildcard(routePath: string, requestPath: string): boolean {
        const routeParts = routePath.split('/');
        const requestParts = requestPath.split('/');

        if (routeParts.length !== requestParts.length) {
            return false;
        }

        return routeParts.every((part, i) => part === '*' || part === requestParts[i]);
    }
}

export { Router };