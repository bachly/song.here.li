export function IconButton({ onClick, children }) {
    return <button onClick={onClick} className="duration-100 transition transform active:opacity-80 active:scale-90 rounded-md">
        <div className="text-primary-400 select-none">
            {children}
        </div>
    </button>
}