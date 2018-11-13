<?php

class Client
{
    const BASE_URL = 'https://platron.ru';

    private $curl;

    public function __construct()
    {
        $curl = curl_init();
        curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
        $this->curl = $curl;
    }

    public function get($endpoint, $parameters)
    {
        $url = self::BASE_URL . '/' . $endpoint . '?' . http_build_query($parameters);
        curl_setopt($this->curl, CURLOPT_URL, $url);
        curl_setopt($this->curl, CURLOPT_POST, 0);

        return curl_exec($this->curl);
    }

    public function __destruct()
    {
        curl_close($this->curl);
    }
}
