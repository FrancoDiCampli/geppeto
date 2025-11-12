<?php

namespace App\Traits;

trait HasToastNotifications
{
    protected function toastSuccess(string $message): void
    {
        session()->flash('flash.success', $message);
    }

    protected function toastError(string $message): void
    {
        session()->flash('flash.error', $message);
    }

    protected function toastWarning(string $message): void
    {
        session()->flash('flash.warning', $message);
    }

    protected function toastInfo(string $message): void
    {
        session()->flash('flash.info', $message);
    }
}