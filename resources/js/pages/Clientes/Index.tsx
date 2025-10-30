import { Head, Link, usePage } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Plus, Edit, Search, FileText } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { toast } from 'sonner';
import { useEffect, useState } from 'react';

interface Cliente {
    id: number;
    razonsocial: string;
    documentounico: string;
    email: string;
    telefono: string;
}

interface Props {
    clientes: Cliente[];
}

export default function Index({ clientes }: Props) {
    const page = usePage<any>();
    const [filtro, setFiltro] = useState('');
    
    useEffect(() => {
        if (page.props.flash?.success) {
            toast.success(page.props.flash.success);
        }
    }, [page.props.flash]);

    const clientesFiltrados = clientes.filter(cliente =>
        cliente.razonsocial.toLowerCase().includes(filtro.toLowerCase()) ||
        cliente.documentounico.toString().includes(filtro) ||
        cliente.email?.toLowerCase().includes(filtro.toLowerCase())
    );

    return (
        <AppLayout>
            <Head title="Clientes" />
            
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Clientes</h1>
                    <Link href={route('clientes.create')}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Cliente
                        </Button>
                    </Link>
                </div>

                <div className="mb-6">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                        <Input
                            placeholder="Buscar por nombre, documento o email..."
                            value={filtro}
                            onChange={(e) => setFiltro(e.target.value)}
                            className="pl-10"
                        />
                    </div>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Razón Social
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Documento
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Contacto
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {clientesFiltrados.map((cliente) => (
                                <tr key={cliente.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{cliente.razonsocial}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-300">{cliente.documentounico}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-300">{cliente.email}</div>
                                        <div className="text-sm text-gray-400 dark:text-gray-400">{cliente.telefono}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link href={route('clientes.estado-cuenta', cliente.id)}>
                                                <Button variant="outline" size="sm">
                                                    <FileText className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <Link href={route('clientes.edit', cliente.id)}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <DeleteConfirmationDialog 
                                                url={route('clientes.destroy', cliente.id)}
                                                title="Eliminar cliente"
                                                description={`¿Está seguro que desea eliminar al cliente ${cliente.razonsocial}? Esta acción no se puede deshacer.`}
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
                    {clientesFiltrados.map((cliente) => (
                        <Card key={cliente.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{cliente.razonsocial}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 mb-4">
                                    <p className="text-sm text-gray-600">Doc: {cliente.documentounico}</p>
                                    <p className="text-sm text-gray-600">{cliente.email}</p>
                                    <p className="text-sm text-gray-600">{cliente.telefono}</p>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('clientes.estado-cuenta', cliente.id)}>
                                        <Button variant="outline" size="sm">
                                            <FileText className="w-4 h-4 mr-2" />
                                            Estado
                                        </Button>
                                    </Link>
                                    <Link href={route('clientes.edit', cliente.id)}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Editar
                                        </Button>
                                    </Link>
                                    <DeleteConfirmationDialog 
                                        url={route('clientes.destroy', cliente.id)}
                                        title="Eliminar cliente"
                                        description={`¿Está seguro que desea eliminar al cliente ${cliente.razonsocial}? Esta acción no se puede deshacer.`}
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