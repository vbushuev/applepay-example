/*
Основной client-side JS. Обрабатывает нажатие на кнопку Apple Pay и совершает запрос платежа.
*/

/**
 * Метод вызывается после загрузки страницы.
 * Используется для отображения кнопки, если Apple Pay поддерживается браузером.
 * Здесь вызывается метод ApplePaySession.canMakePayments(), который производит проверку устройства.
 */
document.addEventListener('DOMContentLoaded', () => {
    if (window.ApplePaySession) {
        if (ApplePaySession.canMakePayments()) {
            showApplePayButton();
        }
    }
});

function showApplePayButton() {
    HTMLCollection.prototype[Symbol.iterator] = Array.prototype[Symbol.iterator];
    const buttons = document.getElementsByClassName("apple-pay-button");
    for (let button of buttons) {
        button.className += " visible";
    }
}

/**
 * Обработчик нажатия кнопки оплаты.
 */
function applePayButtonClicked(customer, paymentSystemName, paymentRequest) {
    const session = new ApplePaySession(1, paymentRequest);
    const getSessionUrl = '/ajax/get_session.php?customer=' + customer + '&psName=' + paymentSystemName;
    const processPaymentUrl = '/ajax/process_payment.php?customer=' + customer + '&psName=' + paymentSystemName;
    const resultUrl = platronBaseUrl + '/result?customer=' + customer;

    /**
     * Merchant Validation
     * Проверка магазина.
     */
    session.onvalidatemerchant = (event) => {
        console.log("Validate merchant");
        const validationURL = event.validationURL;
        getApplePaySession(event.validationURL, getSessionUrl).then(function (response) {
            console.log(response);
            session.completeMerchantValidation(response);
        });
    };

    /**
     * Payment Authorization
     * В этот обработчик приходят зашифрованные данные, которые необходимо отправить на сервер
     * для совершения платежа.
     */
    session.onpaymentauthorized = (event) => {
        console.log('Metchant Authorized');
        // Отправляем запрос на обработку...
        const payment = event.payment;

        processPayment(payment, processPaymentUrl).then(function (response) {
            if (response['status'] === 'ok') {
                console.log('completePayment: SUCCESS');
                session.completePayment(ApplePaySession.STATUS_SUCCESS);
            } else {
                console.log('completePayment: FAILURE');
                session.completePayment(ApplePaySession.STATUS_FAILURE);
            }
            window.location.href = resultUrl;
        }, function (response) {
            console.log('completePayment: FAILURE');
            session.completePayment(ApplePaySession.STATUS_FAILURE);
            window.location.href = resultUrl;
        });
    }

    // Запуск платежа Apple Pay
    session.begin();
}
