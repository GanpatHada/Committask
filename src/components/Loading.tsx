import Image from 'next/image'
import React from 'react'

const Loading: React.FC = () => {
    return (
        <div className='h-screen flex justify-center items-center flex-1 flex-col'>
            <Image
                src={'/main-logo.svg'}
                alt='main-logo'
                height={100}
                width={100}
                priority
            />
            <div className="flex items-center justify-center space-x-2 my-3">
                <div className="w-3 h-3 bg-violet-800 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-violet-700 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-3 h-3 bg-violet-600 rounded-full animate-bounce animation-delay-400"></div>
            </div>

        </div>
    )
}

export default Loading
