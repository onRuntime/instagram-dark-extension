// Var
const storage = getBrowser().storage.local
const hostname = window.location.hostname
const pathname = window.location.pathname

var state
var css = document.createElement('link');
var unautorizedHostname = ['help.instagram.com', 'about.instagram.com']
var unautorizedPathname = ['/about', '/developer', '/legal', '/static']
var authorization = true

// Script init
init()

function init() {
    // Authorized pathname/hostname
    unautorizedHostname.forEach(element => {
        if (element == hostname) {
            authorization = false
        }
    })
    unautorizedPathname.forEach(element => {
        if (pathname.includes(element)) {
            authorization = false
        }
    })
    if (authorization == true) build()
}

function build() {
    // Element wrapper
    wrapper = document.createElement('div')
    wrapper.classList.add('instagram-dark-wrapper')

    // Element button
    button = document.createElement('img')

    // Element css
    css.rel = 'stylesheet'
    css.type = 'text/css'
    css.id = 'dark-theme-stylesheet'
    css.href = getBrowser().extension.getURL('css/style.css')

    // Button Events
    button.onclick = function () {
        toggle()
    }

    // Elements injection
    document.body.appendChild(wrapper)

    // Initialization
    initState()
}

// Storage
function getStorage() {
    return storage
}

// State
function initState() {
    getStorage().get(['state'], function (result) {
        console.log('[storage] state loaded: ' + result.state)
    });
    getStorage().get(['state'], function (result) {
        if (result.state == undefined) {
            setState(true)
            toggleCss()
            button.src = getBrowser().extension.getURL('img/sun-fill.svg')
        } else {
            setState(result.state)
            button.src = getBrowser().extension.getURL('img/moon-fill.svg')
            if (getState() == true) {
                toggleCss()
                button.src = getBrowser().extension.getURL('img/sun-fill.svg')
            }
        }
        wrapper.appendChild(button)
    });
}

function getState() {
    return state
}

function setState(r) {
    state = r
    getStorage().set({ 'state': r }, function () {
        console.log('[storage] state saved: ' + r);
    });
}

// Toggle
function toggle() {
    switch (getState()) {
        case true:
            toggleCss()
            setState(false)
            button.src = getBrowser().extension.getURL('img/moon-fill.svg')
            break;
        case false:
            toggleCss()
            setState(true)
            button.src = getBrowser().extension.getURL('img/sun-fill.svg')
            break;
        default:
            initState()
            break;
    }
}

function toggleCss() {
    if (document.getElementById(css.id)) document.getElementById(css.id).remove();
    else (document.head || document.documentElement).appendChild(css);
}

// Browser Detection
function getBrowser() {
    if (typeof chrome !== 'undefined') {
        if (typeof browser !== 'undefined') {
            return browser;
        } else {
            return chrome;
        }
    } else {
        return null;
    }
}