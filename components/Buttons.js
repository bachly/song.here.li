import clsx from "clsx"
import React from "react"
import { CheckIcon, MinusIcon, MoreHorzIcon, PlusIcon } from "./Icons"
import Spinner from "./Spinner"

export function IconButton({ onClick, children }) {
    return <button onClick={onClick} className="p-1 duration-100 transition ease-in-out transform active:opacity-60 active:scale-90 rounded-md">
        <div className="text-primary-400 select-none">
            {children}
        </div>
    </button>
}

export function AsyncButton({ children, onClick, loading, success }) {
    if (loading) {
        return <button
            className={`w-20 h-8 text-gray-400 text-base p-1 px-2 rounded-md scale-90 flex items-center justify-center`}>
            <Spinner />
        </button>
    }

    if (success) {
        return <button
            className={`w-20 h-8 text-primary-400 text-xl p-1 px-2 rounded-md flex items-center justify-center`}>
            <CheckIcon />
        </button>
    }

    return <button onClick={onClick}
        className={`w-20 h-8 text-primary-400 text-opacity-80 text-xl p-1 px-2 rounded-md hover:text-opacity-100 active:scale-90 duration-100 transition ease-in-out flex items-center justify-center`}>
        {children}
    </button>
}

export function Button({ children, onClick }) {
    return <button onClick={onClick}
        className={`w-20 h-8 text-white text-opacity-80 text-base p-1 px-2 rounded-md hover:text-opacity-60 active:scale-90 duration-100 transition ease-in-out flex items-center justify-center`}>
        {children}
    </button>
}

export function DropdownButton({ children }) {
    const [showDropdown, setShowDropdown] = React.useState(false);

    function toggleDropdown(event) {
        event && event.preventDefault();

        if (showDropdown) {
            setShowDropdown(false);
        } else {
            setShowDropdown(true);

            $(window).one('click', () => {
                setShowDropdown(false);
            })
        }
    }

    return <div onClick={event => event.stopPropagation()} className="dropdown-wrapper relative select-none">
        <button onClick={toggleDropdown}
            className={clsx(showDropdown ? "bg-primary-400 bg-opacity-50 text-white" : "text-primary-400 hover:bg-primary-400 hover:bg-opacity-20", "p-1 duration-100 transition ease-in-out transform active:opacity-60 active:scale-90 rounded-md")}>
            <MoreHorzIcon />
        </button>
        {showDropdown ?
            <div className="dropdown absolute top-100 z-30 right-0 py-1" style={{ width: "240px" }}>
                <div className="border border-gray-700 border-opacity-70 bg-gray-900 rounded-md py-1 shadow-2xl">
                    {children}
                </div>
            </div> : <></>}
    </div>
}