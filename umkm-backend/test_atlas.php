<?php
require 'vendor/autoload.php';

try {
    $uri = "mongodb+srv://Aldi:Aldi12345@cluster0.yezc2.mongodb.net/?appName=Cluster0";
    $client = new MongoDB\Client($uri);

    $collection = $client->umkm_backend->users;

    $result = $collection->insertOne([
        'name' => 'Aldi',
        'email' => uniqid() . '@noemail.com', // Tambahkan ini
        'status' => 'Connected to MongoDB Atlas!',
        'time' => date('Y-m-d H:i:s')
    ]);

    echo "✅ Koneksi berhasil! Inserted ID: " . $result->getInsertedId() . PHP_EOL;

} catch (Exception $e) {
    echo "❌ Gagal konek: " . $e->getMessage() . PHP_EOL;
}
