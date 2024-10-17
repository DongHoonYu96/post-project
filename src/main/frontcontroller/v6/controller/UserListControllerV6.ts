import {ControllerV6} from "../ControllerV6";
import {Request} from "../../../was/request";
import {Response} from "../../../was/response";
import {PaginationService} from "../../../domain/common/PaginationService";
import {BasePaginatePostDto} from "../../../domain/common/dto/BasePaginatePostDto";
import {MemberRepository} from "../../../domain/member/MemberRepository";

export class UserListControllerV6 implements ControllerV6{

    private userRepository  = MemberRepository.getInstance().getRepo();
    private paginationService =PaginationService.getInstance();

    async process(req: Request, res: Response, paramMap: Map<string, string>, model: Map<string, object>) {

        if(!req.query['page']){
            req.query['page'] = "1";
        }
        const data = await this.paginationService.paginate(
            new BasePaginatePostDto(+req.query['page'], undefined,
                undefined, 'DESC', 10),
            this.userRepository,
            {
            },
            'user',
        );

        const curPage  =  {
            curPage: req.query['page'],
        }

        const members = data.data;
        model.set("members",members);
        model.set("data", data);
        model.set("curPage", curPage);

       return "user/list";
    }

    version6() {
    }
}