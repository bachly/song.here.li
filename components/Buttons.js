import { CheckIcon } from "./Icons"

export function IconButton({ onClick, children }) {
    return <button onClick={onClick} className="p-1 duration-100 transition transform hover:bg-gray-700 hover:bg-opacity-50 active:opacity-80 active:scale-95 rounded-md">
        <div className="text-primary-400 select-none">
            {children}
        </div>
    </button>
}

export function AsyncButton({ children, onClick, loading, success }) {
    if (loading) {
        return <button
            className={`w-20 h-8 text-gray-400 bg-gray-800 text-xl p-1 px-2 rounded-md scale-90 flex items-center justify-center`}>
            <div class="lds-spinner"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
        </button>
    }

    if (success) {
        return <button
            className={`w-20 h-8 text-primary-400 bg-gray-800 text-xl p-1 px-2 rounded-md flex items-center justify-center`}>
            <CheckIcon />
        </button>
    }

    return <button onClick={onClick}
        className={`w-20 h-8 text-primary-400 text-opacity-80 text-xl p-1 px-2 rounded-md hover:bg-gray-800 hover:text-opacity-100 active:scale-90 duration-100 transition flex items-center justify-center`}>
        {children}
    </button>
}