<?php
require_once '../../vendor/autoload.php';

$getSessionPath = 'https://platron.ru/index.php/web/apple-pay';
$getSessionPath .= '/get-apple-pay-session';

$client = new Client();

$response = $client->post($getSessionPath . '?' . http_build_query($_GET), $_POST);

header('Content-type:application/json;charset=utf-8');
echo $response;
