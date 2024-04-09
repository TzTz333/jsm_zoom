import { cn } from '@/lib/utils'
import { CallControls, CallParticipantListing, CallParticipantsList, CallStatsButton, CallingState, PaginatedGridLayout, SpeakerLayout, useCallStateHooks } from '@stream-io/video-react-sdk'
import React, { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LayoutList, Loader, User } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import EndCallButton from './EndCallButton'



type CallLayoutType = 'speaker-left' | 'speaker-right' | 'grid'

const MeetingRoom = () => {
  //获取当前的url参数
  const searchParams = useSearchParams();
  //判断是否是个人房间,!!是将后面的值转换为布尔值
  const isPersonalRoom = !!searchParams.get('personal')
  const [layout, setLayout] = useState('speaker-left')
  const [showParticipants, setshowParticipants] = useState(false)
  //获取当前的通话状态
  const {useCallCallingState} = useCallStateHooks();
  const callingState = useCallCallingState();

  if(callingState !== CallingState.JOINED) return <Loader />



  //根据layout的值返回不同的布局，这里只有三种布局，分别是grid、speaker-right、speaker-left，
  const CallLayout = () => {
    switch (layout) {
      // grid布局，所有视频都在一起
      case 'grid':
        return <PaginatedGridLayout />
      // speaker-left布局，参与者栏在左侧，视频在右侧
      case 'speaker-right':
        return <SpeakerLayout
        participantsBarPosition="left" />
      // speaker-right布局，参与者栏在右侧，视频在左侧
      default:
        return <SpeakerLayout
        participantsBarPosition="right" />
    }
  }

  return (
    <section className='relative h-screen w-full overflow-hidden pt-4 text-white'>
      <div className='relative flex size-full items-center justify-center'>
        <div className='flex size-full max-w-[1000px] items-center'>
          <CallLayout />
        </div>
        <div className={cn('h-[calc(100vh-86px)] hidden ml-2',{'show-block':showParticipants})}>
          <CallParticipantsList onClose={() => setshowParticipants(false)}/>
        </div>
      </div>

      <div className='fixed bottom-0 flex w-full items-center justify-center gap-5 flex-wrap'>
        <CallControls />

        <DropdownMenu>

          <div className='flex items-center'>
            <DropdownMenuTrigger className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
              <LayoutList size={20} className='text-white' />
            </DropdownMenuTrigger>
          </div>

          <DropdownMenuContent className='border-dark-1 bg-dark-1 text-white'>
            {['Grid', 'Speaker Left', 'Speaker Right'].map((item, index) => (
              <div key={index}>
                <DropdownMenuItem
                className='cursor-pointer'
                onClick={() => {
                  setLayout(item.toLowerCase() as CallLayoutType)
                }}>
                  {item}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
              </div>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <CallStatsButton />
        <button onClick={() => setshowParticipants((prev) => !prev)}> 
            <div className='cursor-pointer rounded-2xl bg-[#19232d] px-4 py-2 hover:bg-[#4c535b]'>
              <User size={20} className='text-white' />
            </div>
        </button>
        {!isPersonalRoom && <EndCallButton />}

      </div>
    </section>
  )
}

export default MeetingRoom