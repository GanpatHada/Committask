import { capitalize } from '@/app/globalUtils';
import useClickOutside from '@/hooks/useClickOutside';
import { AppDispatch, RootState } from '@/store/store';
import React, { useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { applyPriorityFilter, applySortFieldFilter, applySortOrderFilter, clearAllFilters, toggleIncludeCompleted } from '@/store/slices/todoSlice';
import { Priority } from '@/generated/prisma';
import { RiFlag2Fill } from 'react-icons/ri';
const priorities = ["LOW", "MEDIUM", "HIGH"]



type FilterPopupPropType = {
    filterButtonRef: React.RefObject<HTMLButtonElement | null>;
    closePopup: () => void;
    popup: boolean
}

const getPriorityColor = (priority: Priority) => {
    if (priority === "LOW") return " text-green-500 ";
    if (priority === "MEDIUM") return "text-yellow-500 ";
    if (priority === "HIGH") return "text-red-500 ";
};

const FilterPopup: React.FC<FilterPopupPropType> = ({ filterButtonRef, closePopup, popup }) => {

    const popupRef = useRef<HTMLDivElement | null>(null);
    const filter = useSelector((state: RootState) => state.todos.filter)
    const dispatch = useDispatch<AppDispatch>();

    const handleSortFieldChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(applySortFieldFilter(e.target.value as "PRIORITY" | "DEADLINE"))
    };
    const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(applySortOrderFilter(e.target.value as "ASC" | "DESC"))
    };

    const handlePrioritySelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        dispatch(applyPriorityFilter(e.target.value as Priority));
    }

    useClickOutside(popupRef as React.RefObject<HTMLElement>, closePopup, filterButtonRef)

    return (
        <div id='filter-popup' ref={popupRef} className={`absolute w-50 top-16 right-0 z-10 rounded-md overflow-hidden origin-top-right transition-all duration-300 ease-in-out ${popup ? 'scale-100 opacity-100' : 'scale-0 opacity-0'} bg-white border-1 border-gray-300 dark:bg-zinc-800 dark:border-zinc-600
            
`}>
            <header className='p-2 border-b-1 text-gray-600 dark:text-zinc-300 border-gray-200 dark:border-zinc-700'>Filters</header>
            <div className="p-3">
                <section id="priority">
                    <h3 className='mb-2 text-gray-400 dark:text-zinc-500 text-sm'>PRIORITY</h3>
                    {
                        priorities.map((priority, index) => {
                            return <div key={index} className="flex items-center">
                                <input
                                    type="checkbox"
                                    id={`priority-${index}`}
                                    name="priority"
                                    value={priority}
                                    className="form-checkbox bg:white dark:bg-zinc-500 text-xs mr-2"
                                    onChange={handlePrioritySelect}
                                    checked={filter.priority.includes(priority as Priority)}

                                />
                                <span className={`${getPriorityColor(priority as Priority)}`}><RiFlag2Fill /></span>
                                <label htmlFor={`priority-${index}`} className="text-sm ml-1 text-gray-600 dark:text-zinc-400">
                                    {capitalize(priority)}
                                </label>
                            </div>
                        })
                    }
                </section>
                <section id="sort-by">
                    <h3 className='my-2 text-gray-400 dark:text-zinc-500 text-sm'>SORT BY</h3>
                    <div>

                        <div className="flex items-center justify-between gap-2">
                            <label htmlFor="order" className="text-xs text-gray-600 dark:text-zinc-400">Field:</label>
                            <select
                                id="order"
                                value={filter.sortField}
                                onChange={handleSortFieldChange}
                                className="p-1 border-1 w-30 text-gray-500 dark:text-zinc-300 dark:border-zinc-600 border-gray-200 text-xs rounded-md focus:outline-0"
                            >

                                <option className='dark:bg-zinc-700' value="SELECT">Select</option>
                                <option className='dark:bg-zinc-700' value="PRIORITY">Priority</option>
                                <option className='dark:bg-zinc-700' value="DEADLINE">Deadline</option>
                            </select>
                        </div>
                        <div className="flex items-center mt-2 gap-2 justify-between">
                            <label htmlFor="order" className="text-gray-600 dark:text-zinc-400 text-xs">Order:</label>
                            <select
                                disabled={filter.sortField === 'SELECT'}
                                id="order"
                                value={filter.sortOrder}
                                onChange={handleSortOrderChange}
                                className="p-1 border-1 disabled:dark:bg-zinc-500 disabled:bg-gray-200 disabled:opacity-50 border-gray-200
                            w-30  text-gray-500 dark:text-zinc-300 dark:border-zinc-600 rounded-md text-xs focus:outline-0"
                            >
                                <option className='dark:bg-zinc-700' value="ASC">Ascending</option>
                                <option className='dark:bg-zinc-700' value="DESC">Descending</option>
                            </select>
                        </div>
                    </div>
                </section>
                <section id="priority" className='mt-4'>
                    <h3 className='mb-2 text-gray-400 dark:text-zinc-500 text-sm'>STATUS</h3>
                    <div className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            id='includes-completed'
                            name="priority"
                            value={'COMPLETED'}
                            className="form-checkbox bg:white dark:bg-zinc-500 text-xs"
                            checked={filter.includeCompleted}
                            onChange={() => dispatch(toggleIncludeCompleted())}

                        />
                        <label htmlFor='includes-completed' className="text-sm text-gray-600 dark:text-zinc-400">
                            include completed
                        </label>
                    </div>



                </section>

            </div>
            <footer className='p-3 bg-gray-100 dark:bg-zinc-700/50'>
                    <button
                    onClick={()=>dispatch(clearAllFilters())}
                    className='bg-white active:brightness-150 dark:bg-zinc-600 text-gray-600 dark:text-white  text-sm px-2 py-1 rounded-md'>Clear</button>   
            </footer>
        </div>
    )
}

export default FilterPopup
