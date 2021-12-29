const fs = require('fs');
const path = require('path');
const postsFolder = './publish/posts';

const getPathsForPosts = () => {
    return fs
        .readdirSync(postsFolder)
        .map(blogName => {
            const trimmedName = blogName.substring(0, blogName.length - 3);
            return {
                [`/post/${trimmedName}`]: {
                    page: '/post/[slug]',
                    query: {
                        slug: trimmedName,
                    },
                },
            };
        })
        .reduce((acc, curr) => {
            return { ...acc, ...curr };
        }, {});
};

module.exports = {
    webpack: (cfg) => {
        cfg.module.rules.push(
            {
                test: /\.md$/,
                loader: 'frontmatter-markdown-loader',
                options: { mode: ['html'] }
            }
        )
        cfg.resolve.alias = {
            ...cfg.resolve.alias,
            handlebars: "handlebars/dist/handlebars.min.js",
        }
        return cfg;
    },
    async exportPathMap(defaultPathMap) {
        return {
            ...defaultPathMap,
            //...getPathsForPosts(),
        };
    },
    sassOptions: {
        includePaths: [path.join(__dirname, 'styles')],
    },
};