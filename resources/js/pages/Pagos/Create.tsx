import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

import { Save, X } from 'lucide-react';

interface Factura {
    id: number;
    numfactura: number;
    total: number;
    total_pagado: number;
    saldo_pendiente: number;
    cliente: {
        razonsocial: string;
    };
    pagos: Array<{
        id: number;
        monto: number;
        metodo_pago: string;
        fecha_pago: string;
    }>;
}

interface Props {
    factura: Factura;
}

export default function Create({ factura }: Props) {
    const totalPagado = factura.pagos?.reduce((sum, pago) => sum + Number(pago.monto), 0) || 0;
    const saldoPendiente = Number(factura.total) - totalPagado;

    const { data, setData, post, processing, errors } = useForm({
        monto: saldoPendiente.toString(),
        metodo_pago: '',
        fecha_pago: new Date().toISOString().split('T')[0],
        observaciones: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('pagos.store', factura.id));
    };

    return (
        <AppLayout>
            <Head title="Registrar Pago" />
            
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Registrar Pago</h1>
                    <p className="text-gray-600">Factura #{factura.numfactura} - {factura.cliente.razonsocial}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Información de la Factura */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de la Factura</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Total Factura</Label>
                                    <p className="text-lg font-semibold">${Number(factura.total).toFixed(2)}</p>
                                </div>
                                <div>
                                    <Label className="text-sm font-medium text-gray-500">Total Pagado</Label>
                                    <p className="text-lg font-semibold text-green-600">${totalPagado.toFixed(2)}</p>
                                </div>
                            </div>
                            <div>
                                <Label className="text-sm font-medium text-gray-500">Saldo Pendiente</Label>
                                <p className="text-xl font-bold text-red-600">${saldoPendiente.toFixed(2)}</p>
                            </div>
                            
                            {factura.pagos.length > 0 && (
                                <div>
                                    <Label className="text-sm font-medium text-gray-500 mb-2 block">Pagos Anteriores</Label>
                                    <div className="space-y-2">
                                        {factura.pagos.map((pago) => (
                                            <div key={pago.id} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                                                <span className="text-sm">{pago.metodo_pago}</span>
                                                <span className="font-medium">${Number(pago.monto).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Formulario de Pago */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Nuevo Pago</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={submit} className="space-y-4">
                                <div>
                                    <Label htmlFor="monto">Monto *</Label>
                                    <Input
                                        id="monto"
                                        type="text"
                                        value={data.monto}
                                        onChange={(e) => {
                                            const value = e.target.value.replace(/[^0-9.]/g, '');
                                            const parts = value.split('.');
                                            if (parts.length > 2) return;
                                            if (parts[1] && parts[1].length > 2) return;
                                            setData('monto', value);
                                        }}
                                        onBlur={(e) => {
                                            const num = parseFloat(e.target.value) || 0;
                                            setData('monto', num.toFixed(2));
                                        }}
                                        error={errors.monto}
                                        placeholder={`Máximo: $${saldoPendiente.toFixed(2)}`}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="metodo_pago">Método de Pago *</Label>
                                    <Select value={data.metodo_pago} onValueChange={(value) => setData('metodo_pago', value)}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Seleccionar método" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="efectivo">Efectivo</SelectItem>
                                            <SelectItem value="tarjeta_debito">Tarjeta de Débito</SelectItem>
                                            <SelectItem value="tarjeta_credito">Tarjeta de Crédito</SelectItem>
                                            <SelectItem value="transferencia">Transferencia</SelectItem>
                                            <SelectItem value="mercadopago">MercadoPago</SelectItem>
                                            <SelectItem value="cheque">Cheque</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    {errors.metodo_pago && <p className="text-sm text-red-600 mt-1">{errors.metodo_pago}</p>}
                                </div>

                                <div>
                                    <Label htmlFor="fecha_pago">Fecha de Pago *</Label>
                                    <Input
                                        id="fecha_pago"
                                        type="date"
                                        value={data.fecha_pago}
                                        onChange={(e) => setData('fecha_pago', e.target.value)}
                                        error={errors.fecha_pago}
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="observaciones">Observaciones</Label>
                                    <Input
                                        id="observaciones"
                                        value={data.observaciones}
                                        onChange={(e) => setData('observaciones', e.target.value)}
                                        placeholder="Observaciones adicionales..."
                                    />
                                </div>

                                <div className="flex gap-3 pt-4">
                                    <Button type="submit" disabled={processing}>
                                        <Save className="w-4 h-4 mr-2" />
                                        {processing ? 'Registrando...' : 'Registrar Pago'}
                                    </Button>
                                    <Button type="button" variant="outline" onClick={() => window.history.back()}>
                                        <X className="w-4 h-4 mr-2" />
                                        Cancelar
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}