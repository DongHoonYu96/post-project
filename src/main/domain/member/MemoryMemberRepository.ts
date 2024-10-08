import { Member } from "./Member";

export class MemoryMemberRepository {
    private static instance: MemoryMemberRepository | null = null;
    // private store: Map<number, Member> = new Map();
    private store: Map<string, Member> = new Map();
    private sequence: number = 0;

    /**
     * 생성자를 private으로 선언하여 외부에서 직접 인스턴스를 생성할 수 없게 합니다.
     */
    private constructor() {}

    /**
     * MemberRepository의 유일한 인스턴스를 반환합니다.
     * 인스턴스가 없으면 새로 생성하여 반환합니다.
     * @returns {MemoryMemberRepository} MemberRepository의 유일한 인스턴스
     */
    public static getInstance(): MemoryMemberRepository {
        if (MemoryMemberRepository.instance === null) {
            MemoryMemberRepository.instance = new MemoryMemberRepository();
        }
        return MemoryMemberRepository.instance;
    }

    /**
     * 새로운 Member를 저장소에 추가합니다.
     * @param {Member} member - 저장할 Member 객체
     * @returns {number} 저장된 Member
     */
    public save(member: Member): Member {
        member.setId(++this.sequence);

        if(this.store.has(member.getEmail())){
            console.log('이미 존재하는 email 입니다.' + member.getEmail());
            return;
            // throw new Error('이미 존재하는 email 입니다.' + member.getEmail());
        }

        this.store.set(member.getEmail(), member);
        return member;
    }

    /**
     * ID로 Member를 조회합니다.
     * @param {number} id - 조회할 Member의 ID
     * @returns {Member | undefined} 조회된 Member 객체 또는 undefined
     */
    // public findById(id: number): Member | undefined {
    //     return this.store.get(id);
    // }

    public findByEmail(email: string): Member | undefined {
        return this.store.get(email);
    }

    /**
     * 모든 Member를 반환합니다.
     * @returns {Member[]} 저장된 모든 Member 객체의 배열
     */
    public findAll(): Member[] {
        return Array.from(this.store.values());
    }
}