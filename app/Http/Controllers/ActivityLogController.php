<?php

namespace App\Http\Controllers;

use Spatie\Activitylog\Models\Activity;
use Inertia\Inertia;

class ActivityLogController extends Controller
{
    public function index()
    {
        $activities = Activity::with(['causer', 'subject'])
            ->latest()
            ->paginate(20);

        return Inertia::render('ActivityLog/Index', [
            'activities' => $activities
        ]);
    }
}