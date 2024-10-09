import {Request} from "../was/request";
import {Response} from "../was/response";

/**
 * 쿠키 문자열을 파싱하여 객체로 변환합니다.
 * @param cookieString 쿠키 문자열
 * @returns 파싱된 쿠키 객체
 * {
 *   acookie: "dfdkfokeoef",
 *   bcookie: "afkifkjeife",
 *   ccookie: "asdsd"
 * }
 */
export function MyCookieParser(req : Request, res: Response, next)  {
    /**
     * 쿠키가 없는경우 예외처리
     * 파싱하지 않아야 에러가안남.
     */
    const b = !req.get('cookie');
    if(b) {
        next();
        return;
    }

    const cookies: { [key: string]: string } = {};

    const cookieString = req.get('cookie');

    // 쿠키 문자열을 세미콜론으로 분리
    const cookiePairs = cookieString.split(';');

    for (let pair of cookiePairs) {
        // 각 쌍을 트림하고 '='로 분리
        const [key, value] = pair.trim().split('=');

        // 키와 값이 모두 존재하는 경우에만 객체에 추가
        if (key && value) {
            cookies[key] = value;
        }
    }

    req.cookies = cookies;
    next();
}