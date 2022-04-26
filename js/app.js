// ESLint variables
/* global chrome */
/* global browser */

// Elements
// stylescheet with instagram style.
let css;
let cssTheme;

// wrapper for things like popups etc.
let wrapper;

// dark theme button in option list.
let darkThemeButton;
let darkThemeButtonIcon;
let darkThemeButtonText;

// template theme button in option list
let templateThemeButton;
let templateThemeButtonIcon;
let templateThemeButtonText;

// custom links in footer
let discordLink;
let linkedInLink;
let gitHubLink;
let twitterLink;
let patreonLink;
let instagramLink;
let onRuntimeLink;

let customLinksInterval;

// Variables
// theme in local storage
let theme;

// list theme
let themeList = {
  white: { title: 'white', css:'white', img:'img/white' , iconColor: 'dark'},
  red: { title: 'red', css: 'STYLETHEMERED', img:'img/red' , iconColor: 'light'},
  blue: { title: 'blue', css:'STYLETHEMEBLUE', img:'img/blue' , iconColor: 'light'},
  black: { title: 'black', css: 'STYLETHEMEBLACK', img:'img/black' , iconColor: 'light'},
}
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
    "accountscenter.instagram.com",
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
  STYLETHEMERED: getBrowser().extension.getURL("css/theme-red.css"),
  STYLETHEMEBLUE: getBrowser().extension.getURL("css/theme-blue.css"),
  STYLETHEMEBLACK: getBrowser().extension.getURL("css/theme-black.css"),
  MOON_ICON: getBrowser().extension.getURL("img/moon-fill.svg"),
  SUN_ICON: getBrowser().extension.getURL("img/sun-fill.svg"),
  PALETTE_ICON_W: getBrowser().extension.getURL("img/palette-fill-light.svg"),
  PALETTE_ICON_D: getBrowser().extension.getURL("img/palette-fill-dark.svg"),
};

// Elements
const initElements = () => {
  // Theme css
  cssTheme = document.createElement("link");
  cssTheme.rel = "stylesheet";
  cssTheme.type = "text/css";
  cssTheme.id = "instagram-theme-stylesheet";

  // Build wrapper element
  wrapper = document.createElement("div");
  wrapper.id = "instagram-dark-wrapper";
  document.body.appendChild(wrapper);

  // Build template theme button element
  templateThemeButton = document.createElement("div");
  templateThemeButton.id = "template-theme-modal-button";
  templateThemeButton.classList.add('-qQT3');
  templateThemeButtonIcon = document.createElement("img");
  templateThemeButton.appendChild(templateThemeButtonIcon);

  templateThemeButtonText = document.createElement("span");
  templateThemeButtonText.innerText = "Template theme";
  templateThemeButton.appendChild(templateThemeButtonText);
  templateThemeButton.addEventListener("click", toggleTemplateTheme);
  document.addEventListener("click", (e) => {
    if (e.target.tagName === "IMG" && e.target.classList.contains("_6q-tv")) {
      // delay adding the button to allow the menu to render
      setTimeout(addTemplateThemeButton, 10);
    }
  });

  // Build footer element
  const buildCustomLink = (name, href, targetBlank = true) => {
    const item = document.createElement("li");
    item.classList.add("K5OFK");

    const link = document.createElement("a");
    link.classList.add("l93RR");
    link.innerText = name;
    link.href = href;
    if (targetBlank) link.target = "_blank";
    item.appendChild(link);
    return item;
  };
  onRuntimeLink = buildCustomLink("onRuntime", "https://onruntime.com/");
  discordLink = buildCustomLink("Discord", "https://discord.gg/ucX9c5yXmX");
  gitHubLink = buildCustomLink("GitHub", "https://github.com/onRuntime");
  patreonLink = buildCustomLink("Donate", "https://patreon.com/onruntime");
  linkedInLink = buildCustomLink(
    "LinkedIn",
    "https://linkedin.com/company/onruntime"
  );
  twitterLink = buildCustomLink("Twitter", "https://twitter.com/onRuntime");
  instagramLink = buildCustomLink("Instagram", "/onruntime", false);

  customLinksInterval = setInterval(addCustomLinks, 100);

  document.addEventListener("click", () => {
    clearInterval(customLinksInterval);
    customLinksInterval = setInterval(addCustomLinks, 100);
  });
};

