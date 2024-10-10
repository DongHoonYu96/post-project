import { Member } from "./Member";
import { AppDataSource } from "../../repositories/AppDataSource";
import { Repository } from "typeorm";

export class MemberRepository {
    private static instance: MemberRepository | null = null;
    private readonly memberRepository: Repository<Member>;

    private constructor() {
        this.memberRepository = AppDataSource.getInstance().getRepository(Member);
    }

    public getRepo(){
        return this.memberRepository;
    }

    /**
     * MemberRepository의 유일한 인스턴스를 반환합니다.
     * 인스턴스가 없으면 새로 생성하여 반환합니다.
     * @returns {MemberRepository} MemberRepository의 유일한 인스턴스
     */
    public static getInstance(): MemberRepository {
        if (MemberRepository.instance === null) {
            MemberRepository.instance = new MemberRepository();
        }
        return MemberRepository.instance;
    }

    /**
     * 새로운 Member를 저장소에 추가합니다.
     * @param {Member} member - 저장할 Member 객체
     * @returns {Promise<Member>} 저장된 Member
     */
    public async save(member: Member): Promise<Member> {
        try {
            return await this.memberRepository.save(member);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                console.log('이미 존재하는 email 입니다.' + member.getEmail());
                // throw new Error('이미 존재하는 email 입니다.' + member.getEmail());
            }
            // throw error;
        }
    }

    /**
     * Email로 Member를 조회합니다.
     * @param {string} email - 조회할 Member의 Email
     * @returns {Promise<Member | null>} 조회된 Member 객체 또는 null
     */
    public async findByEmail(email: string): Promise<Member | null> {
        return await this.memberRepository.findOne({ where: { email } });
    }

    public async findById(id: number): Promise<Member | null> {
        return await this.memberRepository.findOne({ where:  { id } });
    }

    /**
     * 모든 Member를 반환합니다.
     * @returns {Promise<Member[]>} 저장된 모든 Member 객체의 배열
     */
    public async findAll(): Promise<Member[]> {
        return await this.memberRepository.find();
    }
}