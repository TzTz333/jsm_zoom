"use client"

import { useState } from 'react';
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from "@/components/ui/use-toast"



const MeetingTypeList = () => {
    const router = useRouter();
    const [MeetingState, setMeetingState] = 
    useState<'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined>();
    const {user} = useUser();
    const client = useStreamVideoClient();

    const [values, setValues] = useState({
        dateTime: new Date(),
        description: '',
        link: '',
    })
    const [callDetails, setcallDetails] = useState<Call>()
    const { toast } = useToast()

    const createMeeting = async () => {
        if(!client || !user) return;

        try {
            if(!values.dateTime) {
                toast({title: '请选择会议时间'})
                return;
            }


            const id = crypto.randomUUID();
            const call = client.call('default',id);

            if(!call) throw new Error('Failed to create call');

            const startsAt = values.dateTime.toISOString() || new Date(Date.now()).toISOString();
            const description = values.description || 'Instant Meeting';

            await call.getOrCreate({
                data: {
                    starts_at: startsAt,
                    custom: {
                        description,
                    }
                }
            })

            setcallDetails(call);

            if(!values.description){
                router.push(`/meeting/${id}`);
            }
            toast({title: '会议创建成功'})
        } catch (error) {
            console.log(error);
            toast({title: "创建会议失败",})
        }
    }

  return (
    <section className='grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4'>
        <HomeCard 
            img = '/icons/add-meeting.svg'
            title = '新建会议'
            description = '开始一个即时会议'
            handleClick = {() => setMeetingState('isInstantMeeting')}
            className = 'bg-orange-1'
        />
        <HomeCard 
            img = '/icons/schedule.svg'
            title = '会议安排'
            description = '计划你的会议日程'
            handleClick = {() => setMeetingState('isScheduleMeeting')}
            className = 'bg-blue-1'
        />
        <HomeCard 
            img = '/icons/recordings.svg'
            title = '查看记录'
            description = '查看以前的会议记录'
            handleClick = {() => setMeetingState('isJoiningMeeting')}
            className = 'bg-purple-1'
        />
        <HomeCard 
            img = '/icons/join-meeting.svg'
            title = '参加会议'
            description = '邀请链接或会议号加入会议'
            handleClick = {() => setMeetingState('isJoiningMeeting')}
            className = 'bg-yellow-1'
        />

        <MeetingModal 
            isOpen={MeetingState === 'isInstantMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="开始一个即时会议"
            buttonText="开始会议"
            handleClick={createMeeting}
        />

    </section>
  )
}

export default MeetingTypeList