// src/components/dashboard/DashboardWidgets.jsx
import React from 'react';

// --- Widget Components ---
import AtRiskStudents from './AtRiskStudents';
import TopStudentsLeaderboard from './TopStudentsLeaderboard';
import RecentActivityFeed from './RecentActivityFeed';

const DashboardWidgets = ({ subjects, onStudentClick }) => {
    return (
        <div className="lg:col-span-1 flex flex-col gap-6">
            <AtRiskStudents subjects={subjects} onStudentClick={onStudentClick} />
            <TopStudentsLeaderboard subjects={subjects} onStudentClick={onStudentClick} />
            <RecentActivityFeed />
        </div>
    );
};

export default DashboardWidgets;