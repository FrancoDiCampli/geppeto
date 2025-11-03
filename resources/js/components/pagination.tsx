import { Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    links: Array<{
        url: string | null;
        label: string;
        active: boolean;
    }>;
}

export function Pagination({ links }: PaginationProps) {
    return (
        <div className="flex items-center justify-center space-x-1 mt-6">
            {links.map((link, index) => {
                if (link.label === '&laquo; Previous') {
                    return (
                        <Link key={index} href={link.url || '#'} preserveState>
                            <Button variant="outline" size="sm" disabled={!link.url}>
                                <ChevronLeft className="w-4 h-4" />
                            </Button>
                        </Link>
                    );
                }
                
                if (link.label === 'Next &raquo;') {
                    return (
                        <Link key={index} href={link.url || '#'} preserveState>
                            <Button variant="outline" size="sm" disabled={!link.url}>
                                <ChevronRight className="w-4 h-4" />
                            </Button>
                        </Link>
                    );
                }
                
                return (
                    <Link key={index} href={link.url || '#'} preserveState>
                        <Button 
                            variant={link.active ? "default" : "outline"} 
                            size="sm"
                            disabled={!link.url}
                        >
                            {link.label}
                        </Button>
                    </Link>
                );
            })}
        </div>
    );
}