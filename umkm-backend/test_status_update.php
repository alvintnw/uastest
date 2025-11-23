<?php
require 'vendor/autoload.php';

$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Invoice;

// Test update status
try {
    // Cari semua invoice
    $invoices = Invoice::all();

    echo "Total invoices: " . $invoices->count() . PHP_EOL;

    if ($invoices->count() > 0) {
        foreach ($invoices as $invoice) {
            echo "Invoice ID: " . $invoice->_id . " - Status: " . $invoice->status . PHP_EOL;
        }

        // Test update invoice pertama
        $firstInvoice = $invoices->first();
        echo PHP_EOL . "Testing update untuk invoice: " . $firstInvoice->_id . PHP_EOL;
        echo "Status sebelum: " . $firstInvoice->status . PHP_EOL;

        // Update status
        $firstInvoice->status = 'Diproses';
        $saved = $firstInvoice->save();

        if ($saved) {
            // Refresh dan cek
            $firstInvoice->refresh();
            echo "Status setelah update: " . $firstInvoice->status . PHP_EOL;

            if ($firstInvoice->status === 'Diproses') {
                echo "✅ Update status berhasil!" . PHP_EOL;
            } else {
                echo "❌ Status tidak berubah di database" . PHP_EOL;
            }
        } else {
            echo "❌ Save gagal" . PHP_EOL;
        }
    } else {
        echo "❌ Tidak ada invoice ditemukan" . PHP_EOL;
    }

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . PHP_EOL;
    echo "Stack trace: " . $e->getTraceAsString() . PHP_EOL;
}
