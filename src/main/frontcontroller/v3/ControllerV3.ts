import {ModelView} from "../ModelView";

/**
 * 서블릿 종속성(res,req)을 제거한 버전의 컨트롤러
 * 서블릿에 의존하지 않는 컨트롤러
 * @param paramMap req.body를 파싱후 map에 넣은것
 * @return ModelView 뷰이름과 렌더링할 객체들을 모델뷰 객체로 만들어 리턴
 */
export interface ControllerV3{

    process (paramMap : Map<string, string>) : ModelView;
}