import { Head } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface Activity {
    id: number;
    log_name: string;
    description: string;
    subject_type: string;
    subject_id: number;
    causer_type: string;
    causer_id: number;
    properties: any;
    created_at: string;
    causer?: {
        name: string;
    };
    subject?: {
        id: number;
    };
}

interface Props {
    activities: {
        data: Activity[];
        links: any[];
        current_page: number;
        last_page: number;
    };
}

export default function Index({ activities }: Props) {
    const getSubjectName = (activity: Activity) => {
        const type = activity.subject_type?.split('\\').pop();
        return `${type} #${activity.subject_id}`;
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('es-ES');
    };

    return (
        <AppLayout>
            <Head title="Registro de Actividad" />
            
            <div className="p-6">
                <h1 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-6">
                    Registro de Actividad
                </h1>

                <Card>
                    <CardHeader>
                        <CardTitle>Movimientos del Sistema</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {activities.data.map((activity) => (
                                <div key={activity.id} className="border-b pb-4 last:border-b-0">
                                    <div className="flex justify-between items-start">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">
                                                    {activity.causer?.name || 'Sistema'}
                                                </span>
                                                <span className="text-gray-500">•</span>
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    {activity.description}
                                                </span>
                                            </div>
                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                {getSubjectName(activity)}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500 dark:text-gray-400">
                                            {formatDate(activity.created_at)}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}