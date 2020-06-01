const activeEnv = process.env.GATSBY_ACTIVE_ENV || process.env.NODE_ENV || "development"
console.log(`Using environment config: '${activeEnv}'`)

require("dotenv").config({
    path: `./.env.${activeEnv}`,
})

module.exports = {
    siteMetadata: {
        title: `ImmunHelden`,
        description: `Wir verbinden von Covid-19 genesene und damit immune Helfer:innen mit allen, die ihre Unterstützung benötigen.`,
        defaultLanguage: "de",
    },
    plugins: [
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                path: `${__dirname}/src/markdown-pages`,
                name: `markdown-pages`,
            },
        },
        `gatsby-transformer-remark`,
        {
            resolve: `gatsby-plugin-material-ui`,
            options: {
                stylesProvider: {
                    injectFirst: true,
                },
            },
        },
        `gatsby-plugin-styled-components`,
        `gatsby-plugin-react-helmet`,
        {
            resolve: `gatsby-source-filesystem`,
            options: {
                name: `images`,
                path: `${__dirname}/src/images`,
            },
        },
        `gatsby-transformer-sharp`,
        `gatsby-plugin-sharp`,
        {
            resolve: `gatsby-plugin-manifest`,
            options: {
                name: `gatsby-starter-default`,
                short_name: `starter`,
                start_url: `/`,
                background_color: `#663399`,
                theme_color: `#663399`,
                display: `minimal-ui`,
                icon: `src/images/gatsby-icon.png`, // This path is relative to the root of the site.
            },
        },
        {
            resolve: `gatsby-plugin-intl`,
            options: {
                // language JSON resource path
                path: `${__dirname}/src/intl`,
                // supported language
                languages: [`en`, `de`],
                // language file path
                defaultLanguage: `de`,
                // option to redirect to default when connecting `/`
                redirect: true,
            },
        },
        {
            resolve: "gatsby-plugin-firebase",
            options: {
                credentials: {
                    apiKey: process.env.GATSBY_FIREBASE_API_KEY,
                    authDomain: "immunhelden.firebaseapp.com",
                    databaseURL: "https://immunhelden.firebaseio.com",
                    projectId: "immunhelden",
                    storageBucket: "immunhelden.appspot.com",
                    messagingSenderId: "571517068232",
                    appId: "1:571517068232:web:0d5ed271759c4f568b56fd",
                },
            },
        },
        {
            resolve: "gatsby-plugin-react-svg",
            options: {
                rule: {
                    include: /svg/,
                },
            },
        },
        {
            resolve: "gatsby-plugin-sentry",
            options: {
                dsn: "http://0f4ff5902f4c407e8cad882e32d161a0@v22019046602786136.hotsrv.de:9000/2",
                environment: process.env.NODE_ENV,
                enabled: true, //(() => ["production", "stage"].indexOf(process.env.NODE_ENV) !== -1)(),
            },
        },
        // this (optional) plugin enables Progressive Web App + Offline functionality
        // To learn more, visit: https://gatsby.dev/offline
        // `gatsby-plugin-offline`,
    ],
}
