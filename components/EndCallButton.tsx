"use client"
import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import React from 'react'
import { Button } from './ui/button';
import { useRouter } from 'next/navigation';

const EndCallButton = () => {
    //获取当前的call对象
    const call = useCall();
    //获取router对象
    const router = useRouter();
    //获取本地参与者,这里的useLocalParticipant是一个自定义的hook
    const {useLocalParticipant} = useCallStateHooks();
    const localParticipant = useLocalParticipant();

    //判断是否是会议的创建者
    const isMeetingOnwer = localParticipant && call?.state.createdBy 
                             && localParticipant.userId === call.state.createdBy.id;

    //如果不是会议的创建者，返回null                         
    if(!isMeetingOnwer) return null;

    return (
        <Button onClick={async () => {
            await call.endCall();
            router.push('/');
        }} className='bg-red-500'>
            结束会议
        </Button>
    )

}

export default EndCallButton