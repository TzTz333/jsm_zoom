'use client';
import { tokenProvider } from '@/actions/stream.action';
import { useUser } from '@clerk/nextjs';
import {StreamVideoClient,StreamVideo} from '@stream-io/video-react-sdk';
import { Loader } from 'lucide-react';
import { ReactNode, useEffect, useState } from 'react';
  
 const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY;
  
 //为其子组件提供 Stream 视频客户端的上下文
 const StreamVideoProvider = ({children}:{children:ReactNode}) => {
    //使用 Clerk 的 useUser 钩子获取当前用户
    const [videoClient, setvideoClient] = useState<StreamVideoClient>()
    const {user, isLoaded} = useUser();

    //使用 useEffect 钩子创建 Stream 视频客户端的实例
    //用来在组件加载后创建 StreamVideoClient 的实例
    useEffect(() => {
        if(!isLoaded || !user) return;
        if(!apiKey) throw new Error('Stream API key is missing');

        //创建 StreamVideoClient 的实例，并将其设置为 videoClient 的状态
        const client = new StreamVideoClient({
            apiKey,
            user: {
                id: user.id,
                name: user?.username || user?.id,
                image: user?.imageUrl,
            },
            tokenProvider,
        })
        setvideoClient(client);

    },[user, isLoaded]);

    //如果 videoClient 不存在，则返回一个加载器
    if(!videoClient) return <Loader />

    return (
      <StreamVideo client={videoClient}>
        {children}
      </StreamVideo>
    );
  };

  export default StreamVideoProvider;
