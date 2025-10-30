import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Dashboard',
        href: '/dashboard',
    },
];

interface DashboardProps {
    totalVentas: number;
    clientesNuevos: number;
    ventasDelMes: number;
    saldoImpagas: number;
    productosVendidos: Array<{
        articulo: string;
        total_vendido: number;
    }>;
    ventasPorDia: Array<{
        dia: string;
        total_dia: number;
    }>;
    ventasPorVendedor: Array<{
        name: string;
        total_ventas: number;
        monto_total: string;
    }>;
    fechaInicio: string;
    fechaFin: string;
}

const Dashboard: React.FC<DashboardProps> = ({ totalVentas, clientesNuevos, ventasDelMes, saldoImpagas, productosVendidos, ventasPorDia, ventasPorVendedor, fechaInicio, fechaFin }) => {
    const [startDate, setStartDate] = useState(fechaInicio);
    const [endDate, setEndDate] = useState(fechaFin);

    const handleFilter = () => {
        router.get('/dashboard', {
            fecha_inicio: startDate,
            fecha_fin: endDate
        });
    };

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex h-full flex-1 flex-col gap-4 rounded-xl p-4">
                <Card>
                    <CardHeader>
                        <CardTitle>Filtro por Fechas</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex flex-col sm:flex-row gap-4 sm:items-end">
                            <div className="flex-1">
                                <Label htmlFor="fecha_inicio">Fecha Inicio</Label>
                                <Input
                                    id="fecha_inicio"
                                    type="date"
                                    value={startDate}
                                    onChange={(e) => setStartDate(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <Label htmlFor="fecha_fin">Fecha Fin</Label>
                                <Input
                                    id="fecha_fin"
                                    type="date"
                                    value={endDate}
                                    onChange={(e) => setEndDate(e.target.value)}
                                />
                            </div>
                            <Button onClick={handleFilter} className="w-full sm:w-auto">
                                Aplicar Filtro
                            </Button>
                        </div>
                    </CardContent>
                </Card>
                <div className="grid gap-4 md:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Total Ventas Acumulado</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${totalVentas.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                    
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Clientes Nuevos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{clientesNuevos}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Ventas del Mes</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">${ventasDelMes.toLocaleString()}</div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-sm font-medium">Saldo Impagas</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold text-red-600">${saldoImpagas.toLocaleString()}</div>
                        </CardContent>
                    </Card>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader>
                            <CardTitle>Productos Más Vendidos</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-2">
                                {productosVendidos.map((producto, index) => (
                                    <div key={index} className="flex justify-between items-center">
                                        <span className="text-sm">{producto.articulo}</span>
                                        <span className="font-medium">{producto.total_vendido}</span>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ventas por Vendedor</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {ventasPorVendedor.map((vendedor, index) => (
                                    <div key={index} className="flex justify-between items-center py-2 border-b">
                                        <div>
                                            <span className="font-medium">{vendedor.name}</span>
                                            <span className="text-sm text-gray-500 ml-2">{vendedor.total_ventas} ventas</span>
                                        </div>
                                        <div className="font-medium">${parseFloat(vendedor.monto_total).toLocaleString()}</div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Ventas por Día</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="h-64">
                                {ventasPorDia.length > 0 ? (
                                    <Line
                                        data={{
                                            labels: ventasPorDia.map(venta => {
                                                const fecha = venta.dia.split('-');
                                                return `${fecha[2]}/${fecha[1]}`;
                                            }),
                                            datasets: [
                                                {
                                                    label: 'Ventas',
                                                    data: ventasPorDia.map(venta => venta.total_dia),
                                                    borderColor: 'rgb(75, 192, 192)',
                                                    backgroundColor: 'rgba(75, 192, 192, 0.2)',
                                                    tension: 0.1
                                                }
                                            ]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    display: false
                                                }
                                            },
                                            scales: {
                                                y: {
                                                    beginAtZero: true,
                                                    ticks: {
                                                        callback: function(value) {
                                                            return '$' + Number(value).toLocaleString();
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No hay ventas en el período seleccionado
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
};

export default Dashboard;