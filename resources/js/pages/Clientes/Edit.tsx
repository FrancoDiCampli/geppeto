import { Head, useForm } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useState, useEffect } from 'react';

interface Cliente {
    id: number;
    razonsocial: string;
    documentounico: string;
    direccion: string;
    telefono: string;
    email: string;
    codigopostal: string;
    localidad: string;
    provincia: string;
    condicioniva: string;
}

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
    cliente: Cliente;
    provincias: Provincia[];
    localidades: Localidad[];
}

export default function Edit({ cliente, provincias, localidades }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        razonsocial: cliente.razonsocial,
        documentounico: cliente.documentounico?.toString() || '',
        direccion: cliente.direccion,
        telefono: cliente.telefono,
        email: cliente.email,
        codigopostal: cliente.codigopostal?.toString() || '',
        localidad: cliente.localidad,
        provincia: cliente.provincia,
        condicioniva: cliente.condicioniva || ''
    });

    const [selectedProvinciaId, setSelectedProvinciaId] = useState<string>(() => {
        const provincia = provincias.find(p => p.nombre === cliente.provincia);
        return provincia ? provincia.id.toString() : '';
    });
    
    const [selectedLocalidad, setSelectedLocalidad] = useState<string>(cliente.localidad);
    
    const [filteredLocalidades, setFilteredLocalidades] = useState<Localidad[]>(() => {
        const provincia = provincias.find(p => p.nombre === cliente.provincia);
        if (provincia) {
            return localidades.filter(loc => loc.provincia_id === provincia.id);
        }
        return [];
    });

    useEffect(() => {
        if (selectedProvinciaId) {
            const filtered = localidades.filter(loc => loc.provincia_id.toString() === selectedProvinciaId);
            setFilteredLocalidades(filtered);
            
            // Si la localidad actual no está en las opciones filtradas, limpiarla
            if (selectedLocalidad && !filtered.find(l => l.nombre === selectedLocalidad)) {
                setSelectedLocalidad('');
                setData('localidad', '');
            }
        } else {
            setFilteredLocalidades([]);
            setSelectedLocalidad('');
            setData('localidad', '');
        }
    }, [selectedProvinciaId, localidades]);

    const handleProvinciaChange = (value: string) => {
        setSelectedProvinciaId(value);
        const provincia = provincias.find(p => p.id.toString() === value);
        setData('provincia', provincia?.nombre || '');
        setData('localidad', '');
    };



    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        put(route('clientes.update', cliente.id));
    };

    return (
        <AppLayout>
            <Head title="Editar Cliente" />
            
            <Card className="max-w-2xl">
                <CardHeader>
                    <CardTitle>Editar Cliente</CardTitle>
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
                                <Input
                                    id="documentounico"
                                    value={data.documentounico}
                                    onChange={(e) => setData('documentounico', e.target.value)}
                                    error={errors.documentounico}
                                />
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
                                <Select value={selectedLocalidad} onValueChange={(value) => {
                                    setSelectedLocalidad(value);
                                    setData('localidad', value);
                                }} disabled={!selectedProvinciaId}>
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
                                {processing ? 'Actualizando...' : 'Actualizar Cliente'}
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