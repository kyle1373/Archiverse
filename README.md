![archiverse-logo](https://github.com/kyle1373/Archiverse/assets/59634395/269a0426-87c9-48b7-a15f-cf11b910ef83)

### The Biggest Miiverse Archive on the Internet (17TB of art, screenshots, posts, and more)

View the website at [archiverse.app](https://archiverse.app)

## About Archiverse

Archiverse is an archive of Miiverse, a social media platform for the Nintendo Wii U and 3DS which ran from November 18, 2012 until November 8, 2017. This archive stores millions of archived Miiverse users, posts, drawings, comments, and more, totaling over 17TB of data.  

Archiverse's frontend is built using [React](https://react.dev/), [Next.js](https://nextjs.org/), [Redux](https://redux.js.org/), and [Docker](https://www.docker.com/), deployed through [Vercel](https://vercel.com/). It takes advantage of server-side rendering for optimized SEO (search engine optimization) in order for users to more easily Google keywords in Miiverse posts. The data behind archiverse is stored through [PostgreSQL](https://www.postgresql.org/) hosted with [Supabase](https://supabase.com/). In total, the data behind Archiverse consists of...

5,141 Communities
8,290,282 Users  
133,078,026 Posts  
216,972,349 Replies  

This data is quickly searchable on Archiverse thanks to optimized binary tree indexes applied on certain columns in each table.  The database is backed up on [internet archive](https://archive.org/details/archiverse) (Note: some modifications to this database has occured. Look over `supabase/migrations` for more details).

## Contributions

All contributions are welcome! The easiest way to set up the repository is to look over `archiverse` to set up the frontend, then `supabase` to set up a local copy of the database. If you would like to reach out to me personally, [message me on Discord](https://discord.gg/jUAWHNzMer).

## Special Thanks

- [Drastic Actions](https://mastodon.social/@drasticactions@hachyderm.io) for creating the [original Archiverse website](https://github.com/drasticactions/Archiverse)  
- [Archive Team](https://archiveteam.org) for archiving over 17TB of Miiverse data onto Internet Archive 
