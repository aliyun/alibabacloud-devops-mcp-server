import dotenv from 'dotenv';
import { setCurrentSessionToken } from '../common/utils.js';

dotenv.config();

const token = process.env.YUNXIAO_ACCESS_TOKEN;
if (!token) {
  throw new Error('YUNXIAO_ACCESS_TOKEN is not set in .env');
}

setCurrentSessionToken(token);

export const TEST_ORG_ID = '5ebbc0408123212b59d58347';
