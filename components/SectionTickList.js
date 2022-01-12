export default function SectionTickList({ tag, title, subtitle, list }) {
    return <section className="SectionTickList">
        <div className="py-12 px-4 border-b border-gray-700 border-opacity-40">
            {tag ? <>
                <div className="uppercase text-primary-400 text-xs text-center tracking-wider">{tag}</div>
                <div className="pt-1"></div>
            </> : <></>}

            <h2 className="text-center text-white font-light text-lg sm:text-xl md:text-2xl">{title}</h2>

            {subtitle ? <>
                <div className="pt-2"></div>
                <p className="text-center text-gray-400 w-3/4 mx-auto text-sm md:text-lg">{subtitle}</p>
            </> : <></>}

            {list && list.length > 0 ?
                <ul className="py-6 px-4 max-w-sm mx-auto list-disc text-white">
                    {list.map((item, index) => <li key={`tick-lsit-item-${index}`} className="py-1 text-gray-300 text-sm sm:text-base">{item}</li>)}
                </ul> : <></>}
        </div>
    </section>
}