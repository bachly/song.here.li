import { Container } from "./Common";

export default function HeaderForPage({ tag, title, description }) {
    return <header className="relative">
        <div className="relative top-0 left-0 w-full h-full z-0 bg-image bg-no-repeat bg-cover">
            {/* style={{ backgroundImage: "url(/img/green-waves.svg)" }}> */}

            <a href="/" className="absolute top-2 left-2 bg-gray-900 bg-opacity-50 hover:bg-opacity-70 hover:shadow-xl duration-200 transition w-10 h-10 p-3 rounded-lg text-white fill-current flex items-center justify-center">
                <svg id="lnr-chevron-left" viewBox="0 0 1024 1024"><title>chevron-left</title><path className="path1" d="M716.8 1024c6.552 0 13.102-2.499 18.101-7.499 9.998-9.997 9.998-26.206 0-36.203l-442.698-442.698 442.698-442.699c9.998-9.997 9.998-26.206 0-36.203s-26.206-9.998-36.203 0l-460.8 460.8c-9.998 9.997-9.998 26.206 0 36.203l460.8 460.8c5 5 11.55 7.499 18.102 7.499z"></path></svg>
            </a>

            {/* <div style={{
                position: "absolute",
                width: "100%",
                bottom: "150px",
                height: "100px",
                clipPath: "url(#clip)",
                transformOrigin: "left top",
                transform: "scale(3)",
                background: "linear-gradient(rgb(12 56 75) 41%, rgb(23, 23, 23) 75%)"
            }}>
                <svg>
                    <clipPath id="clip">
                        <path d="M2.27373675e-13,48.3123102 C47.2526058,39.8757818 86.9623358,35.6575176 119.12919,35.6575176 C178.250668,35.6575176 206.827687,48.0370982 280.432303,48.0370982 C367.079105,48.0370982 376.540461,35.6575176 458.684986,41.2972131 C506.645747,44.5899961 571.277749,53.0948639 660.91839,53.0948639 C710.843933,53.0948639 849.202679,35.6575176 913.373388,35.6575176 C1071.11616,35.6575176 1092.85843,33.5132008 1277.6238,53.0948639 C1314.26691,56.9783463 1427.93201,43.4008155 1534.45719,41.2972131 C1555.56953,40.8802979 1577.41713,43.1269263 1600,48.0370982 L1600,150 L2.27373675e-13,150 L2.27373675e-13,48.3123102 Z" id="Path" stroke="#000000"></path>
                    </clipPath>
                </svg>
            </div> */}

            <div className="pt-36 lg:pt-48 xl:pt-56"></div>

            <Container>
                <div className="text-left text-gray-100 text-sm sm:text-base uppercase tracking-wider font-regular opacity-50">
                    {tag}
                </div>

                <h1>
                    <div className="text-white text-left text-4xl sm:text-5xl md:text-7xl">
                        <span className="font-bold">{title}</span>
                    </div>
                    <div className="mt-1 sm:mt-2 md:mt-3 text-left text-gray-100 text-sm md:text-xl font-regular opacity-80">{description}</div>
                </h1>
            </Container>

            <div className="pt-36 lg:pt-48 xl:pt-56"></div>
        </div>
    </header>

}