export function LoremIpsum({ length = 1 }) {
    return <>
        <p className="mb-3">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum semper egestas imperdiet. Morbi ut maximus massa. Vestibulum vitae arcu purus. Suspendisse imperdiet sollicitudin ante, ut ullamcorper massa vehicula dictum. Nam pharetra augue vel tempor ullamcorper. Ut at justo turpis. Praesent purus purus, finibus et lorem id, aliquet scelerisque lectus.
        </p>
        {length > 1 ?
            <p className="mb-3">
                Integer gravida, ex non tincidunt cursus, ex tellus efficitur velit, sit amet convallis lectus odio eget nisl. Praesent in libero sit amet velit iaculis accumsan. Duis facilisis varius vulputate. Ut dictum dolor in nisl ultricies varius. Sed porttitor, elit vel condimentum porta, risus enim tincidunt odio, eget varius dolor magna ac nibh. Sed rhoncus, nulla quis porta molestie, urna arcu tempus augue, vitae egestas dui nisl vel felis. Aliquam elementum faucibus faucibus. Ut massa risus, convallis ut condimentum eu, sodales mollis magna. Donec sit amet tellus libero.
            </p> : <></>}

        {length > 2 ?
            <p className="mb-3">
                Duis ut interdum neque. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Phasellus augue est, blandit et tincidunt id, rutrum non odio. Fusce leo mi, sagittis nec libero viverra, tristique pulvinar lectus. Pellentesque ultrices odio a sodales tempus. Nam lobortis lobortis sem et tempus. Pellentesque pretium rutrum viverra. Sed vestibulum mi nunc, sed vestibulum nisl facilisis at. Donec commodo fringilla feugiat. Proin nec eros placerat, venenatis nibh eget, fringilla ex. Nunc eget nunc sed lacus tempus finibus. Donec consectetur, metus vel congue sagittis, est enim maximus nisi, id bibendum ante turpis in urna. Aenean porttitor erat ultricies tincidunt dapibus. Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed faucibus lobortis magna eget rutrum. Sed a sapien id tellus ornare pharetra vel sed enim.
            </p> : <></>}

        {length > 3 ?
            <p className="mb-3">
                Nulla molestie aliquam iaculis. Fusce nec nunc accumsan, egestas turpis tempus, tempor massa. Aliquam erat volutpat. Proin vulputate nunc non augue sollicitudin, gravida sodales nibh scelerisque. Nullam mollis pulvinar velit, a eleifend arcu egestas et. Quisque semper nisl a nulla accumsan varius. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Duis ex quam, egestas eu enim a, tincidunt volutpat neque. Aliquam egestas nisi at magna rutrum elementum. Cras sapien quam, eleifend tempor nisl eget, facilisis blandit massa. Nullam in dolor tempor, ultricies massa sit amet, dignissim tortor. Integer bibendum cursus massa, in vehicula mi facilisis nec. Sed sed faucibus metus. Fusce commodo eleifend felis eu pulvinar. Mauris at metus ut magna hendrerit laoreet.
            </p> : <></>}
    </>
}