import { IconButton } from "./Buttons"
import { ListIcon, EditPencilIcon, LinkIcon, MediaVideoListIcon, TrashIcon } from "./Icons"

export default function Toolbar({ song, toggleLeftPane, onStartEditing }) {
    return <div className="border-b border-gray-700 border-opacity-50" style={{ height: '45px' }}>
        <div className="h-full mx-auto px-4 flex items-center">
            <div id="left" className="flex items-center justify-start" style={{ width: '100px' }}>
                <IconButton onClick={toggleLeftPane}>
                    <ListIcon />
                </IconButton>
                <ToolbarDivider />
            </div>
            <div id="center" className="flex-1 mx-auto flex items-center justify-center">
                <IconButton onClick={onStartEditing}>
                    <EditPencilIcon />
                </IconButton>
                <div className="w-6"></div>
                <IconButton>
                    <div className="font-semibold text-xl">{(song && song["Key"]) || 'Key'}</div>
                </IconButton>
                <div className="w-6"></div>
                <IconButton>
                    <div className="font-semibold text-xl">{(song && song["BPM"]) || 'BPM'}</div>
                </IconButton>
                <div className="w-6"></div>
                <IconButton>
                    <MediaVideoListIcon />
                </IconButton>
            </div>
            <div id="right" className="ml-auto flex items-center justify-end" style={{ width: '100px' }}>
                <ToolbarDivider />
                <IconButton>
                    <LinkIcon />
                </IconButton>
            </div>
        </div>
    </div>
}

export function ToolbarDivider() {
    return <div className="mx-6 h-6 border-r border-gray-700 border-opacity-80"></div>
}