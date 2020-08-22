// Var
var state
var storage = getBrowser().storage.local

// Element wrapper
wrapper = document.createElement('div')
wrapper.classList.add('wrapper')

// Element button
button = document.createElement('img')
button.src = getBrowser().extension.getURL('dark.png')

// Element css
var css = document.createElement('link');
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

getStorage().get(['state']);

initState()
// Storage

function getStorage() {
    return storage
}

// State

function initState() {
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
    getStorage().set({ 'state': r });
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
    if(document.getElementById(css.id)) {
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