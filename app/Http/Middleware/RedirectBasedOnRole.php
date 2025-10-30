<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class RedirectBasedOnRole
{
    public function handle(Request $request, Closure $next): Response
    {
        if (auth()->check()) {
            $user = auth()->user();
            $userRole = $user->role?->role;
            
            // Si es vendedor y está intentando acceder a dashboard, redirigir a ventas
            if ($userRole === 'vendedor' && $request->routeIs('dashboard')) {
                return redirect()->route('ventas.index');
            }
        }

        return $next($request);
    }
}