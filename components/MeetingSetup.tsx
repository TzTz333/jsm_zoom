import { DeviceSettings, VideoPreview, useCall } from '@stream-io/video-react-sdk'
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import Meeting from '../app/(root)/meeting/[id]/page';

const MeetingSetup = ({setisSetupComplete}:{setisSetupComplete:(value:boolean) => void}) => {
  //判断是否打开了麦克风和摄像头
  const [isMicCamToggledOn, setisMicCamToggledOn] = useState(false)
  const call = useCall();

  if(!call) {
    throw new Error('useCall must be used within a StreamCall component')
  }  

  //当摄像头和麦克风状态改变时，更新状态
  useEffect(() => {
    if(isMicCamToggledOn) {
      call?.camera?.disable()
      call?.microphone?.disable()
    } else {
      call?.camera?.enable()
      call?.microphone?.enable()
    }
  },[isMicCamToggledOn,call?.camera, call?.microphone])

  return (
    <div className='flex h-screen w-full flex-col items-center justify-center gap-3 text-white'>
      <h1 className='text-2xl font-bold'>Setup</h1>
      <VideoPreview />
      <div className='flex h-16 items-center justify-center gap-2 font-medium'>
        <label className='flex items-center justify-center gap-2 font-medium'>
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setisMicCamToggledOn(e.target.checked)} 
          />
          关闭麦克风和摄像头
        </label>
        <DeviceSettings />
      </div>
      <Button className='rounded-md bg-green-500 px-4 py-2.5' onClick={() => {
        call.join();
        setisSetupComplete(true);
      }}>
        Join Meeting
      </Button>
    </div>
  )
}

export default MeetingSetup