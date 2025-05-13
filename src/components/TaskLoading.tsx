import React from 'react'

type TaskLoadingComponentProps={
  view:'ROWS'|'GRID'
}

const TaskLoadingComponent: React.FC<TaskLoadingComponentProps> = ({view}) => {
  return (
    <div className='flex flex-col gap-2'>
      <h1 className="animate-pulse mb-2 bg-gray-200 dark:bg-zinc-700/50 rounded h-10 sm:w-[50%]"></h1>
      <div className={`grid ${view === 'ROWS' ? 'grid-cols-1' : 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3'} auto-rows-auto gap-2`}>
        <div className="animate-pulse h-[120px] bg-gray-200 dark:bg-zinc-700/50 rounded"></div>
        <div className="animate-pulse h-[120px] bg-gray-200 dark:bg-zinc-700/50 rounded"></div>
        <div className="animate-pulse h-[120px] bg-gray-200 dark:bg-zinc-700/50 rounded"></div>
       
      </div>
    </div>
  )
}


const TaskLoading: React.FC<TaskLoadingComponentProps> = ({view}) => {
  return (
    <div id='task-loading' className='flex flex-col gap-8'>
      <TaskLoadingComponent view={view}/>
      <TaskLoadingComponent view={view} />
        <TaskLoadingComponent view={view}/>
        <TaskLoadingComponent view={view} />
    </div>
  )
}

export default TaskLoading
