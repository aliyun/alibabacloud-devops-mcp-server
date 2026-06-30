import dotenv from 'dotenv';

dotenv.config();

if (!process.env.YUNXIAO_ACCESS_TOKEN) {
  throw new Error('YUNXIAO_ACCESS_TOKEN is not set in .env');
}

export const TEST_ORG_ID = '5ebbc0408123212b59d58347';
