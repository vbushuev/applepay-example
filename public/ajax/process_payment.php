<?php
require_once '../../vendor/autoload.php';

$processPaymentPath = 'https://platron.ru/index.php/web/apple-pay';
$processPaymentPath .= '/process-payment';

$client = new Client();

$result = $client->post($processPaymentPath . '?' . http_build_query($_GET), http_build_query($_POST));

header('Content-type:application/json;charset=utf-8');
echo $response;
