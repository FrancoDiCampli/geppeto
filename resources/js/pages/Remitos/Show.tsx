import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Package } from 'lucide-react';

interface Supplier {
    id: number;
    razonsocial: string;
    cuit: string;
}

interface Articulo {
    id: number;
    codarticulo: string;
    articulo: string;
}

interface Detalle {
    id: number;
    cantidad: number;
    preciounitario: number;
    subtotal: number;
    articulo: Articulo;
}

interface Remito {
    id: number;
    ptoventa: number;
    numremito: number;
    fecha: string;
    subtotal: number;
    total: number;
    convertido_inventario: boolean;
    supplier: Supplier;
    detalles: Detalle[];
}

interface Props {
    remito: Remito;
}

export default function Show({ remito }: Props) {
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-AR', {
            style: 'currency',
            currency: 'ARS'
        }).format(amount);
    };

    const formatDate = (date: string) => {
        return new Date(date).toLocaleDateString('es-AR');
    };

    const numeroCompleto = `${remito.ptoventa.toString().padStart(4, '0')}-${remito.numremito.toString().padStart(8, '0')}`;

    return (
        <AppLayout>
            <Head title={`Remito ${numeroCompleto}`} />
            
            <div className="p-6">
                <div className="flex items-center gap-4 mb-6">
                    <Link href={route('remitos.index')}>
                        <Button variant="outline" size="sm">
                            <ArrowLeft className="h-4 w-4" />
                        </Button>
                    </Link>
                    <div>
                        <h1 className="text-2xl font-bold">Remito {numeroCompleto}</h1>
                        <p className="text-gray-600">{formatDate(remito.fecha)}</p>
                        {remito.convertido_inventario && (
                            <p className="text-green-600 font-semibold">✓ Convertido a inventario</p>
                        )}
                    </div>
                </div>
                
                {!remito.convertido_inventario && (
                    <div className="mb-6">
                        <Link href={route('remitos.convertir-inventario', remito.id)} method="post" as="button">
                            <Button className="bg-green-600 hover:bg-green-700">
                                <Package className="h-4 w-4 mr-2" />
                                Convertir a Inventario
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Artículos</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    {remito.detalles.map((detalle) => (
                                        <div key={detalle.id} className="border rounded-lg p-4">
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <h3 className="font-semibold">{detalle.articulo.articulo}</h3>
                                                    <p className="text-sm text-gray-600">Código: {detalle.articulo.codarticulo}</p>
                                                    <p className="text-sm text-gray-600">
                                                        Cantidad: {detalle.cantidad} × {formatCurrency(detalle.preciounitario)}
                                                    </p>
                                                </div>
                                                <div className="text-right">
                                                    <p className="font-bold">{formatCurrency(detalle.subtotal)}</p>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div>
                        <Card className="mb-6">
                            <CardHeader>
                                <CardTitle>Proveedor</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div>
                                        <p className="font-semibold">{remito.supplier.razonsocial}</p>
                                        <p className="text-sm text-gray-600">CUIT: {remito.supplier.cuit}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Resumen</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span>Subtotal:</span>
                                        <span>{formatCurrency(remito.subtotal)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg border-t pt-2">
                                        <span>Total:</span>
                                        <span>{formatCurrency(remito.total)}</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}