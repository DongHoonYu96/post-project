export interface ControllerV4{
    /**
     * @param paramMap
     * @param model
     * @return viewName
     */
    process (paramMap : Map<string, string> , model : Map<string, object> );
}