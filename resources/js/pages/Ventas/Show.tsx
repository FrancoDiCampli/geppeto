import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AppLayout from '@/layouts/app-layout';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, DollarSign, Trash2, Package } from 'lucide-react';
import { DeleteConfirmationDialog } from '@/components/delete-confirmation-dialog';

interface Factura {
    id: number;
    numfactura: number;
    total: number;
    subtotal: number;
    recargo?: number;
    descuento?: number;
    fecha: string;
    pagada: string;
    total_pagado: number;
    saldo_pendiente: number;
    cae?: string;
    vencimiento_cae?: string;
    autorizada_afip?: boolean;
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
    pagos: Array<{
        id: number;
        monto: number;
        metodo_pago: string;
        fecha_pago: string;
        observaciones?: string;
    }>;
    entregas: Array<{
        id: number;
        articulo_id: number;
        cantidad: number;
        fecha_entrega: string;
        observaciones?: string;
        articulo: {
            codarticulo: string;
            articulo: string;
        };
    }>;
}

interface Props {
    factura: Factura;
}

const metodoPagoLabels = {
    efectivo: 'Efectivo',
    tarjeta_debito: 'Tarjeta de Débito',
    tarjeta_credito: 'Tarjeta de Crédito',
    transferencia: 'Transferencia',
    mercadopago: 'MercadoPago',
    cheque: 'Cheque'
};

