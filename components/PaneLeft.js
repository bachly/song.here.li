export default function ({ title, state, children }) {
    return <div className={`left-pane left-pane--${state} absolute transition transform duraiton-200 bg-gray-800 border-r border-gray-700 border-opacity-50 z-50`}>
        <div className="left-pane__header border-b border-gray-700 border-opacity-50" style={{ height: '45px' }}>
            <div className="h-full flex items-center px-4 justify-center select-none">
                <span className="text-white font-light text-xl">{title}</span>
            </div>
        </div>
        <div className="left-pane__inner">
            <div className="text-white">
                {children}
            </div>
        </div>
    </div>
}