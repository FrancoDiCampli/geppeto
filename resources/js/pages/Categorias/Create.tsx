import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function Create() {
    const { data, setData, post, processing, errors } = useForm({
        categoria: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('categorias.store'));
    };

    return (
        <AppLayout>
            <Head title="Crear Categoría" />
            
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Crear Nueva Categoría</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div>
                            <Label htmlFor="categoria">Categoría *</Label>
                            <Input
                                id="categoria"
                                value={data.categoria}
                                onChange={(e) => setData('categoria', e.target.value)}
                                error={errors.categoria}
                                placeholder="Ingrese el nombre de la categoría"
                            />
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Creando...' : 'Crear'}
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