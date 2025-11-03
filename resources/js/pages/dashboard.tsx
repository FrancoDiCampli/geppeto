import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import AppLayout from '@/layouts/app-layout';
import { type BreadcrumbItem } from '@/types';
import { Head, router } from '@inertiajs/react';
import React, { useState } from 'react';
import { Line, Pie } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
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
                            <div className="h-64">
                                {ventasPorVendedor.length > 0 ? (
                                    <Pie
                                        data={{
                                            labels: ventasPorVendedor.map(vendedor => vendedor.name),
                                            datasets: [
                                                {
                                                    label: 'Monto de Ventas',
                                                    data: ventasPorVendedor.map(vendedor => parseFloat(vendedor.monto_total)),
                                                    backgroundColor: [
                                                        'rgba(0, 0, 0, 0.9)',
                                                        'rgba(64, 64, 64, 0.8)',
                                                        'rgba(96, 96, 96, 0.8)',
                                                        'rgba(128, 128, 128, 0.8)',
                                                        'rgba(160, 160, 160, 0.8)',
                                                        'rgba(192, 192, 192, 0.8)',
                                                        'rgba(224, 224, 224, 0.8)',
                                                        'rgba(240, 240, 240, 0.8)',
                                                    ],
                                                    borderColor: [
                                                        'rgba(0, 0, 0, 1)',
                                                        'rgba(64, 64, 64, 1)',
                                                        'rgba(96, 96, 96, 1)',
                                                        'rgba(128, 128, 128, 1)',
                                                        'rgba(160, 160, 160, 1)',
                                                        'rgba(192, 192, 192, 1)',
                                                        'rgba(224, 224, 224, 1)',
                                                        'rgba(240, 240, 240, 1)',
                                                    ],
                                                    borderWidth: 2,
                                                }
                                            ]
                                        }}
                                        options={{
                                            responsive: true,
                                            maintainAspectRatio: false,
                                            plugins: {
                                                legend: {
                                                    position: 'bottom' as const,
                                                    labels: {
                                                        padding: 20,
                                                        usePointStyle: true,
                                                    }
                                                },
                                                tooltip: {
                                                    callbacks: {
                                                        label: function(context) {
                                                            const vendedor = ventasPorVendedor[context.dataIndex];
                                                            return `${context.label}: $${Number(context.parsed).toLocaleString()} (${vendedor.total_ventas} ventas)`;
                                                        }
                                                    }
                                                }
                                            }
                                        }}
                                    />
                                ) : (
                                    <div className="flex items-center justify-center h-full text-gray-500">
                                        No hay datos de vendedores en el período seleccionado
                                    </div>
                                )}
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