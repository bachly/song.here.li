import React from 'react'
import { IconButton } from "./Buttons"
import { ProfileCircledIcon } from './Icons'
import Spinner from './Spinner'

export default function Header({ primaryName, secondaryName, user, loading }) {
    return <>
        <div className="fixed top-0 left-0 w-full border-b border-gray-700 border-opacity-50 bg-gray-900 z-10" style={{ height: '45px' }}>
            <div className="h-full mx-auto px-4 flex items-center">
                <div id="logo" className="h-full flex items-center select-none">
                    <span className="text-primary-400 font-semibold text-2xl">{primaryName}</span>
                    <span className="text-white font-light text-2xl">{secondaryName}</span>
                    {loading ? <span className="ml-2 flex items-center"><Spinner /></span> : <></>}
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