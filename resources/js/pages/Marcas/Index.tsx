import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { toast } from 'sonner';
import { useEffect } from 'react';

interface Marca {
    id: number;
    marca: string;
}

interface Props {
    marcas: Marca[];
}

export default function Index({ marcas }: Props) {
    const page = usePage<any>();
    
    useEffect(() => {
        if (page.props.flash?.success) {
            toast.success(page.props.flash.success);
        }
    }, [page.props.flash]);

    return (
        <AppLayout>
            <Head title="Marcas" />
            
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Marcas</h1>
                    <Link href={route('marcas.create')}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nueva Marca
                        </Button>
                    </Link>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Marca
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {marcas.map((marca) => (
                                <tr key={marca.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{marca.marca}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link href={route('marcas.edit', marca.id)}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <DeleteConfirmationDialog 
                                                url={route('marcas.destroy', marca.id)}
                                                title="Eliminar marca"
                                                description={`¿Está seguro que desea eliminar la marca ${marca.marca}? Esta acción no se puede deshacer.`}
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
                    {marcas.map((marca) => (
                        <Card key={marca.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{marca.marca}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex gap-2">
                                    <Link href={route('marcas.edit', marca.id)}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Editar
                                        </Button>
                                    </Link>
                                    <DeleteConfirmationDialog 
                                        url={route('marcas.destroy', marca.id)}
                                        title="Eliminar marca"
                                        description={`¿Está seguro que desea eliminar la marca ${marca.marca}? Esta acción no se puede deshacer.`}
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