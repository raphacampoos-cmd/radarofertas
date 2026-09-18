import { TwitterApi } from 'twitter-api-v2';

async function test() {
  const client = new TwitterApi({
    appKey: process.env.TWITTER_API_KEY,
    appSecret: process.env.TWITTER_API_SECRET,
    accessToken: process.env.TWITTER_ACCESS_TOKEN,
    accessSecret: process.env.TWITTER_ACCESS_SECRET,
  });

  try {
    const me = await client.v2.me();
    console.log('Success:', me.data);
  } catch (err) {
    console.error('Error:', err.data || err);
  }
}

test();
