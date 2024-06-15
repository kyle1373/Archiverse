import Image from "next/image";
import { Inter } from "next/font/google";
import SEO from "@/components/SEO";
import styles from "./index.module.css";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <SEO />
      <main className={styles.wrapper}>
        <div className="sub-body">
          <menu id="">
            <li id="global-menu-logo">
              <h1>
                <a href="/web/20150216192542/https://miiverse.nintendo.net/">
                  <img
                    src="https://web.archive.org/web/20150216192542im_/https://d13ph7xrk1ee39.cloudfront.net/img/menu-logo.png?10dmAkYzx0LNwNzOcnEVpg"
                    alt="Miiverse"
                    width="200"
                    height="55"
                  />
                </a>
              </h1>
            </li>
            <li id="global-menu-login">
              <form
                id="login_form"
                action="/web/20150216192542/https://miiverse.nintendo.net/auth/forward"
                method="post"
              >
                <input
                  type="hidden"
                  name="location"
                  value="https://miiverse.nintendo.net/"
                />
                <input
                  type="image"
                  alt="Sign in"
                  src="https://web.archive.org/web/20150216192542im_/https://d13ph7xrk1ee39.cloudfront.net/img/en/signin_base.png?8lPjTzg95hH5tyo0jYMLbA"
                />
              </form>
            </li>
          </menu>
        </div>
        <div className="main-body">
          <h2 className="welcome-message">Welcome to Miiverse!</h2>
          <div id="about">
            <img src="https://web.archive.org/web/20150216192542im_/https://d13ph7xrk1ee39.cloudfront.net/img/welcome-image.png?slMbxaTdVkgsx-nP9yyuQg" />
            <p>
              Miiverse is a service that lets you communicate with other players
              from around the world. It is accessible via Wii U and systems in
              the Nintendo 3DS family.
            </p>
          </div>
          <div className="body-content">
            <div className="headline">
              <h2 className="headline-text">Communities</h2>
              <form
                method="GET"
                action="/web/20150216192542/https://miiverse.nintendo.net/titles/search"
                className="search"
              >
                <input
                  type="text"
                  name="query"
                  placeholder="Search Communities"
                  minLength={2}
                  maxLength={20}
                />
                <input type="submit" value="" title="Search" />
              </form>
            </div>
            <ul className="list community-list community-title-list">
              <li
                id="community-14866558073568704546"
                className="trigger "
                data-href="/titles/14866558073568704534/14866558073568704546"
              >
                <span className="icon-container">
                  <img
                    src="https://web.archive.org/web/20150216192542im_/https://d3esbfg30x759i.cloudfront.net/tip/AAUAABAaSwA8650E6f"
                    className="icon"
                  />
                </span>
                <div className="body">
                  <a
                    className="title"
                    href="/web/20150216192542/https://miiverse.nintendo.net/titles/14866558073568704534/14866558073568704546"
                  >
                    Blek
                  </a>
                  <span className="platform-tag">
                    <img src="https://web.archive.org/web/20150216192542im_/https://d13ph7xrk1ee39.cloudfront.net/img/platform-tag-wiiu.png?_ugOds9jnFV9x-fEr8djZw" />
                  </span>
                  <span className="text">Wii U Games</span>
                </div>
              </li>
            </ul>
            <div className="buttons-content">
              <a
                href="/web/20150216192542/https://miiverse.nintendo.net/communities/categories/wiiu_all"
                className="button"
              >
                Show More
              </a>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
