import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Package } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface Inventario {
    id: number;
    cantidad: number;
    lote?: number;
    vencimiento?: string;
    articulo: {
        articulo: string;
        codarticulo: string;
    };
    supplier?: {
        razonsocial: string;
    };
}

interface Props {
    inventarios: Inventario[];
}

export default function Index({ inventarios }: Props) {
    const page = usePage<any>();
    
    useEffect(() => {
        if (page.props.flash?.success) {
            toast.success(page.props.flash.success);
        }
    }, [page.props.flash]);

    return (
        <AppLayout>
            <Head title="Inventarios" />
            
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Inventarios</h1>
                    <Link href={route('inventarios.create')}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Inventario
                        </Button>
                    </Link>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Artículo
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Cantidad
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Proveedor
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {inventarios.map((inventario) => (
                                <tr key={inventario.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{inventario.articulo.articulo}</div>
                                        <div className="text-sm text-gray-500 dark:text-gray-300">{inventario.articulo.codarticulo}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            <Package className="w-4 h-4 mr-2 text-gray-400 dark:text-gray-400" />
                                            <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{inventario.cantidad}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-300">{inventario.supplier?.razonsocial || '-'}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link href={route('inventarios.edit', inventario.id)}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <DeleteConfirmationDialog 
                                                url={route('inventarios.destroy', inventario.id)}
                                                title="Eliminar inventario"
                                                description={`¿Está seguro que desea eliminar el inventario de ${inventario.articulo.articulo}? Esta acción no se puede deshacer.`}
                                            />
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* Mobile Cards */}
                <div className="md:hidden space-y-4">
                    {inventarios.map((inventario) => (
                        <Card key={inventario.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{inventario.articulo.articulo}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 mb-4">
                                    <p className="text-sm text-gray-600">Código: {inventario.articulo.codarticulo}</p>
                                    <div className="flex items-center">
                                        <Package className="w-4 h-4 mr-2 text-gray-400" />
                                        <span className="text-sm font-semibold">Cantidad: {inventario.cantidad}</span>
                                    </div>
                                    {inventario.lote && <p className="text-sm text-gray-600">Lote: {inventario.lote}</p>}
                                    {inventario.vencimiento && (
                                        <p className="text-sm text-gray-600">
                                            Vencimiento: {new Date(inventario.vencimiento).toLocaleDateString()}
                                        </p>
                                    )}
                                    {inventario.supplier && (
                                        <p className="text-sm text-gray-600">Proveedor: {inventario.supplier.razonsocial}</p>
                                    )}
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('inventarios.edit', inventario.id)}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Editar
                                        </Button>
                                    </Link>
                                    <DeleteConfirmationDialog 
                                        url={route('inventarios.destroy', inventario.id)}
                                        title="Eliminar inventario"
                                        description={`¿Está seguro que desea eliminar el inventario de ${inventario.articulo.articulo}? Esta acción no se puede deshacer.`}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </AppLayout>
    );
}