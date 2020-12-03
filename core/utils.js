function getElemById(id) {
    return document.getElementById(id);
}

function attachEvent(eventName, elementid, func) {
    let element = document.getElementById(elementid);
    element.addEventListener(eventName, func);
}

async function tryToAsync(callBack, ...params) {
    try {
        await callBack(...params);
    } catch (error) {
        console.log(error);
    }
}

export {
    tryToAsync,
    getElemById,
    attachEvent,
}