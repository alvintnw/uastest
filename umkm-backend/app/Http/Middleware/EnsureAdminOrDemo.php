<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;

class EnsureAdminOrDemo
{
    /**
     * Handle an incoming request.
     * Allow access if:
     * - authenticated user is admin, OR
     * - Authorization header contains Bearer demo-token-*
     * In demo case, create or retrieve a demo admin user and set it as the current user.
     */
    public function handle(Request $request, Closure $next)
    {
        // Check for demo token
        $authHeader = $request->header('Authorization', '');
        if (str_starts_with($authHeader, 'Bearer demo-token-')) {
            // ensure demo admin user exists
            $email = 'admin@umkmdelicious.com';
            $user = User::where('email', $email)->first();
            if (!$user) {
                $user = User::create([
                    'name' => 'Admin Demo',
                    'email' => $email,
                    'password' => bcrypt('password123'),
                    'role' => 'admin',
                    'is_active' => true
                ]);
            }

            // set the current user for the request
            Auth::setUser($user);
            return $next($request);
        }

        // If user is authenticated, check role
        $user = $request->user();
        if ($user && method_exists($user, 'isAdmin') && $user->isAdmin()) {
            return $next($request);
        }

        return response()->json(['success' => false, 'message' => 'Forbidden - admin only'], 403);
    }
}
