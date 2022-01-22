import { IconButton } from "./Buttons"
import { ListIcon, EditPencilIcon, MinusIcon, PlusIcon, LinkIcon } from "./Icons"
import { Popover } from '@headlessui/react'

export default function Toolbar({ toggleLeftPane, onStartEditing, currentSong }) {
    function openCurrentSongInNewTab(event) {
        event && event.preventDefault();
        window.open(`/song/${currentSong.id}`, '_blank')
    }

    return <div className="toolbar fixed top-0 left-0 w-full border-b border-gray-700 border-opacity-50 bg-gray-900 z-10" style={{ height: '45px', top: '45px' }}>
        <div className="h-full mx-auto px-4 flex items-center justify-between">
            <div className="toolbar-left flex items-center justify-start" style={{ width: '65px' }}>
                <IconButton onClick={toggleLeftPane}>
                    <ListIcon />
                </IconButton>
                <ToolbarDivider />
            </div>
            <div className="flex-1">
                <div className="mx-auto flex items-center justify-between">
                    <div className="flex items-center">
                        <TransposeButton><MinusIcon /></TransposeButton>
                        <span className="text-white text-sm font-light px-3">Transpose</span>
                        <TransposeButton><PlusIcon /></TransposeButton>
                    </div>
                    <IconButton onClick={openCurrentSongInNewTab}>
                        <LinkIcon />
                    </IconButton>
                </div>
            </div>
            <div className="block md:hidden flex items-center justify-center">

            </div>
            <div className="ml-auto flex items-center justify-end" style={{ width: '65px' }}>
                <ToolbarDivider />
                <IconButton onClick={onStartEditing}>
                    <EditPencilIcon />
                </IconButton>
            </div>
        </div>
    </div >
}

export function ToolbarDivider() {
    return <div className="mx-3 lg:mx-6 h-6 border-r border-gray-700 border-opacity-80"></div>
}

export function ChangeSongKeyPopover({ buttonText }) {
    return (
        <Popover className="relative">
            <Popover.Button className="text-primary-400 py-1 px-2 focus:outline-none active:scale-95 active:opacity-80">{buttonText}</Popover.Button>

            <Popover.Panel className="absolute z-10 bg-gray-800 bg-opacity-70 backdrop-blur-md text-white border border-gray-700 shadow-xl rounded-lg" style={{ width: '240px', left: '-100px', top: 'calc(100% + 0.5rem)' }}>
                <div className="text-white font-semibold flex items-center justify-center text-base border-b border-gray-700" style={{ height: "45px" }}>
                    Options
                </div>
                <div className="py-3 px-3 flex items-center justify-between text-base font-light text-gray-400 border-b border-gray-700">
                    <TransposeButton><MinusIcon /></TransposeButton>
                    Transpose
                    <TransposeButton><PlusIcon /></TransposeButton>
                </div>
            </Popover.Panel>
        </Popover>
    )
}

export function TransposeButton({ children }) {
    return <button className="text-primary-400 rounded-full w-6 h-6 flex items-center justify-center border border-primary-400 active:bg-primary-400 active:bg-opacity-10 rounded-md">
        {children}
    </button>
}

export function YoutubeVideoPopover({ buttonText, youtubeLink }) {
    return (
        <Popover className="relative">
            <Popover.Button className="text-primary-400 py-1 px-2 focus:outline-none active:scale-95 active:opacity-80">{buttonText}</Popover.Button>

            <Popover.Panel className="absolute z-10 bg-gray-800 bg-opacity-70 backdrop-blur-md text-white border border-gray-700 shadow-xl rounded-lg" style={{ width: '280px', left: '-100px', top: 'calc(100% + 0.5rem)' }}>
                <div className="text-white font-semibold flex items-center justify-center text-base border-b border-gray-700" style={{ height: "45px" }}>
                    Media
                </div>
                <div className="py-3 px-3 flex items-center justify-between text-base font-light text-gray-400 border-b border-gray-700">

                </div>
            </Popover.Panel>
        </Popover>
    )
}