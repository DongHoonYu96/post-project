export class BasePaginatePostDto {
    constructor(page?: number, where__id__more_than?: number, where__id__less_than?: number, order__createdAt?: 'ASC' | 'DESC', take?: number) {
        this.page = page;
        this.where__id__more_than = where__id__more_than;
        this.where__id__less_than = where__id__less_than;
        this.order__createdAt = order__createdAt;
        this.take = take;
    }

    page?: number;
    /**
     * 이전 마지막 데이터의 ID
     * 이것 이후로 데이터를 가져와야함
     * ASC와 짝궁(같이 사용해야함)
     */
    where__id__more_than?: number;

    /**
     * DESC와 짝궁
     */
    where__id__less_than?: number;

    order__createdAt?: 'ASC' | 'DESC' = 'ASC'; //기본값은 ASC

    /**
     * 몇개의 데이터를 가져올건지
     */
    take: number = 10;
}