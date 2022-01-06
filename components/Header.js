import React from 'react'
import { IconButton } from "./Buttons"
import { ProfileCircledIcon } from './Icons'

export default function Header({ primaryName, secondaryName, user }) {
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
    </>
}