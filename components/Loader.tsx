import React from 'react'
import Image from 'next/image'

//这是一个加载器组件，用于在加载数据时显示一个加载器
const Loader = () => {
  return (
    <div className='flex-center h-screen w-full'>
        <Image
            src='/icons/loading-circle.svg'
            alt='Loading'
            width={50}
            height={50}
        />
    </div>
  )
}

export default Loader