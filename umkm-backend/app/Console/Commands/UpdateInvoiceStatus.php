<?php

namespace App\Console\Commands;

use App\Models\Invoice;
use Illuminate\Console\Command;

class UpdateInvoiceStatus extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'invoices:update-status';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Update invoice status automatically based on time elapsed';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $this->info('Updating invoice statuses...');

        // Update pending invoices to processed after 10 seconds
        $pendingInvoices = Invoice::where('status', 'pending')
            ->where('created_at', '<=', now()->subSeconds(10))
            ->get();

        foreach ($pendingInvoices as $invoice) {
            $invoice->update([
                'status' => 'processed',
                'processed_at' => now()
            ]);
            $this->info("Invoice {$invoice->invoice_number} updated to processed");
        }

        // Update processed invoices to completed after another 10 seconds (total 20 seconds)
        $processedInvoices = Invoice::where('status', 'processed')
            ->where('processed_at', '<=', now()->subSeconds(10))
            ->get();

        foreach ($processedInvoices as $invoice) {
            $invoice->update([
                'status' => 'completed',
                'completed_at' => now()
            ]);
            $this->info("Invoice {$invoice->invoice_number} updated to completed");
        }

        $this->info('Invoice status update completed.');
    }
}
