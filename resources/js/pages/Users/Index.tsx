import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';
import { Pagination } from '@/components/pagination';

interface User {
    id: number;
    name: string;
    email: string;
    created_at: string;
    role?: {
        role: string;
    };
}

interface Props {
    users: {
        data: User[];
        links: any;
        meta: any;
    };
}

export default function Index({ users }: Props) {
    return (
        <AppLayout>
            <Head title="Usuarios" />
            
            <div className="p-6">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">Usuarios</h1>
                    <Link href={route('users.create')}>
                        <Button>
                            <Plus className="w-4 h-4 mr-2" />
                            Nuevo Usuario
                        </Button>
                    </Link>
                </div>

                {/* Desktop Table */}
                <div className="hidden md:block bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Nombre
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Rol
                                </th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                    Acciones
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {users.data.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{user.name}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm text-gray-500 dark:text-gray-300">{user.email}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                            {user.role?.role || 'Sin rol'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <div className="flex justify-end gap-2">
                                            <Link href={route('users.edit', user.id)}>
                                                <Button variant="outline" size="sm">
                                                    <Edit className="w-4 h-4" />
                                                </Button>
                                            </Link>
                                            <DeleteConfirmationDialog 
                                                url={route('users.destroy', user.id)}
                                                title="Eliminar usuario"
                                                description={`¿Está seguro que desea eliminar al usuario ${user.name}? Esta acción no se puede deshacer.`}
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
                    {users.data.map((user) => (
                        <Card key={user.id}>
                            <CardHeader>
                                <CardTitle className="text-lg">{user.name}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2 mb-4">
                                    <p className="text-sm text-gray-600">{user.email}</p>
                                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
                                        {user.role?.role || 'Sin rol'}
                                    </span>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('users.edit', user.id)}>
                                        <Button variant="outline" size="sm">
                                            <Edit className="w-4 h-4 mr-2" />
                                            Editar
                                        </Button>
                                    </Link>
                                    <DeleteConfirmationDialog 
                                        url={route('users.destroy', user.id)}
                                        title="Eliminar usuario"
                                        description={`¿Está seguro que desea eliminar al usuario ${user.name}? Esta acción no se puede deshacer.`}
                                    />
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                <Pagination links={users.links} />
            </div>
        </AppLayout>
    );
}