"use client"

import { useState } from 'react';
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { useUser } from '@clerk/nextjs';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useToast } from "@/components/ui/use-toast"
import { Textarea } from './ui/textarea';
import ReactDatePicker from 'react-datepicker'
import { Input } from './ui/input';



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

    const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`

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
            title = '查看录音'
            description = '查看以前的会议录音'
            handleClick = {() => router.push('/recordings')}
            className = 'bg-purple-1'
        />
        <HomeCard 
            img = '/icons/join-meeting.svg'
            title = '参加会议'
            description = '邀请链接或会议号加入会议'
            handleClick = {() => setMeetingState('isJoiningMeeting')}
            className = 'bg-yellow-1'
        />

        {!callDetails ? (
            <MeetingModal 
                isOpen={MeetingState === 'isScheduleMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="创建会议"
                handleClick={createMeeting}
            >
                <div className='flex flex-col gap-2.5'>
                    <label className='text-base text-normal leading-[22px] text-sky-2'>添加描述</label>
                    <Textarea className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                    onChange={(e) => {
                        setValues({...values, description: e.target.value})
                    }}/>
                </div>
                <div className='flex w-full flex-col gap-2.5'>
                    <label className='text-base text-normal leading-[22px] text-sky-2'>选择日期和时间</label>
                    <ReactDatePicker
                        selected={values.dateTime}
                        onChange={(date) => setValues({...values, dateTime: date!})}
                        showTimeSelect
                        timeFormat='HH:mm'
                        timeIntervals={15}
                        timeCaption='时间'
                        dateFormat={'MMMM d, yyyy h:mm aa'}
                        className='w-full rounded bg-dark-3 p-2 focus:outline-none'
                        />
                </div>
            </MeetingModal>
        ) : (
            <MeetingModal 
                isOpen={MeetingState === 'isScheduleMeeting'}
                onClose={() => setMeetingState(undefined)}
                title="开始一个即时会议"
                className='text-center'
                handleClick={() => {
                    navigator.clipboard.writeText(meetingLink);
                    toast({title: '会议链接已复制到剪贴板'})
                }}
                image='/icons/checked.svg'
                buttonIcon='/icons/copy.svg'
                buttonText='复制会议链接'
            />
        )}

        <MeetingModal 
            isOpen={MeetingState === 'isInstantMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="开始一个即时会议"
            className='text-center'
            buttonText="开始会议"
            handleClick={createMeeting}
        />


        <MeetingModal 
            isOpen={MeetingState === 'isJoiningMeeting'}
            onClose={() => setMeetingState(undefined)}
            title="导入会议链接"
            className='text-center'
            buttonText="加入会议"
            handleClick={() => router.push(values.link)}
        >
            <Input
                placeholder='输入会议链接'
                className='border-none bg-dark-3 focus-visible:ring-0 focus-visible:ring-offset-0'
                onChange={(e) => setValues({...values, link:e.target.value})}
            />
        </MeetingModal>




    </section>
  )
}

export default MeetingTypeList