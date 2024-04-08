'use server';

import { currentUser } from "@clerk/nextjs/server";
import { StreamClient } from "@stream-io/node-sdk";

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const apiSecret = process.env.STREAM_SECRET_KEY;

export const tokenProvider = async () => {
    const user = await currentUser();
  
    if (!user) throw new Error('User is not logged in');
    if (!apiKey) throw new Error('Stream API key secret is missing');
    if (!apiSecret) throw new Error('Stream API secret is missing');

    const client = new StreamClient(apiKey, apiSecret);

    //一小时后过期
    const exp = Math.round(new Date().getTime() / 1000) + 60 * 60;

    // 60秒前签发
    const issued = Math.floor(Date.now() / 1000) - 60;

    // 生成token的时候, 传入用户的id, 过期时间, 签发时间
    const token = client.createToken(user.id, exp, issued);

    return token;

}