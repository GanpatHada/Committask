import React from 'react'

const Loading: React.FC = () => {
    return (
        <div className='h-screen flex justify-center items-center flex-1 flex-col bg-white dark:bg-zinc-700'>
            <img
                src={'/main-logo.svg'}
                alt='main-logo'
                className='h-[80px]'
            />
            <div className="flex items-center justify-center space-x-2 my-3">
                <div className="w-3 h-3 bg-purple-800 rounded-full animate-bounce"></div>
                <div className="w-3 h-3 bg-purple-700 rounded-full animate-bounce animation-delay-200"></div>
                <div className="w-3 h-3 bg-purple-600 rounded-full animate-bounce animation-delay-400"></div>
            </div>

        </div>
    )
}

export default Loading
