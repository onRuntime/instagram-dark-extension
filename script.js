// Var
var state
var storage = getBrowser().storage.sync
var css = document.createElement('link');
var hostname = window.location.hostname
var pathname = window.location.pathname
var unautorizedHostname = ['help.instagram.com', 'about.instagram.com']
var unautorizedPathname = ['/about', '/developer', '/legal']
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
    if(authorization == true) build()
}

function build() {
    // Element wrapper
    wrapper = document.createElement('div')
    wrapper.classList.add('instagram-dark-wrapper')

    // Element button
    button = document.createElement('img')
    button.src = getBrowser().extension.getURL('dark.png')

    // Element css
    css.rel = 'stylesheet'
    css.type = 'text/css'
    css.id = 'dark-theme-stylesheet'
    css.href = getBrowser().extension.getURL('style.css');

    // Button Events
    button.onclick = function () {
        toggle()
    }

    // Elements injection
    document.body.appendChild(wrapper)
    wrapper.appendChild(button)

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
        } else {
            setState(result.state)
            if (getState() == true) {
                toggleCss()
            }
        }
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
    if (getState() == false) {
        toggleCss()
        setState(true)
    } else if (getState() == true) {
        toggleCss()
        setState(false)
    } else {
        initState()
    }
}

function toggleCss() {
    if (document.getElementById(css.id)) {
        document.getElementById(css.id).remove()
    } else {
        (document.head || document.documentElement).appendChild(css);
    }
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