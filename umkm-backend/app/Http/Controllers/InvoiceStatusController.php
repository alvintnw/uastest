<?php

namespace App\Http\Controllers;

use App\Models\Invoice;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class InvoiceStatusController extends Controller
{
    public function updateStatus(Request $request, $invoiceId): JsonResponse
    {
        $validated = $request->validate([
            'status' => 'required|in:Menunggu,Diproses,Selesai'
        ]);

        // Cari invoice berdasarkan ID (string untuk MongoDB)
        $invoice = Invoice::find($invoiceId);

        if (!$invoice) {
            return response()->json([
                'success' => false,
                'message' => 'Invoice not found'
            ], 404);
        }

        try {
            // Log status sebelum update
            \Log::info("Updating invoice status", [
                'invoice_id' => $invoiceId,
                'old_status' => $invoice->status,
                'new_status' => $validated['status']
            ]);

            // Update status langsung
            $invoice->status = $validated['status'];
            $result = $invoice->save();

            if (!$result) {
                throw new \Exception('Failed to save invoice');
            }

            // Refresh data untuk memastikan perubahan tersimpan
            $invoice->refresh();

            // Verifikasi status benar-benar berubah
            if ($invoice->status !== $validated['status']) {
                throw new \Exception('Status update verification failed');
            }

            \Log::info("Invoice status updated successfully", [
                'invoice_id' => $invoiceId,
                'status' => $invoice->status
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Status invoice berhasil diperbarui',
                'data' => $invoice
            ]);

        } catch (\Exception $e) {
            \Log::error("Failed to update invoice status", [
                'invoice_id' => $invoiceId,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Gagal memperbarui status invoice: ' . $e->getMessage()
            ], 500);
        }
    }
}
