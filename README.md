# Пример размещения кнопки оплаты через Apple Pay
*Представленный код указан в качестве примера, в нем могут отсутствовать необходимые проверки и валидация данных.*

## Описание
Пример демонстрирует возможность проведения оплаты через Apple Pay с размещением кнопки оплаты на стороне магазина.

### Создание платежа
Для проведения платежа с помощью Apple Pay сначала необходимо создать платеж в Платроне. Для этого необходимо отправить запрос на `init_payment.php` с указанием необходимых параметров [:link:](https://front.platron.ru/docs/api/initialize_payment/).
#### Рекомендуемые параметры
Номер телефона плательщика является обязательным параметром для платежа в Плтароне. Номер телефона можно передать в параметре `pg_user_phone` в запросе на создание платежа, либо запросить из Apple Wallet (см. далее). Email адрес плательщика не является обязательным параметром, его так же можно передать либо в параметре `pg_user_contact_email` в запросе на создание платежа, либо запросить из Apple Wallet (см. далее).  
Так как пользователь не попадает на сторону Платрона, рекомендуется передать IP адрес пользоывателя в параметре `pg_user_ip`, IP адрес используется для проверки платежа на фрод.
#### Обработка ответа
В ответ на запрос создания платежа будет получен ответ в виде XML, в котором присутсвует элемент `pg_redirect_url` в котором указан url, из этого url необходимо получить значение параметра `customer`, это значение понадобится далее. Например, был получен следующий url:
```
https://www.platron.ru/payment_params.php?customer=ccaa41a4f425d124a23c3a53a3140bdc15826
```
Значением параметра `customer` из этого url является следуюая строка:
```
ccaa41a4f425d124a23c3a53a3140bdc15826
```

### Apple Pay JS API
Для взаимодействия с кошельком пользователя используется Apple Pay JS API. Для совершения платежа необходимо создать объект `ApplePaySession` и указать обработчики событий `onvalidatemerchant` и `onpaymentauthorized`.
> Обычно, браузеры блокируют кросс-доменные ajax запросы. Из-за этого, в данном примере, ajax запрос отправляется на текущий сервер, а сервер отправляет данные в Платрон.

#### Создание объекта `ApplePaySession`[:link:](https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/creating_an_apple_pay_session)
В конструктор объекта `ApplePaySession` необходимо передать данные платежа в виде структуры `ApplePayPaymentRequest`[:link:](https://developer.apple.com/documentation/apple_pay_on_the_web/applepaypaymentrequest).
```javascript
const paymentRequest = {
    countryCode: 'RU', // код страны магазина
    currencyCode: 'RUB', //  код валюты платежа
    total: {
        label: 'Your Company Inc.', // название компании
        amount: '1.50' // сумма платежа
    },
    supportedNetworks: ['masterCard', 'visa'], // принимаемые типы карт
    merchantCapabilities: ['supports3DS'], // обязательное значение
    requiredShippingContactFields: ['phone', 'email'] // дополнительные данные плательщика
};
```
Номер телефона плательщика является обязательным параметром для платежа в Платроне, если номер телефона не был указан при создании транзакции, необходимо запросить номер телефона из Apple Wallet. Для этого необходимо указать `'phone'` в параметре `requiredShippingContactFields`. Email адрес плательщика не является обязательным, но, если настроена отправка чеков через Платрон и в ОФД не настроена отправка чеков по СМС, плательщик не получит чек.

#### Обработка события `onvalidatemerchant`[:link:](https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api/providing_merchant_validation)
В объекте события присутствует свойство `validationURL`, значение этого свойства необходимо отправить в Платрон для получения сессии от Apple Pay.
Полученный url необходима отправить в теле POST запроса по следующему адресу:
```
https://platron.ru/index.php/web/apple-pay/get-apple-pay-session?customer=<customer>&psName=<psName>
```
где параметр `customer` - это значение полученное из ответа на создание платежа, а значение параметра `psName` - это название платежной системы Apple Pay в Платроне.
В теле запроса необходимо передать следующие данные:
```
url=<validationUrl>
```
где `<validationUrl>` это значение полученное из параметра `validationUrl` события.

#### Обработка события `onpaymentauthorized`[:link:](https://developer.apple.com/documentation/apple_pay_on_the_web/applepaysession/1778020-onpaymentauthorized)
В объекте события присутствует свойство `payment`, в этом свойстве находится объект `ApplePayPayment`[:link:](https://developer.apple.com/documentation/apple_pay_on_the_web/applepaypayment) необходимый для совершения платежа. Этот объект необходимо отправить в Платрон в виде JSON строки для проведения платежа. Данное значение необходимо отправить в теле POST запроса по следующему адресу:
```
https://platron.ru/index.php/web/apple-pay/process-payment?customer=<customer>&psName=<psName>
``` 
где параметр `customer` - это значение полученное из ответа на создание платежа, а значение параметра `psName` - это название платежной системы Apple Pay в Платроне.
В теле запроса необходимо передать следующие данные:
```
paymentDataJson=<payment_as_json>
```
где `<payment_as_json>` - это объект `ApplePayPayment` преобразованный в JSON.

## Инструкция по запуску
*Для запуска примера необходим сервер с PHP*
1. Разместить код примера на сервере так, чтобы `DOCUMENT_ROOT` указывал на папку `public`
1. Выполнить команду `composer install` в папке с примером

## Ссылки
* Apple Pay JS API - https://developer.apple.com/documentation/apple_pay_on_the_web/apple_pay_js_api
* Требования к оформлению - https://developer.apple.com/design/human-interface-guidelines/apple-pay/overview/introduction/
* Пример реализации - https://developer.apple.com/library/archive/samplecode/EmporiumWeb/Introduction/Intro.html
