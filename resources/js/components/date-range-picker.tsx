import { useState } from 'react';
import { DayPicker, DateRange } from 'react-day-picker';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from 'lucide-react';
import 'react-day-picker/dist/style.css';

interface DateRangePickerProps {
    from: Date;
    to: Date;
    onRangeChange: (from: Date, to: Date) => void;
}

export function DateRangePicker({ from, to, onRangeChange }: DateRangePickerProps) {
    const [range, setRange] = useState<DateRange | undefined>({ from, to });
    const [isOpen, setIsOpen] = useState(false);

    const handleSelect = (selectedRange: DateRange | undefined) => {
        if (selectedRange) {
            setRange(selectedRange);
            if (selectedRange.from && selectedRange.to) {
                onRangeChange(selectedRange.from, selectedRange.to);
                setIsOpen(false);
            } else if (selectedRange.from && !selectedRange.to) {
                // Solo se seleccionó fecha de inicio, mantener abierto
            }
        }
    };

    const formatDate = (date: Date) => {
        return date.toLocaleDateString('es-ES', { 
            day: '2-digit', 
            month: '2-digit', 
            year: 'numeric' 
        });
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <Calendar className="mr-2 h-4 w-4" />
                    {from && to ? (
                        `${formatDate(from)} - ${formatDate(to)}`
                    ) : (
                        'Seleccionar rango de fechas'
                    )}
                </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 max-w-[95vw]" align="start">
                <DayPicker
                    mode="range"
                    selected={range}
                    onSelect={handleSelect}
                    numberOfMonths={1}
                />
            </PopoverContent>
        </Popover>
    );
}