import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Role {
    id: number;
    role: string;
    permission?: string;
    description?: string;
}

interface Props {
    role: Role;
}

export default function Edit({ role }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        role: role.role,
        permission: role.permission || '',
        description: role.description || '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('roles.update', role.id));
    };

    return (
        <AppLayout>
            <Head title="Editar Rol" />
            
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Editar Rol</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label htmlFor="role">Rol</Label>
                            <Input
                                id="role"
                                value={data.role}
                                onChange={(e) => setData('role', e.target.value)}
                                error={errors.role}
                            />
                        </div>

                        <div>
                            <Label htmlFor="permission">Permisos</Label>
                            <Input
                                id="permission"
                                value={data.permission}
                                onChange={(e) => setData('permission', e.target.value)}
                                error={errors.permission}
                            />
                        </div>

                        <div>
                            <Label htmlFor="description">Descripción</Label>
                            <Input
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                error={errors.description}
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                Actualizar
                            </Button>
                            <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                Cancelar
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppLayout>
    );
}