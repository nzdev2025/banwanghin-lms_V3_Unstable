// src/components/analytics/SavingsActivityChart.jsx
import React from 'react';
import { collectionGroup, getDocs } from 'firebase/firestore';
import { db, appId } from '../../firebase/firebase';
import { grades } from '../../constants/data';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';
import Icon from '../../icons/Icon';

const SavingsActivityChart = () => {
    const [chartData, setChartData] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchSavingsData = async () => {
            if (!db) {
                setIsLoading(false);
                return;
            }
            setIsLoading(true);

            try {
                const gradeDataPromises = grades.map(async (grade) => {
                    const transactionsQuery = collectionGroup(db, 'transactions');
                    const querySnapshot = await getDocs(transactionsQuery);

                    let totalDeposits = 0;
                    let totalWithdrawals = 0;

                    querySnapshot.forEach(doc => {
                        // Check if the transaction belongs to the current grade
                        if (doc.ref.path.startsWith(`artifacts/${appId}/public/data/savings/${grade}`)) {
                            const transaction = doc.data();
                            if (transaction.type === 'deposit') {
                                totalDeposits += transaction.amount;
                            } else if (transaction.type === 'withdraw') {
                                totalWithdrawals += transaction.amount;
                            }
                        }
                    });
                    
                    return {
                        name: `ป.${grade.replace('p', '')}`,
                        ฝาก: totalDeposits,
                        ถอน: totalWithdrawals,
                    };
                });

                const data = await Promise.all(gradeDataPromises);
                setChartData(data);
            } catch (error) {
                console.error("Error fetching savings data: ", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSavingsData();
    }, []);

    const CustomTooltip = ({ active, payload, label }) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-gray-900/80 backdrop-blur-sm border border-white/20 p-3 rounded-lg shadow-lg">
                    <p className="font-bold text-white">{label}</p>
                    <p className="text-emerald-300">{`ยอดฝาก: ${payload[0].value.toLocaleString()} บาท`}</p>
                    <p className="text-rose-400">{`ยอดถอน: ${payload[1].value.toLocaleString()} บาท`}</p>
                </div>
            );
        }
        return null;
    };

    return (
        <div className="p-6 rounded-2xl backdrop-blur-lg bg-gray-800/30 border border-gray-700/50 h-[400px]">
            <h3 className="text-lg font-bold text-white mb-4">ภาพรวมกิจกรรมการออม (ฝาก-ถอน)</h3>
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Icon name="Loader2" className="animate-spin text-emerald-400" size={40} />
                </div>
            ) : (
                <ResponsiveContainer width="100%" height="90%">
                    <BarChart data={chartData} margin={{ top: 5, right: 20, left: -10, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.1)" />
                        <XAxis dataKey="name" tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#9ca3af', fontSize: 12 }} />
                        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(148, 163, 184, 0.1)' }} />
                        <Legend wrapperStyle={{ fontSize: '14px' }} />
                        <Bar dataKey="ฝาก" fill="#34d399" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="ถอน" fill="#f43f5e" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            )}
        </div>
    );
};

export default SavingsActivityChart;