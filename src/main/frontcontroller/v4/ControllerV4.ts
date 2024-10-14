/**
 * 렌더링할 뷰의 이름만 넘겨주는 컨트롤러
 */
export interface ControllerV4{
    /**
     * @param paramMap req.body를 파싱후 map에 넣은것
     * @param model ejs에 넘겨줄 동적렌더링을 위한 객체들
     * @return viewName 렌더링할 뷰의 이름만 넘겨주는 컨트롤러
     */
    process (paramMap : Map<string, string> , model : Map<string, object> );
}