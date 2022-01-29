export default function SectionHero({ title, subtitle, ctaText, ctaLink }) {
    return <section className="SectionHero" style={{ marginTop: "45px" }}>
        <div className="py-24 px-4 text-center border-b border-gray-700 border-opacity-40">
            <h1 className="text-white font-light text-2xl sm:text-3xl md:text-4xl">{title}</h1>
            <div className="pt-1 md:pt-2"></div>
            <p className="text-gray-400 w-3/4 mx-auto text-base md:text-lg">{subtitle}</p>
            {ctaText && ctaLink ?
                <>
                    <div className="pt-8"></div>
                    <a className="inline-block bg-primary-700 text-white text-opacity-80 py-2 px-6 rounded-md hover:opacity-80 duration-100 transition ease-in-out" href={ctaLink}>{ctaText}</a>
                </>
                : <></>}
        </div>
    </section>
}