export default function Show({ factura }: Props) {
    const totalPagado = factura.pagos?.reduce((sum, pago) => sum + Number(pago.monto), 0) || 0;
    const saldoPendiente = Number(factura.total) - totalPagado;

    return (
        <AppLayout>
            <Head title={`Venta #${factura.numfactura}`} />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-bold">Venta #{factura.numfactura}</h1>
                        <p className="text-gray-600">Detalles de la venta</p>
                    </div>
                    <div className="flex gap-2">
                        <Link href={route('ventas.index')}>
                            <Button variant="outline">
                                <ArrowLeft className="w-4 h-4 mr-2" />
                                Volver
                            </Button>
                        </Link>
                        {(() => {
                            const totalVendido = factura.articulos?.reduce((sum, art) => sum + art.pivot.cantidad, 0) || 0;
                            const totalEntregado = factura.entregas?.reduce((sum, ent) => sum + ent.cantidad, 0) || 0;
                            return totalEntregado < totalVendido;
                        })() && (
                            <Link href={route('entregas.create', factura.id)}>
                                <Button variant="outline">
                                    <Package className="w-4 h-4 mr-2" />
                                    Registrar Entrega
                                </Button>
                            </Link>
                        )}
                        {saldoPendiente > 0 && (
                            <Link href={route('pagos.create', factura.id)}>
                                <Button>
                                    <DollarSign className="w-4 h-4 mr-2" />
                                    Registrar Pago
                                </Button>
                            </Link>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Venta</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Cliente</label>
                                <p className="text-sm">{factura.cliente.razonsocial}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Vendedor</label>
                                <p className="text-sm">{factura.user.name}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Estado</label>
                                <p className="text-sm">
                                    <span className={`px-2 py-1 rounded text-xs ${
                                        factura.pagada === 'SI' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                    }`}>
                                        {factura.pagada === 'SI' ? 'Pagada' : 'Pendiente'}
                                    </span>
                                </p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Fecha</label>
                                <p className="text-sm">{new Date(factura.fecha).toLocaleDateString()}</p>
                            </div>
                            {factura.cae && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">CAE</label>
                                    <p className="text-sm font-mono">{factura.cae}</p>
                                </div>
                            )}
                            {factura.vencimiento_cae && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Vencimiento CAE</label>
                                    <p className="text-sm">{factura.vencimiento_cae}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Totales</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <label className="text-sm font-medium text-gray-500">Subtotal</label>
                                <p className="text-sm">${Number(factura.subtotal).toFixed(2)}</p>
                            </div>
                            {factura.recargo && Number(factura.recargo) > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Recargo</label>
                                    <p className="text-sm text-orange-600">+${Number(factura.recargo).toFixed(2)}</p>
                                </div>
                            )}
                            {factura.descuento && Number(factura.descuento) > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Descuento</label>
                                    <p className="text-sm text-green-600">-${Number(factura.descuento).toFixed(2)}</p>
                                </div>
                            )}
                            <div>
                                <label className="text-sm font-medium text-gray-500">Total</label>
                                <p className="text-lg font-bold">${Number(factura.total).toFixed(2)}</p>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-500">Total Pagado</label>
                                <p className="text-sm font-semibold text-green-600">${totalPagado.toFixed(2)}</p>
                            </div>
                            {saldoPendiente > 0 && (
                                <div>
                                    <label className="text-sm font-medium text-gray-500">Saldo Pendiente</label>
                                    <p className="text-lg font-bold text-red-600">${saldoPendiente.toFixed(2)}</p>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <Card className="mb-6">
                    <CardHeader>
                        <CardTitle>Artículos</CardTitle>
                        <CardDescription>
                            {factura.articulos.length} artículo{factura.articulos.length !== 1 ? 's' : ''}
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
                                    {factura.articulos.map((articulo) => (
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

                {factura.pagos && factura.pagos.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Pagos Realizados</CardTitle>
                            <CardDescription>
                                {factura.pagos.length} pago{factura.pagos.length !== 1 ? 's' : ''}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left p-2">Monto</th>
                                            <th className="text-left p-2">Método</th>
                                            <th className="text-left p-2">Fecha</th>
                                            <th className="text-left p-2">Observaciones</th>
                                            <th className="text-right p-2">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {factura.pagos.map((pago) => (
                                            <tr key={pago.id} className="border-b">
                                                <td className="p-2 font-medium">${Number(pago.monto).toFixed(2)}</td>
                                                <td className="p-2">
                                                    {metodoPagoLabels[pago.metodo_pago as keyof typeof metodoPagoLabels] || pago.metodo_pago}
                                                </td>
                                                <td className="p-2">{new Date(pago.fecha_pago).toLocaleDateString()}</td>
                                                <td className="p-2">{pago.observaciones || '-'}</td>
                                                <td className="p-2 text-right">
                                                    <DeleteConfirmationDialog 
                                                        url={route('pagos.destroy', pago.id)}
                                                        title="Eliminar pago"
                                                        description={`¿Está seguro que desea eliminar este pago de $${Number(pago.monto).toFixed(2)}?`}
                                                        trigger={
                                                            <Button variant="outline" size="sm">
                                                                <Trash2 className="w-4 h-4" />
                                                            </Button>
                                                        }
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}

                {factura.entregas && factura.entregas.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>Entregas Realizadas</CardTitle>
                            <CardDescription>
                                {factura.entregas.length} entrega{factura.entregas.length !== 1 ? 's' : ''}
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
                                            <th className="text-left p-2">Fecha</th>
                                            <th className="text-left p-2">Observaciones</th>
                                            <th className="text-right p-2">Acciones</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {factura.entregas.map((entrega) => (
                                            <tr key={entrega.id} className="border-b">
                                                <td className="p-2 font-mono text-sm">{entrega.articulo.codarticulo}</td>
                                                <td className="p-2 font-medium">{entrega.articulo.articulo}</td>
                                                <td className="p-2">{entrega.cantidad}</td>
                                                <td className="p-2">{new Date(entrega.fecha_entrega).toLocaleDateString()}</td>
                                                <td className="p-2">{entrega.observaciones || '-'}</td>
                                                <td className="p-2 text-right">
                                                    <DeleteConfirmationDialog 
                                                        url={route('entregas.destroy', entrega.id)}
                                                        title="Eliminar entrega"
                                                        description={`¿Está seguro que desea eliminar esta entrega de ${entrega.cantidad} unidades?`}
                                                        trigger={<Button variant="outline" size="sm"><Trash2 className="w-4 h-4" /></Button>}
                                                    />
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </CardContent>
                    </Card>
                )}
            </div>
        </AppLayout>
    );
}