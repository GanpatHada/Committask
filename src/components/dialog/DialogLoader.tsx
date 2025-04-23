import React from 'react'

const DialogLoader:React.FC = () => {
 return (
     <div id="loader" className=' absolute h-full w-full flex items-center justify-center bg-zinc-800/70'>
       <div className="animate-spin duration-300 inline-block size-12 border-5 border-current border-t-transparent text-purple-500 rounded-full" role="status" aria-label="loading">
         <span className="sr-only">Loading...</span>
       </div>
     </div>
   )
}

export default DialogLoader
