import { Head, Link } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, DollarSign, CreditCard, AlertCircle, Download, FileSpreadsheet } from 'lucide-react';

interface Cliente {
    id: number;
    razonsocial: string;
    documentounico: string;
}

interface Pago {
    id: number;
    monto: number;
    metodo_pago: string;
    fecha_pago: string;
}

interface Factura {
    id: number;
    numfactura: number;
    fecha: string;
    total: number;
    pagada: string;
    pagos: Pago[];
}

interface Resumen {
    total_compras: number;
    total_pagado: number;
    saldo_pendiente: number;
}

interface Props {
    cliente: Cliente;
    facturas: Factura[];
    resumen: Resumen;
}

export default function EstadoCuenta({ cliente, facturas, resumen }: Props) {
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
            <Head title={`Estado de Cuenta - ${cliente.razonsocial}`} />
            
            <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                        <Link href={route('clientes.index')}>
                            <Button variant="outline" size="sm">
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold">Estado de Cuenta</h1>
                            <p className="text-gray-600">{cliente.razonsocial} - {cliente.documentounico}</p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <a href={route('clientes.exportar-excel', cliente.id)}>
                            <Button variant="outline" size="sm">
                                <FileSpreadsheet className="h-4 w-4 mr-2" />
                                Excel
                            </Button>
                        </a>
                        <a href={route('clientes.exportar-pdf', cliente.id)}>
                            <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                PDF
                            </Button>
                        </a>
                    </div>
                </div>

                {/* Resumen */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-5 w-5 text-blue-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Compras</p>
                                    <p className="text-xl font-bold">{formatCurrency(resumen.total_compras)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5 text-green-500" />
                                <div>
                                    <p className="text-sm text-gray-600">Total Pagado</p>
                                    <p className="text-xl font-bold text-green-600">{formatCurrency(resumen.total_pagado)}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardContent className="p-4">
                            <div className="flex items-center gap-2">
                                <AlertCircle className={`h-5 w-5 ${resumen.saldo_pendiente > 0 ? 'text-red-500' : 'text-green-500'}`} />
                                <div>
                                    <p className="text-sm text-gray-600">Saldo Pendiente</p>
                                    <p className={`text-xl font-bold ${resumen.saldo_pendiente > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {formatCurrency(resumen.saldo_pendiente)}
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Historial de Facturas */}
                <Card>
                    <CardHeader>
                        <CardTitle>Historial de Compras</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {facturas.map((factura) => {
                                const totalPagado = factura.pagos.reduce((sum, pago) => sum + pago.monto, 0);
                                const saldoPendiente = factura.total - totalPagado;
                                
                                return (
                                    <div key={factura.id} className="border rounded-lg p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <h3 className="font-semibold">Factura #{factura.numfactura}</h3>
                                                <p className="text-sm text-gray-600">{formatDate(factura.fecha)}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">{formatCurrency(factura.total)}</p>
                                                <Badge variant={saldoPendiente > 0 ? "destructive" : "default"}>
                                                    {saldoPendiente > 0 ? 'Pendiente' : 'Pagada'}
                                                </Badge>
                                            </div>
                                        </div>
                                        
                                        {factura.pagos.length > 0 && (
                                            <div className="mt-3 pt-3 border-t">
                                                <p className="text-sm font-medium mb-2">Pagos:</p>
                                                <div className="space-y-1">
                                                    {factura.pagos.map((pago) => (
                                                        <div key={pago.id} className="flex justify-between text-sm">
                                                            <span>{formatDate(pago.fecha_pago)} - {pago.metodo_pago}</span>
                                                            <span className="text-green-600">{formatCurrency(pago.monto)}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                {saldoPendiente > 0 && (
                                                    <div className="flex justify-between text-sm font-medium mt-2 pt-2 border-t">
                                                        <span>Saldo Pendiente:</span>
                                                        <span className="text-red-600">{formatCurrency(saldoPendiente)}</span>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                        
                        {facturas.length === 0 && (
                            <div className="text-center py-8 text-gray-500">
                                No hay compras registradas para este cliente.
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}