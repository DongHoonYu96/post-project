import { FindManyOptions, FindOptionsOrder, FindOptionsWhere, Repository, MoreThan, LessThan, Like } from "typeorm";
import { BasePaginatePostDto } from "./dto/BasePaginatePostDto";
import {BaseModel} from "./entity/BaseModel";
import * as dotenv from "dotenv";

dotenv.config(); // env환경변수 파일 가져오기

const FILTER_MAPPER = {
    more_than: MoreThan,
    less_than: LessThan,
    i_like: Like,
};

export class PaginationService {
    private static instance: PaginationService;
    private readonly protocol = process.env.PROTOCOL;
    private readonly host = process.env.HOST;

    private constructor() {}

    public static getInstance(): PaginationService {
        if (!PaginationService.instance) {
            PaginationService.instance = new PaginationService();
        }
        return PaginationService.instance;
    }

    async paginate<T extends BaseModel>(
        dto: BasePaginatePostDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {}, //추가 옵션 (연관 table 속성 표시할건지 등)
        path: string, //url 의 path (localhost:3000/posts 의 posts)
    ) {
        if (dto.page) {
            return this.pagePaginate(dto, repository, overrideFindOptions);
        } else {
            return this.cursorPaginate(dto, repository, overrideFindOptions, path);
        }
    }

    private async pagePaginate<T extends BaseModel>(
        dto: BasePaginatePostDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {},
    ) {
        const findOptions = this.composeFindOptions<T>(dto);

        const [data, count] = await repository.findAndCount({
            ...findOptions,
            ...overrideFindOptions,
        });

        return {
            data,
            total: count,
        };
    }

    private async cursorPaginate<T extends BaseModel>(
        dto: BasePaginatePostDto,
        repository: Repository<T>,
        overrideFindOptions: FindManyOptions<T> = {},
        path: string,
    ) {
        const findOptions = this.composeFindOptions<T>(dto);

        const results = await repository.find({
            ...findOptions,
            ...overrideFindOptions,
        });

        const lastItem = results.length > 0 && results.length === dto.take ? results[results.length - 1] : null;

        const nextUrl = lastItem && new URL(`${this.protocol}://${this.host}/${path}`);
        if (nextUrl) {
            for (const key of Object.keys(dto)) {
                if (dto[key]) {
                    if (key !== 'where__id__more_than' && key !== 'where__id__less_than') {
                        nextUrl.searchParams.append(key, dto[key]);
                    }
                }
            }

            let key = dto.order__createdAt === 'ASC' ? 'where__id__more_than' : 'where__id__less_than';
            nextUrl.searchParams.append(key, lastItem.id.toString());
        }

        return {
            data: results,
            cursor: {
                after: lastItem?.id ?? null,
            },
            count: results?.length ?? 0,
            next: nextUrl?.toString() ?? null,
        };
    }

    private composeFindOptions<T extends BaseModel>(
        dto: BasePaginatePostDto,
    ): FindManyOptions<T> {
        let where: FindOptionsWhere<T> = {};
        let order: FindOptionsOrder<T> = {};

        for (const [key, value] of Object.entries(dto)) {
            if (key.startsWith("where__")) {
                where = {
                    ...where,
                    ...this.parseWhereFilter(key, value),
                };
            } else if (key.startsWith('order__')) {
                order = {
                    ...order,
                    ...this.parseOrderFilter(key, value),
                };
            }
        }

        return {
            where,
            order,
            take: dto.take,
            skip: dto.page ? dto.take * (dto.page - 1) : undefined,
        };
    }

    private parseWhereFilter<T extends BaseModel>(key: string, value: any):
        FindOptionsWhere<T> | FindOptionsOrder<T> {
        /**
         * 문제 : dto의 where_id_more_than =1 &&
         * dto의 where_id_less_than = undifiend인경우, 앞의 valid한 where조건이 없어져버림.
         * value가 undifiend인경우 pass
        * */
        if(!value) return;
        const options: FindOptionsWhere<T> = {};
        const split = key.split('__');

        if (split.length !== 2 && split.length !== 3) {
            throw new Error(`where 필터는 "__"로 split시 길이가 2 또는 3이어야 합니다. 문제되는 키값 : ${key}`);
        }

        if (split.length === 2) {
            const [_, field] = split;
            options[field] = value;
        } else {
            const [_, field, operator] = split;
            if (operator === 'i_like') {
                options[field] = FILTER_MAPPER[operator](`%${value}%`);
                return options;
            }
            options[field] = FILTER_MAPPER[operator](value);
        }

        return options;
    }

    private parseOrderFilter<T extends BaseModel>(key: string, value: any):
        FindOptionsOrder<T> {
        const options: FindOptionsOrder<T> = {};
        const split = key.split('__');

        if (split.length !== 2) {
            throw new Error(`order 필터는 "__"로 split시 길이가 2여야 합니다. 문제되는 키값 : ${key}`);
        }

        const [_, field] = split;
        options[field] = value;

        return options;
    }
}