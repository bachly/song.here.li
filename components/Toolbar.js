import React, { Fragment } from 'react';
import { DropdownButton, IconButton } from "./Buttons"
import { ListIcon, EditPencilIcon, MinusIcon, PlusIcon, LinkIcon, WarningCircledOutlineIcon } from "./Icons"
import { Dialog, Transition } from '@headlessui/react'
import Spinner from "./Spinner";
import clsx from 'clsx';
import { object } from 'underscore';

export default function Toolbar({ toggleLeftPane, onStartEditing, currentSong, loading, alerts = {}, currentTranpose, onTranspose }) {
    const [isOpenErrorDialog, setIsOpenErrorDialog] = React.useState(false);

    function openCurrentSongInNewTab(event) {
        event && event.preventDefault();
        window.open(`/app/${currentSong.id}`, '_blank')
    }

    function hasActiveAlerts() {
        Object.keys(alerts).filter(key => alerts[key].active).length > 0;
    }

    return <div className="toolbar fixed top-0 w-full border-b border-gray-700 border-opacity-50 bg-gray-900 bg-opacity-50 backdrop-blur-md z-10" style={{ height: '45px' }}>
        <div className="h-full mx-auto px-2 flex items-center justify-between">
            <div className="toolbar-left flex items-center justify-start">
                <IconButton onClick={toggleLeftPane}>
                    <ListIcon />
                </IconButton>
                <ToolbarDivider />

            </div>
            <div className="flex-1">
                {loading ? <Spinner /> : <></>}

                {hasActiveAlerts() ?
                    <div className="h-full flex items-center">
                        <Transition
                            appear show={isOpenErrorDialog} as={Fragment}
                            show={isOpenErrorDialog}
                        >
                            <Dialog as="div" open={isOpenErrorDialog} onClose={() => setIsOpenErrorDialog(false)}
                                className="fixed inset-0 z-10 overflow-y-auto">
                                <div className="flex items-center justify-center min-h-screen">
                                    <div className="min-h-screen px-4 text-center">
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0"
                                            enterTo="opacity-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100"
                                            leaveTo="opacity-0"
                                        >
                                            <Dialog.Overlay className="fixed inset-0" />
                                        </Transition.Child>

                                        {/* This element is to trick the browser into centering the modal contents. */}
                                        <span
                                            className="inline-block h-screen align-middle"
                                            aria-hidden="true"
                                        >
                                            &#8203;
                                        </span>
                                        <Transition.Child
                                            as={Fragment}
                                            enter="ease-out duration-300"
                                            enterFrom="opacity-0 scale-95"
                                            enterTo="opacity-100 scale-100"
                                            leave="ease-in duration-200"
                                            leaveFrom="opacity-100 scale-100"
                                            leaveTo="opacity-0 scale-95"
                                        >
                                            <div className="inline-block w-full max-w-md pt-4 px-8 pb-4 my-8 overflow-hidden text-left align-middle transition-all transform bg-gradient-to-b from-gray-800 to-gray-900 border border-gray-700 border-opacity-30 shadow-xl rounded-2xl">

                                                <Dialog.Title className="sr-only text-lg font-medium leading-6 text-white">Alerts</Dialog.Title>
                                                <Dialog.Description className="sr-only pb-2 text-sm text-gray-400 border-b border-gray-600">
                                                    A list of errors &amp; warnings that need your attention
                                                </Dialog.Description>

                                                <ul className="list-style-none">
                                                    {Object.keys(alerts).map((key, index) => {
                                                        const alert = alerts[key];
                                                        if (alert.active) {
                                                            const alertType = key.split('_')[0];

                                                            return <li className="rounded-lg flex items-center" key={key}>
                                                                <div className="mr-6">
                                                                    <div className={clsx((function () {
                                                                        switch (alertType) {
                                                                            case 'ERROR': return 'border-2 border-red-400 text-red-400'
                                                                            case 'WARNING': return 'border-2 border-yellow-400 text-yellow-400'
                                                                            default: return 'border-2 border-blue-400 text-blue-400'
                                                                        }
                                                                    })(), "rounded-full w-6 h-6 flex items-center justify-center text-sm")}>
                                                                        {index + 1}
                                                                    </div>
                                                                </div>
                                                                <div className={clsx((function () {
                                                                    switch (alertType) {
                                                                        case 'ERROR': return 'text-red-400'
                                                                        case 'WARNING': return 'text-yellow-400'
                                                                        default: return 'text-blue-400'
                                                                    }
                                                                })(), "text-base")}>
                                                                    {alert.message}
                                                                </div>
                                                            </li>
                                                        }
                                                    })}
                                                </ul>

                                                <div className="mt-4"></div>

                                                <div className="flex justify-center">
                                                    <button className="text-primary-500" onClick={() => setIsOpenErrorDialog(false)}>Close</button>
                                                </div>
                                            </div>
                                        </Transition.Child>
                                    </div>
                                </div>
                            </Dialog>
                        </Transition>
                        <IconButton onClick={() => setIsOpenErrorDialog(true)}>
                            <div className="fill-current text-red-500">
                                <WarningCircledOutlineIcon />
                            </div>
                        </IconButton>
                    </div>
                    : <></>}
            </div>
            <div className="ml-auto flex items-center justify-end">
                {currentSong ?
                    <>
                        <IconButton onClick={onStartEditing}>
                            <EditPencilIcon />
                        </IconButton>
                        <ToolbarDivider />
                        <DropdownButton>
                            <div className="border-b border-gray-700 border-opacity-50 py-1 px-3 text-white">
                                <button className="w-full block text-white" onClick={openCurrentSongInNewTab}>
                                    <div className="w-full flex items-center justify-between text-sm">
                                        Open in new tab
                                        <div className="text-gray-400">
                                            <LinkIcon />
                                        </div>
                                    </div>
                                </button>
                            </div>
                            <div className="border-b border-gray-700 border-opacity-50 py-1 px-3 text-white">
                                <div className="w-full flex items-center">
                                    <span className="text-white flex-1 text-left text-sm">Transpose</span>
                                    <IconButton onClick={onTranspose(-1)}><MinusIcon /></IconButton>
                                    <div className="text-white px-2">{currentTranpose}</div>
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