import { Head, useForm, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface Provincia {
    id: number;
    nombre: string;
}

interface Localidad {
    id: number;
    nombre: string;
    provincia_id: number;
}

interface Props {
    provincias: Provincia[];
    localidades: Localidad[];
}

export default function Create({ provincias, localidades }: Props) {
    const { data, setData, post, processing, errors } = useForm({
        razonsocial: '',
        documentounico: '',
        direccion: '',
        telefono: '',
        email: '',
        codigopostal: '',
        localidad: '',
        provincia: '',
        condicioniva: ''
    });

    const [selectedProvinciaId, setSelectedProvinciaId] = useState<string>('');
    const [filteredLocalidades, setFilteredLocalidades] = useState<Localidad[]>([]);

    useEffect(() => {
        if (selectedProvinciaId) {
            const filtered = localidades.filter(loc => loc.provincia_id.toString() === selectedProvinciaId);
            setFilteredLocalidades(filtered);
        } else {
            setFilteredLocalidades([]);
        }
        setData('localidad', '');
    }, [selectedProvinciaId]);

    const handleProvinciaChange = (value: string) => {
        setSelectedProvinciaId(value);
        const provincia = provincias.find(p => p.id.toString() === value);
        setData('provincia', provincia?.nombre || '');
    };



    const consultarAfip = async () => {
        if (!data.documentounico) return;
        
        console.log('Consultando AFIP con CUIT:', data.documentounico);
        
        try {
            const response = await fetch(route('afip.consultar-cuit'), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]')?.getAttribute('content') || window.Laravel?.csrfToken || '',
                    'Accept': 'application/json',
                    'X-Requested-With': 'XMLHttpRequest'
                },
                body: JSON.stringify({ cuit: data.documentounico })
            });
            
            const result = await response.json();
            console.log('Resultado AFIP:', result);
            
            if (result.success && result.data) {
                console.log('Actualizando datos con:', result.data);
                
                // Actualizar todos los campos directamente
                setData({
                    ...data,
                    razonsocial: result.data.razonsocial || data.razonsocial,
                    direccion: result.data.direccion || data.direccion,
                    localidad: result.data.localidad || data.localidad,
                    codigopostal: result.data.codigopostal || data.codigopostal,
                    condicioniva: result.data.condicioniva || data.condicioniva,
                    provincia: result.data.provincia || data.provincia
                });
                
                // Buscar provincia por ID de AFIP
                if (result.data.provincia_id_afip !== null) {
                    const provinciaAfip = provincias.find(p => p.id_afip === result.data.provincia_id_afip);
                    if (provinciaAfip) {
                        setSelectedProvinciaId(provinciaAfip.id.toString());
                    }
                }
                
                alert('Datos cargados desde AFIP: ' + result.data.razonsocial);
            } else {
                alert('Error: ' + (result.error || 'No se pudieron obtener datos'));
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error consultando AFIP');
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('clientes.store'));
    };

    return (
        <AppLayout>
            <Head title="Crear Cliente" />
            
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Crear Nuevo Cliente</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <Label htmlFor="razonsocial">Razón Social *</Label>
                                <Input
                                    id="razonsocial"
                                    value={data.razonsocial}
                                    onChange={(e) => setData('razonsocial', e.target.value)}
                                    error={errors.razonsocial}
                                />
                            </div>
                            <div>
                                <Label htmlFor="documentounico">Documento *</Label>
                                <div className="flex gap-2">
                                    <Input
                                        id="documentounico"
                                        value={data.documentounico}
                                        onChange={(e) => setData('documentounico', e.target.value)}
                                        error={errors.documentounico}
                                    />
                                    <Button 
                                        type="button" 
                                        variant="outline" 
                                        onClick={() => consultarAfip()}
                                        disabled={!data.documentounico || processing}
                                    >
                                        AFIP
                                    </Button>
                                </div>
                            </div>
                            <div>
                                <Label htmlFor="direccion">Dirección *</Label>
                                <Input
                                    id="direccion"
                                    value={data.direccion}
                                    onChange={(e) => setData('direccion', e.target.value)}
                                    error={errors.direccion}
                                />
                            </div>
                            <div>
                                <Label htmlFor="telefono">Teléfono *</Label>
                                <Input
                                    id="telefono"
                                    value={data.telefono}
                                    onChange={(e) => setData('telefono', e.target.value)}
                                    error={errors.telefono}
                                />
                            </div>
                            <div>
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={data.email}
                                    onChange={(e) => setData('email', e.target.value)}
                                    error={errors.email}
                                />
                            </div>
                            <div>
                                <Label htmlFor="codigopostal">Código Postal</Label>
                                <Input
                                    id="codigopostal"
                                    value={data.codigopostal}
                                    onChange={(e) => setData('codigopostal', e.target.value)}
                                />
                            </div>
                            <div>
                                <Label htmlFor="provincia">Provincia *</Label>
                                <Select value={selectedProvinciaId} onValueChange={handleProvinciaChange}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar provincia" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {provincias.map((provincia) => (
                                            <SelectItem key={provincia.id} value={provincia.id.toString()}>
                                                {provincia.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div>
                                <Label htmlFor="localidad">Localidad *</Label>
                                <Select value={data.localidad} onValueChange={(value) => setData('localidad', value)} disabled={!selectedProvinciaId}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar localidad" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {filteredLocalidades.map((localidad) => (
                                            <SelectItem key={localidad.id} value={localidad.nombre}>
                                                {localidad.nombre}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="md:col-span-2">
                                <Label htmlFor="condicioniva">Condición IVA</Label>
                                <Select value={data.condicioniva} onValueChange={(value) => setData('condicioniva', value)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar condición IVA" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Responsable Inscripto">Responsable Inscripto</SelectItem>
                                        <SelectItem value="Monotributo">Monotributo</SelectItem>
                                        <SelectItem value="Exento">Exento</SelectItem>
                                        <SelectItem value="Consumidor Final">Consumidor Final</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex gap-2">
                            <Button type="submit" disabled={processing}>
                                Crear
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