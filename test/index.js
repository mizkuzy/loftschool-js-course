function removeListener(eventName, target, fn) {
    target.removeEventListener(eventName, fn);
}

function addListener(eventName, target, fn) {
    target.addEventListener(eventName, fn);
}