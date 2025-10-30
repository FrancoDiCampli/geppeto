import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Eye} from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';

interface Supplier {
    id: number;
    razonsocial: string;
}

interface Detalle {
    id: number;
    cantidad: number;
    preciounitario: number;
    subtotal: number;
}

interface Remito {
    id: number;
    ptoventa: number;
    numremito: number;
    fecha: string;
    total: number;
    supplier: Supplier;
    detalles: Detalle[];
}

interface Props {
    remitos: Remito[];
}

export default function Index({ remitos }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-AR');
    };

    return (
        <AppLayout>
            <Head title="Remitos" />

            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Remitos</h1>
                    <Link href={route('remitos.create')}>
                        <Button>
                            <Plus className="h-4 w-4 mr-2" />
                            Nuevo Remito
                        </Button>
                    </Link>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Lista de Remitos</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {remitos.map((remito) => (
                                <div key={remito.id} className="border rounded-lg p-4">
                                    <div className="flex justify-between items-start">
                                        <div>
                                            <h3 className="font-semibold">
                                                Remito {remito.ptoventa.toString().padStart(4, '0')}-{remito.numremito.toString().padStart(8, '0')}
                                            </h3>
                                            <p className="text-sm text-gray-600">{remito.supplier.razonsocial}</p>
                                            <p className="text-sm text-gray-500">{formatDate(remito.fecha)}</p>
                                            <p className="text-sm text-gray-500">{remito.detalles.length} artículos</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="font-bold text-lg">{formatCurrency(remito.total)}</p>
                                            <div className="flex gap-2 mt-2">
                                                <Link href={route('remitos.show', remito.id)}>
                                                    <Button variant="outline" size="sm">
                                                        <Eye className="h-4 w-4" />
                                                    </Button>
                                                </Link>
                                                <DeleteConfirmationDialog
                                                    url={route('remitos.destroy', remito.id)}
                                                    title="Eliminar Remito"
                                                    description="¿Estás seguro de que deseas eliminar este remito? Esta acción no se puede deshacer."
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {remitos.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No hay remitos registrados.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
