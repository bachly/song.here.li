import { DropdownButton, IconButton } from "./Buttons"
import { ListIcon, EditPencilIcon, MinusIcon, PlusIcon, LinkIcon } from "./Icons"
import { Popover } from '@headlessui/react'
import Spinner from "./Spinner";

export default function Toolbar({ toggleLeftPane, onStartEditing, currentSong, loading, currentTranpose, onTranspose }) {
    function openCurrentSongInNewTab(event) {
        event && event.preventDefault();
        window.open(`/${currentSong.id}`, '_blank')
    }

    return <div className="toolbar fixed top-0 left-0 w-full border-b border-gray-700 border-opacity-50 bg-gray-900 bg-opacity-50 backdrop-blur-md z-10" style={{ height: '45px' }}>
        <div className="h-full mx-auto px-4 flex items-center justify-between">
            <div className="toolbar-left flex items-center justify-start" style={{ width: '65px' }}>
                <IconButton onClick={toggleLeftPane}>
                    <ListIcon />
                </IconButton>
                <ToolbarDivider />

            </div>
            <div className="flex-1">
                {loading ? <Spinner /> : <></>}
            </div>
            <div className="ml-auto flex items-center justify-end" style={{ width: '65px' }}>
                {currentSong ?
                    <>
                        <IconButton onClick={onStartEditing}>
                            <EditPencilIcon />
                        </IconButton>
                        <ToolbarDivider />
                        <DropdownButton>
                            <div className="border-b border-gray-700 border-opacity-50 py-2 px-3 text-white">
                                <button className="w-full block text-white" onClick={openCurrentSongInNewTab}>
                                    <div className="w-full flex items-center justify-between">
                                        Open in new tab
                                        <div className="text-gray-400">
                                            <LinkIcon />
                                        </div>
                                    </div>
                                </button>
                            </div>
                            <div className="border-b border-gray-700 border-opacity-50 py-2 px-3 text-white">
                                <div className="w-full flex items-center">
                                    <span className="text-white flex-1 text-left">Transpose</span>
                                    <IconButton onClick={onTranspose(-1)}><MinusIcon /></IconButton>
                                    <div className="text-white px-2 text-lg">{currentTranpose}</div>
                                    <IconButton onClick={onTranspose(1)}><PlusIcon /></IconButton>
                                </div>
                            </div>
                        </DropdownButton>
                    </> : <></>}
            </div>
        </div>
    </div >
}

export function ToolbarDivider() {
    return <div className="mx-3 h-6 border-r border-gray-700 border-opacity-80"></div>
}