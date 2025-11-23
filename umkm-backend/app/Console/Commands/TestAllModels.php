<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\Product;
use App\Models\User;
use App\Models\Food;
use App\Models\Developer;
use App\Models\Invoice;
use App\Models\InvoiceItem;
use App\Models\Sale;

class TestAllModels extends Command
{
    protected $signature = 'test:all-models';
    protected $description = 'Test all MongoDB Atlas connections for all models';

    public function handle()
    {
        $this->info('Testing MongoDB Atlas connections for all models...');
        $this->newLine();

        $models = [
            'Products' => Product::class,
            'Users' => User::class,
            'Foods' => Food::class,
            'Developers' => Developer::class,
            'Invoices' => Invoice::class,
            'InvoiceItems' => InvoiceItem::class,
            'Sales' => Sale::class,
        ];

        foreach ($models as $name => $modelClass) {
            try {
                $count = $modelClass::count();
                $this->info("✅ {$name}: {$count} records found");
            } catch (\Exception $e) {
                $this->error("❌ {$name}: " . $e->getMessage());
            }
        }

        $this->newLine();
        $this->info('All model tests completed!');
    }
}
