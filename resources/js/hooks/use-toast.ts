import { usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import { useEffect } from 'react';

export function useToast() {
    const { props } = usePage();
    const flash = (props as any).flash;

    useEffect(() => {
        if (flash?.success) {
            toast.success(flash.success);
        }
        if (flash?.error) {
            toast.error(flash.error);
        }
    }, [flash?.success, flash?.error]);
}