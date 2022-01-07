import { CheckIcon } from "./Icons"
import Spinner from "./Spinner"

export function IconButton({ onClick, children }) {
    return <button onClick={onClick} className="p-1 duration-100 transition transform active:opacity-80 active:scale-95 rounded-md">
        <div className="text-primary-400 select-none">
            {children}
        </div>
    </button>
}

export function AsyncButton({ children, onClick, loading, success }) {
    if (loading) {
        return <button
            className={`w-20 h-8 text-gray-400 text-xl p-1 px-2 rounded-md scale-90 flex items-center justify-center`}>
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
        className={`w-20 h-8 text-primary-400 text-opacity-80 text-xl p-1 px-2 rounded-md hover:text-opacity-100 active:scale-90 duration-100 transition flex items-center justify-center`}>
        {children}
    </button>
}

export function Button({ children, onClick }) {
    return <button onClick={onClick}
        className={`w-20 h-8 text-white text-opacity-80 text-xl p-1 px-2 rounded-md hover:text-opacity-100 active:scale-90 duration-100 transition flex items-center justify-center`}>
        {children}
    </button>
}