import { createClient } from 'redis';
import * as dotenv from 'dotenv';

dotenv.config(); // env환경변수 파일 가져오기

export const RedisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.PORT_REDIS}`,
    socket: {
        reconnectStrategy: (retries) => {
            if (retries > 10) {
                console.error('Redis 연결 최대 재시도 횟수 초과');
                return new Error('Redis 연결 실패');
            }
            return Math.min(retries * 100, 3000);
        },
    },
});

RedisClient.on('error', (err) => console.error('Redis 클라이언트 에러:', err));
RedisClient.on('connect', () => console.log('Redis에 연결되었습니다.'));
RedisClient.on('reconnecting', () => console.log('Redis에 재연결 중...'));

(async () => {
    await RedisClient.connect();
})();