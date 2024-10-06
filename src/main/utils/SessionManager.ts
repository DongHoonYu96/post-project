import { v4 as uuidv4 } from 'uuid';
import {Member} from "../domain/member/Member";
import {Response} from "../was/response";
import {Request} from "../was/request";

/**
 * Manages user sessions using the Singleton pattern.
 */
export class SessionManager {
    private static instance: SessionManager;
    private sessionStore: Map<string, Member>;
    private readonly SESSION_COOKIE_NAME = 'asdfCookie';
    private readonly SESSION_DURATION = 30 * 60 * 1000; // 30 minutes

    private constructor() {
        this.sessionStore = new Map<string, Member>();
    }

    /**
     * Gets the singleton instance of SessionManager.
     * @returns The SessionManager instance.
     */
    public static getInstance(): SessionManager {
        if (!SessionManager.instance) {
            SessionManager.instance = new SessionManager();
        }
        return SessionManager.instance;
    }

    /**
     * Creates a new session for a member.
     * @param member - The member object to associate with the session.
     * @param response - The Express response object to set the cookie.
     * @returns The created session ID.
     */
    public createSession(member: Member, res: Response): string {
        const sessionId = uuidv4();
        this.sessionStore.set(sessionId, member);
        res.cookie(this.SESSION_COOKIE_NAME, sessionId);

        return sessionId;
    }

    /**
     * Gets the session associated with the request.
     * @param req - The Express request object.
     * @returns The session if found, null otherwise.
     */
    public getSession(req: Request): Member | null {
        const sessionId = this.findCookie(req, this.SESSION_COOKIE_NAME);
        if (!sessionId) return null;
        return this.sessionStore.get(sessionId) || null;
    }

    /**
     * Finds a cookie value by name in the request.
     * @param req - The Express request object.
     * @param cookieName - The name of the cookie to find.
     * @returns The cookie value if found, null otherwise.
     */
    private findCookie(req: Request, cookieName: string) {
        if(req.cookies === null){
            return null;
        }

        //쿠키들이 들어있는 Object Type : { 쿠키이름 : uuid } , { }
        const cookies = req.cookies;

        let findValue;
        for (let findKey of Object.keys(cookies)) {
            if (findKey === cookieName) {
                findValue = cookies[findKey];
                break;
            }
        }

        //찾은 value == session의 키 임에 주의 !!
        //쿠키 : {asdfCookie : ecf5}
        //세션 : {ecf5 : 맴버객체}
        //찾은 쿠키가 세션에 있는경우
        if(this.sessionStore.has(findValue)){
            return findValue;
        }
        //없으면 null 리턴(못찾음)
        return null;
    }

    /**
     * Expires the session associated with the request.
     * @param req - The Express request object.
     */
    public expire(req: Request): void {
        const sessionId = this.findCookie(req, this.SESSION_COOKIE_NAME);
        if (sessionId) {
            this.sessionStore.delete(sessionId);
        }
        console.log('expired session:', this.sessionStore);
    }

    /**
     * Finds a member by cookie value.
     * @param cookieVal - The cookie value to search for.
     * @returns The associated member if found, undefined otherwise.
     */
    public findMemberByCookieVal(cookieVal: string): Member | undefined {
         return this.sessionStore.get(cookieVal);
    }

}
