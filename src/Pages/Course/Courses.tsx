import React, { useEffect, useState } from "react";
import CourseForm from "../../Pages/Course/courseForm";
import "./Course.css";
import { Link } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
import axios from "axios";

interface VideoData {
  vtitle: string;
  description: string;
  video: string;
  document: string;
}
interface Course {
  id: number;
  title: string;
  overview: string;
  creatorName: string;
  duration: string;
  image: string;
  videos: VideoData[];
  classId?: number;
}

interface CoursesProps {}

const Courses: React.FC<CoursesProps> = () => {
  const [showCourseForm, setShowCourseForm] = useState(false);
  const [courses, setCourses] = useState<Array<Course>>([]);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [userDesignation, setUserDesignation] = useState<string | null>(null);
 
 
  useEffect(() => {
    const userString = localStorage.getItem("UserLoggedIn");
    if (userString) {
      const { designation } = JSON.parse(userString);
      setUserDesignation(designation);
    }
fetch("http://localhost:3000/courses")
      .then((response) => response.json())
      .then((data) => setCourses(data));
  }, []);












  

  const handleCreateCourse = () => {
    console.log("Create Course button clicked");
     setShowCourseForm(true);
 
  };



  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setShowCourseForm(true);
  };

  const handleCloseCourseForm = () => {
    console.log("Create Course button clicked");
    setShowCourseForm(false);
  };

  const handleCourseFormSubmit = (newCourse: Course) => {
    if (selectedCourse) {
      const updatedCourses = courses.map((course) =>
        course.id === selectedCourse.id
          ? { ...newCourse, id: selectedCourse.id }
          : course
      );
      setCourses(updatedCourses);
    } else {
      const newId = Date.now();
      setCourses([...courses, { ...newCourse, id: newId }]);
    }
    handleCloseCourseForm();
    alert("Course saved successfully!");
  };

  const handleDelete = async (course: Course) => {
    try {
      await axios.delete(`http://localhost:3000/courses/${course.id}`);

      const updatedCourses = courses.filter((c) => c.id !== course.id);
      setCourses(updatedCourses);

      alert("Course deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
      alert("Error deleting course!");
    }
  };



 


 







































  // const handleEnroll = (courseTitle: string) => {
  //   const email = prompt('Enter your name to enroll:');
  //   if (email) {
  //     const currentEnrolledEmails = JSON.parse(localStorage.getItem('enrolledEmails') || '{}');
  //     const updatedEnrolledEmails = {
  //       ...currentEnrolledEmails,
  //       [courseTitle]: [...(currentEnrolledEmails[courseTitle] || []), email]
  //     };
  //     localStorage.setItem('enrolledEmails', JSON.stringify(updatedEnrolledEmails));
  //   }
  // };




  return (
    <Sidebar>
      <div>
        <h2>Courses</h2>

        {userDesignation === "Trainer" && (
          <button onClick={handleCreateCourse}>Create Course</button>
        )}

        <div>
          {courses.map((course) => (
            <div key={course.id} className="course-card">
              {course.image && (
                <img src={course.image} alt={`Profile for ${course.title}`} />
              )}

              <div className="course-details">
                <h3>{course.title}</h3>
                <p>Summary:{course.overview}</p>
                <p>Faculty: {course.creatorName}</p>
                <p>Duration: {course.duration} weeks</p>

                {userDesignation === "Trainer" && (
                  <>
                    <button onClick={() => handleEdit(course)}>Edit</button>
                    <button onClick={() => handleDelete(course)}>Delete</button>
                  </>
                )}
                {userDesignation === "Trainer" && (
                  <Link to={`/${course.id}/add`}>
                    <button>View</button>
                  </Link>
                )}

                {userDesignation === "Student" && (
                  <Link to={`/${course.id}/add`}>
                    <button>Enroll</button>
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>

        {showCourseForm && (
          <div className="modal">
            <div className="modal-content">
              <span className="close" onClick={handleCloseCourseForm}>
                &times;
              </span>
              <CourseForm
                onSubmit={handleCourseFormSubmit}
                initialData={selectedCourse}
               />
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default Courses;
