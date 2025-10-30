import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Save, X, Plus, Trash2 } from 'lucide-react';
import { useState } from 'react';

interface Factura {
    id: number;
    numfactura: number;
    cliente: {
        razonsocial: string;
    };
    articulos: Array<{
        id: number;
        articulo: string;
        codarticulo: string;
        pivot: {
            cantidad: number;
        };
    }>;
    entregas: Array<{
        id: number;
        articulo_id: number;
        cantidad: number;
        fecha_entrega: string;
    }>;
}

interface Props {
    factura: Factura;
}

interface EntregaItem {
    articulo_id: string;
    cantidad: number;
}

export default function Create({ factura }: Props) {
    const [entregas, setEntregas] = useState<EntregaItem[]>([
        { articulo_id: '', cantidad: 1 }
    ]);

    const { data, setData, post, processing, errors } = useForm({
        entregas: entregas,
        fecha_entrega: new Date().toISOString().split('T')[0],
        observaciones: '',
    });

    const getCantidadEntregada = (articuloId: number) => {
        return factura.entregas
            .filter(e => e.articulo_id === articuloId)
            .reduce((sum, e) => sum + e.cantidad, 0);
    };

    const getCantidadPendiente = (articuloId: number) => {
        const articuloVenta = factura.articulos.find(a => a.id === articuloId);
        const cantidadVendida = articuloVenta?.pivot.cantidad || 0;
        const cantidadEntregada = getCantidadEntregada(articuloId);
        return cantidadVendida - cantidadEntregada;
    };

    const addEntrega = () => {
        const nuevasEntregas = [...entregas, { articulo_id: '', cantidad: 1 }];
        setEntregas(nuevasEntregas);
        setData('entregas', nuevasEntregas);
    };

    const removeEntrega = (index: number) => {
        const nuevasEntregas = entregas.filter((_, i) => i !== index);
        setEntregas(nuevasEntregas);
        setData('entregas', nuevasEntregas);
    };

    const updateEntrega = (index: number, field: keyof EntregaItem, value: any) => {
        const nuevasEntregas = [...entregas];
        nuevasEntregas[index] = { ...nuevasEntregas[index], [field]: value };
        setEntregas(nuevasEntregas);
        setData('entregas', nuevasEntregas);
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('entregas.store', factura.id));
    };

    return (
        <AppLayout>
            <Head title="Registrar Entrega" />
            
            <div className="p-6">
                <div className="mb-6">
                    <h1 className="text-2xl font-semibold text-gray-900">Registrar Entrega</h1>
                    <p className="text-gray-600">Factura #{factura.numfactura} - {factura.cliente.razonsocial}</p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {/* Artículos de la Venta */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Artículos de la Venta</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {factura.articulos.map((articulo) => {
                                    const cantidadPendiente = getCantidadPendiente(articulo.id);
                                    return (
                                        <div key={articulo.id} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                                            <div>
                                                <p className="font-medium">{articulo.codarticulo} - {articulo.articulo}</p>
                                                <p className="text-sm text-gray-600">
                                                    Vendido: {articulo.pivot.cantidad} | 
                                                    Entregado: {getCantidadEntregada(articulo.id)} | 
                                                    Pendiente: {cantidadPendiente}
                                                </p>
                                            </div>
                                            <span className={`px-2 py-1 rounded text-xs ${
                                                cantidadPendiente === 0 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {cantidadPendiente === 0 ? 'Completo' : 'Pendiente'}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Formulario de Entrega */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Información de Entrega</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <Label htmlFor="fecha_entrega">Fecha de Entrega *</Label>
                                <Input
                                    id="fecha_entrega"
                                    type="date"
                                    value={data.fecha_entrega}
                                    onChange={(e) => setData('fecha_entrega', e.target.value)}
                                />
                                {errors.fecha_entrega && <p className="text-sm text-red-600 mt-1">{errors.fecha_entrega}</p>}
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
                        </CardContent>
                    </Card>
                </div>

                {/* Artículos a Entregar */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <CardTitle>Artículos a Entregar</CardTitle>
                            <Button type="button" onClick={addEntrega} variant="outline">
                                <Plus className="w-4 h-4 mr-2" />
                                Agregar Artículo
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-4">
                            {entregas.map((entrega, index) => (
                                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                                    <div>
                                        <Label>Artículo</Label>
                                        <select
                                            value={entrega.articulo_id}
                                            onChange={(e) => updateEntrega(index, 'articulo_id', e.target.value)}
                                            className="w-full p-2 border rounded"
                                        >
                                            <option value="">Seleccionar artículo</option>
                                            {factura.articulos
                                                .filter(a => getCantidadPendiente(a.id) > 0)
                                                .map((articulo) => (
                                                    <option key={articulo.id} value={articulo.id.toString()}>
                                                        {articulo.codarticulo} - {articulo.articulo} (Pendiente: {getCantidadPendiente(articulo.id)})
                                                    </option>
                                                ))
                                            }
                                        </select>
                                    </div>
                                    <div>
                                        <Label>Cantidad</Label>
                                        <Input
                                            type="number"
                                            min="1"
                                            max={entrega.articulo_id ? getCantidadPendiente(Number(entrega.articulo_id)) : 1}
                                            value={entrega.cantidad}
                                            onChange={(e) => updateEntrega(index, 'cantidad', parseInt(e.target.value) || 1)}
                                        />
                                    </div>
                                    <div className="flex items-end">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            onClick={() => removeEntrega(index)}
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}

                            <div className="flex gap-3 pt-4">
                                <Button type="submit" disabled={processing}>
                                    <Save className="w-4 h-4 mr-2" />
                                    {processing ? 'Registrando...' : 'Registrar Entrega'}
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
        </AppLayout>
    );
}