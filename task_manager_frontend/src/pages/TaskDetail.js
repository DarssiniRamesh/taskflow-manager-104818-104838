import React from 'react';
import DashboardLayout from '../components/DashboardLayout';

// PUBLIC_INTERFACE
/**
 * TaskDetail page displays details for a single task.
 */
function TaskDetail() {
  // TODO: fetch task info based on ID param
  return (
    <DashboardLayout title="Task Detail">
      <div>
        <h2>Task Detail</h2>
        <p>Details for this task will load here.</p>
      </div>
    </DashboardLayout>
  );
}

export default TaskDetail;