// Theme in storage
// get the theme variable.
const getTheme = () => theme;

// set the Theme in variable and in localstorage.
const setTheme = (r) => {
  theme = r;
  getStorage().set({ theme: r }, () =>
    console.log("[storage] Theme saved: " + r)
  );
};

// init the state or initialize it in local storage.
const initState = () => {
  getStorage().get( (result) => {
    console.info("[storage] theme loaded: " + result.theme);
    itemBoxSelectTemplate(themeList[result.theme]);
  });
};


// toggle modal
const toggleTemplateTheme = () => {
    console.log('Show modal');
    const backgroundModal = document.createElement("div");
    backgroundModal.classList.add("modal-dark-theme");
    document.body.appendChild(backgroundModal);

    const modalBox = document.createElement("div");
    modalBox.classList.add("modal-dark-theme-box");
    backgroundModal.appendChild(modalBox);

    for (const theme in themeList) {
      itemBox(modalBox, themeList[theme]);
    }
    // close modal
    //target for close
    // closeModal.addEventListener('click', ()=>{
    //   modalBox.remove();
    // })
    window.addEventListener('click', (event) =>{
        if (event.target == backgroundModal) {
            backgroundModal.remove();
        }
    })
}

// item box template theme
const itemBox = (divTarget, theme) =>{
  const box = document.createElement('div');
  box.classList.add("modal-box-themes");
  console.log(theme);
  // const imgItemBox = document.createElement('img');
  // imgItemBox.src = getBrowser().extension.getURL(theme.img)
  const titleItemBox = document.createElement('p');
  titleItemBox.innerText = theme.title;
  box.appendChild(titleItemBox);
  divTarget.appendChild(box);
  box.addEventListener('click', (e)=>{
    e.preventDefault();
    itemBoxSelectTemplate(theme);
  });
}
// Select template theme
const itemBoxSelectTemplate = (e) => {
  console.log(e);
    switch(e.title){
      case 'white':
        addThemeToBody(e);
        setTheme('white');
        break;
      case 'red':
        addThemeToBody(e);
        setTheme('red');
        break;
      case 'blue':
        addThemeToBody(e);
        setTheme('blue');
        break;
      case 'black':     
        addThemeToBody(e);
        setTheme('black');
        break;
      case 'default':
        addThemeToBody(e);
        setTheme('white');
        break;
    }
}

// Add theme to the body (update the root)
const addThemeToBody = (e) => {
  const themeColorMetaElement = document.querySelector(
    // eslint-disable-next-line quotes
    'meta[name="theme-color"]'
  );
  if(e.css === 'white' || e.css === ''){
    if(document.getElementById(cssTheme.id)){
      document.getElementById(cssTheme.id).remove();
    }
} 
  const targetElement = document.head || document.documentElement;
  if (themeColorMetaElement){
    themeColorMetaElement.setAttribute("content", "#000000");

    console.log(e.css);
    
      cssTheme.href = SOURCES[e.css];
      setIconTemplateBtn(e.iconColor);
      targetElement.appendChild(cssTheme);
      targetElement.appendChild(themeColorMetaElement);
  }
 
}

// Set icon template theme button
const setIconTemplateBtn = (colorIcon) => {
  let icon;
  if(colorIcon === 'dark'){
    icon = SOURCES.PALETTE_ICON_D;
  }
  if(colorIcon === 'light'){
    icon = SOURCES.PALETTE_ICON_W;
  }
  templateThemeButtonIcon.src = icon
}

// Add template theme button in option menu.
const addTemplateThemeButton = () => {
  let optionsMenu = document.querySelector("._01UL2");

  // insert our button above the "Settings" button.
  if (optionsMenu)
    optionsMenu.insertBefore(templateThemeButton, optionsMenu.children[2]);
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
    navLinks.prepend(linkedInLink);
    navLinks.prepend(twitterLink);
    navLinks.prepend(gitHubLink);
    navLinks.prepend(discordLink);
    navLinks.prepend(patreonLink);
    navLinks.prepend(onRuntimeLink);
    clearInterval(customLinksInterval);
  }
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
          "https://onruntime.com/projects/instagram-dark/welcome",
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
