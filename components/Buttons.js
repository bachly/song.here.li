export function IconButton({ onClick, children }) {
    return <button onClick={onClick} className="p-1 duration-100 transition transform hover:bg-gray-700 hover:bg-opacity-50 active:opacity-80 active:scale-95 rounded-md">
        <div className="text-primary-400 select-none">
            {children}
        </div>
    </button>
}