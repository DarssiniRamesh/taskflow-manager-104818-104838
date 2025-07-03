import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

// PUBLIC_INTERFACE
/**
 * TaskList page displays the user's tasks.
 */
function TaskList() {
  // TODO: fetch tasks from backend
  return (
    <DashboardLayout title="All Tasks">
      <div>
        <h2>Tasks</h2>
        <p>[Task list will appear here]</p>
        {/* Replace static content with dynamic task loading */}
      </div>
    </DashboardLayout>
  );
}

export default TaskList;
