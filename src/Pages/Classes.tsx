import React, { useState } from 'react';

const Course = () => {
  const [studentEmail, setStudentEmail] = useState('');

  const handleEnroll = () => {
    const email = prompt('Enter your email to enroll:');
    if (email) {
      setStudentEmail(email);
      // Save to localStorage if needed
    }
  };

  return (
    <div className="course-card">
      <h2>Course Title</h2>
      <p>{studentEmail ? `Enrolled as: ${studentEmail}` : 'Not enrolled yet'}</p>
      <button onClick={handleEnroll}>Enroll</button>
    </div>
  );
};

export default Course;
