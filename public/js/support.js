/**
 * Запрос сессии
 * @param {*} url
 * @param {*} sessionUrl
 */
function getApplePaySession(url, sessionUrl) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        //xhr.setRequestHeader("Content-Type", "application/json");
        xhr.open('POST', sessionUrl);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //console.log(JSON.stringify({url: url}));
        xhr.send('url=' + encodeURIComponent(url));
    });
}

/**
 * Обработка платежа
 * @param {*} payment
 * @param {*} processPaymentUrl
 */
function processPayment(payment, processPaymentUrl) {
    return new Promise(function (resolve, reject) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(JSON.parse(xhr.response));
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        //xhr.setRequestHeader("Content-Type", "application/json");
        xhr.open('POST', processPaymentUrl);
        xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
        //console.log(JSON.stringify({url: url}));
        xhr.send('paymentDataJson=' + encodeURIComponent(JSON.stringify(payment)));
    });
}
