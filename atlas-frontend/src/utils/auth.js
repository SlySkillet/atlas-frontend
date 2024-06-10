const getCSRFToken = () => {
    const cookieValues = document.cookie.split('; ');
    const csrfcookie = cookieValues.find((cookie) =>
        cookie.startsWith('csrftoken'),
    );
    if (csrfcookie) {
        const csrftoken = csrfcookie.split('=')[1];
        return csrftoken;
    }
    return null;
};

export default getCSRFToken;
