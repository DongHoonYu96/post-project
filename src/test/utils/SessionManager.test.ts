import { Request } from '../../main/was/request';
import { Response } from '../../main/was/response';

// Mock uuid module
import {SessionManager} from "../../main/utils/SessionManager";
import {Member} from "../../main/domain/member/Member";

jest.mock('uuid', () => ({
    v4: jest.fn(() => 'mocked-uuid'),
}));

describe('SessionManager', () => {
    let sessionManager: SessionManager;
    let mockMember: Member;
    let mockRequest: Request;
    let mockResponse: Response;

    beforeEach(() => {
        sessionManager = SessionManager.getInstance();
        mockMember = new Member(0,"chovy@naver.com" ,"chovy", "123456") as Member;
        mockRequest = {
            cookies: {
                asdfCookie: 'mocked-uuid',
            },
        } as Request;
        mockResponse = {
            cookie: jest.fn(),
        } as unknown as Response;
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    test('getInstance should return the same instance', () => {
        const instance1 = SessionManager.getInstance();
        const instance2 = SessionManager.getInstance();
        expect(instance1).toBe(instance2);
    });

    test('createSession should create a new session and return sessionId', () => {
        const sessionId = sessionManager.createSession(mockMember, mockResponse);
        expect(sessionId).toBe('mocked-uuid');
        expect(mockResponse.cookie).toHaveBeenCalledWith('asdfCookie', 'mocked-uuid');
    });

    test('getSession should return the member for a valid session', () => {
        sessionManager.createSession(mockMember, mockResponse);
        const session = sessionManager.getSession(mockRequest);
        expect(session).toEqual(mockMember);
    });

    test('getSession should return null for an invalid session', () => {
        const invalidRequest = { cookies: { asdfCookie: 'invalid-uuid' } } as Request;
        const session = sessionManager.getSession(invalidRequest);
        expect(session).toBeNull();
    });

    test('expire should remove the session', () => {
        sessionManager.createSession(mockMember, mockResponse);
        sessionManager.expire(mockRequest);
        const session = sessionManager.getSession(mockRequest);
        expect(session).toBeNull();
    });

    test('findMemberByCookieVal should return the correct member', () => {
        sessionManager.createSession(mockMember, mockResponse);
        const foundMember = sessionManager.findMemberByCookieVal('mocked-uuid');
        expect(foundMember).toEqual(mockMember);
    });

    test('findMemberByCookieVal should return undefined for invalid cookie value', () => {
        const foundMember = sessionManager.findMemberByCookieVal('invalid-uuid');
        expect(foundMember).toBeUndefined();
    });
});