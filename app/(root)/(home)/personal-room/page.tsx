

import { useUser } from "@clerk/nextjs";
import React from 'react'

const Table = ({title,description}:{title:string; description:string;}) => (
  <div>
    <h1>{title}:</h1>
    <h1>{description}</h1>
  </div>
)


const PersonalRoom = () => {
  const { user } = useUser();
  return (
    <section className='flex size-full flex-col gap-10 text-white'>
      <h1 className='text-3xl font-bold'>
        PersonalRoom
      </h1>
      <div className='flex w-full flex-col gap-8 xl:max-w-[900px]'>
        <Table title="主题" description={`${user?.username}的会议室`}  />
      </div>
    </section>
  )
}

export default PersonalRoom