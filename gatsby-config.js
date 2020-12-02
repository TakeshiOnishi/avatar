module.exports = {
  siteMetadata: {
    title: `AVATAR`,
    description: `Communicate with the other party in virtual space.`,
  },
  plugins: [
    `gatsby-plugin-react-helmet`,
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `images`,
        path: `${__dirname}/src/images`,
      },
    },
    {
      resolve: `gatsby-plugin-sass`,
      options: {
        outputStyle: 'compressed',
      },
    }
  ],
}
