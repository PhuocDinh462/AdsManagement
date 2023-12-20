function getCookie(cookieName) {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');

    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i].trim();
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }

    return null;
}

// Set giá trị vào localStorage từ cookie
const setLocalStorageFromCookie = (keyName) => {
    const cookieValue = getCookie(keyName);

    if (cookieValue) {
        document.cookie = `${keyName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

        localStorage.removeItem(keyName);
        localStorage.setItem(keyName, cookieValue);
    }
}
export default setLocalStorageFromCookie;
