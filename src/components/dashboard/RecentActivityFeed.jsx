import React from 'react';
import { collection, onSnapshot, query, orderBy, limit } from 'firebase/firestore';
import { db, appId } from '../../firebase/firebase';
import Icon from '../../icons/Icon';

const RecentActivityFeed = () => {
    const [activities, setActivities] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(true);

    React.useEffect(() => {
        if (!db) return;
        const logPath = `artifacts/${appId}/public/data/activity_log`;
        const q = query(collection(db, logPath), orderBy("timestamp", "desc"), limit(10));

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const activitiesData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setActivities(activitiesData);
            setIsLoading(false);
        }, (error) => {
            console.error("Error fetching activity log:", error);
            setIsLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const timeSince = (date) => {
        if (!date || !date.toDate) return '';
        const seconds = Math.floor((new Date() - date.toDate()) / 1000);
        let interval = seconds / 31536000;
        if (interval > 1) return `${Math.floor(interval)} ปีที่แล้ว`;
        interval = seconds / 2592000;
        if (interval > 1) return `${Math.floor(interval)} เดือนที่แล้ว`;
        interval = seconds / 86400;
        if (interval > 1) return `${Math.floor(interval)} วันที่แล้ว`;
        interval = seconds / 3600;
        if (interval > 1) return `${Math.floor(interval)} ชั่วโมงที่แล้ว`;
        interval = seconds / 60;
        if (interval > 1) return `${Math.floor(interval)} นาทีที่แล้ว`;
        return "เมื่อสักครู่";
    };

    const iconMap = {
        SUBJECT: 'BookOpen',
        STUDENT: 'User',
        ASSIGNMENT: 'FilePlus',
        SCORE: 'Save',
        DEFAULT: 'History'
    };

    return (
        <div className="p-6 rounded-2xl backdrop-blur-lg bg-gray-800/30 border border-gray-700/50 h-full">
            <h3 className="text-lg font-bold text-white mb-4">รายการเคลื่อนไหวล่าสุด</h3>
            {isLoading ? (
                <div className="flex items-center justify-center h-full">
                    <Icon name="Loader2" className="animate-spin text-gray-400" size={32} />
                </div>
            ) : activities.length === 0 ? (
                 <div className="text-center py-10 h-full flex flex-col justify-center items-center">
                    <Icon name="History" className="mx-auto text-gray-500" size={40}/>
                    <p className="mt-2 text-sm text-gray-500">ยังไม่มีรายการเคลื่อนไหว</p>
                </div>
            ) : (
                <ul className="space-y-4">
                    {activities.map(activity => {
                        const activityType = activity.type.split('_')[0];
                        const iconName = iconMap[activityType] || iconMap.DEFAULT;
                        return (
                            <li key={activity.id} className="flex items-start gap-3">
                                <div className="bg-gray-700/50 p-2 rounded-full mt-1">
                                    <Icon name={iconName} size={16} className="text-gray-300" />
                                </div>
                                <div>
                                    <p className="text-sm text-white leading-tight" dangerouslySetInnerHTML={{ __html: activity.message }}></p>
                                    <p className="text-xs text-gray-400 mt-0.5">{timeSince(activity.timestamp)}</p>
                                </div>
                            </li>
                        );
                    })}
                </ul>
            )}
        </div>
    );
};

export default RecentActivityFeed;
