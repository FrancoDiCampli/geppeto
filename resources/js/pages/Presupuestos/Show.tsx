import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

interface Presupuesto {
    id: number;
    numpresupuesto: number;
    total: number;
    subtotal: number;
    fecha: string;
    cliente: {
        razonsocial: string;
    };
    user: {
        name: string;
    };
    articulos: Array<{
        id: number;
        articulo: string;
        codarticulo: string;
        pivot: {
            cantidad: number;
            preciounitario: number;
            subtotal: number;
        };
    }>;
}

interface Props {
    presupuesto: Presupuesto;
}

export default function Show({ presupuesto }: Props) {
    return (
        <AppLayout>
            <Head title={`Presupuesto #${presupuesto.numpresupuesto}`} />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Presupuesto #{presupuesto.numpresupuesto}</h1>
                        <p className="text-gray-600">Detalles del presupuesto</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('presupuestos.index')}>
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información del Presupuesto</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Cliente</label>
                                <p className="text-sm">{presupuesto.cliente.razonsocial}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Vendedor</label>
                                <p className="text-sm">{presupuesto.user.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Fecha</label>
                                <p className="text-sm">{new Date(presupuesto.fecha).toLocaleDateString()}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Totales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Subtotal</label>
                                <p className="text-sm">${Number(presupuesto.subtotal).toFixed(2)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Total</label>
                                <p className="text-lg font-bold">${Number(presupuesto.total).toFixed(2)}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Artículos</CardTitle>
                        <CardDescription>
                            {presupuesto.articulos.length} artículo{presupuesto.articulos.length !== 1 ? 's' : ''}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left p-2">Código</th>
                                        <th className="text-left p-2">Artículo</th>
                                        <th className="text-left p-2">Cantidad</th>
                                        <th className="text-left p-2">Precio Unit.</th>
                                        <th className="text-left p-2">Subtotal</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {presupuesto.articulos.map((articulo) => (
                                        <tr key={articulo.id} className="border-b">
                                            <td className="p-2 font-mono text-sm">{articulo.codarticulo}</td>
                                            <td className="p-2 font-medium">{articulo.articulo}</td>
                                            <td className="p-2">{articulo.pivot.cantidad}</td>
                                            <td className="p-2">${Number(articulo.pivot.preciounitario).toFixed(2)}</td>
                                            <td className="p-2">${Number(articulo.pivot.subtotal).toFixed(2)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}