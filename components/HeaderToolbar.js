import React from 'react'
import { IconButton } from "./Buttons"
import { LoremIpsum } from './Content';
import { ListIcon, EditPencilIcon, LinkIcon, MediaVideoListIcon, TrashIcon, ProfileCircledIcon } from "./Icons"

export default function Header({ primaryName, secondaryName, user }) {
    const [leftPaneState, setLeftPaneState] = React.useState('hidden');

    function toggleLeftPane(event) {
        event && event.preventDefault();
        console.log(leftPaneState ? 'visible' : 'hidden');
        setLeftPaneState(leftPaneState === 'hidden' ? 'visible' : 'hidden');
    }

    return <>
        <div className="border-b border-gray-700 border-opacity-50" style={{ height: '45px' }}>
            <div className="h-full mx-auto px-4 flex items-center">
                <div id="logo" className="h-full flex items-center select-none">
                    <span className="text-primary-400 font-semibold text-2xl">{primaryName}</span>
                    <span className="text-white font-light text-2xl">{secondaryName}</span>
                </div>
                <div id="user" className="h-full flex items-center ml-auto">
                    {user && user.name ?
                        <span className="text-white font-light text-2xl">
                            {user.name}
                        </span> :
                        <IconButton>
                            <ProfileCircledIcon />
                        </IconButton>
                    }
                </div>
            </div>
        </div>

        <div className="border-b border-gray-700 border-opacity-50" style={{ height: '45px' }}>
            <div className="h-full mx-auto px-4 flex items-center">
                <div id="left" className="flex items-center justify-start" style={{ width: '100px' }}>
                    <IconButton onClick={toggleLeftPane}>
                        <ListIcon />
                    </IconButton>
                    <ToolbarDivider />
                </div>
                <div id="center" className="flex-1 mx-auto flex items-center justify-center">
                    <IconButton>
                        <EditPencilIcon />
                    </IconButton>
                    <div className="w-6"></div>
                    <IconButton>
                        <div className="font-semibold text-xl">Am</div>
                    </IconButton>
                    <div className="w-6"></div>
                    <IconButton>
                        <div className="font-semibold text-xl">97</div>
                    </IconButton>
                    <div className="w-6"></div>
                    <IconButton>
                        <MediaVideoListIcon />
                    </IconButton>
                    <div className="w-6"></div>
                    <IconButton>
                        <LinkIcon />
                    </IconButton>
                </div>
                <div id="right" className="ml-auto flex items-center justify-end" style={{ width: '100px' }}>
                    <ToolbarDivider />
                    <IconButton>
                        <TrashIcon />
                    </IconButton>
                </div>
            </div>
        </div>
    </>
}

export function ToolbarDivider() {
    return <div className="mx-6 h-6 border-r border-gray-700 border-opacity-80"></div>
}