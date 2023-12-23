import React, { useEffect, useState } from "react";
import CourseForm from "../../Pages/Course/courseForm";
import "./Course.css";
import { Link } from "react-router-dom";
import Sidebar from "../../Components/Sidebar";
 
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

  // const handleAddVideo = (video: VideoData) => {
  //   setCurrentFormData((prevData) => ({
  //     ...prevData,
  //     videos: [...prevData.videos, video],
  //   }));
  // };

  // const handleOpenCourseForm = () => {
  //   setShowCourseForm(true);
  //   setSelectedCourse(null);
  // };

  const handleCloseCourseForm = () => {
    setShowCourseForm(false);
  };


  const handleCreateCourse = () => {
    const newCourse: Course = {
      id: courses.length + 1,
      title: 'New Course',
      overview: 'Course Overview',
      creatorName: 'Creator Name', // Placeholder
      duration: '2 weeks',
      image: '', // Placeholder
      videos: [],
    };

    setCourses([...courses, newCourse]);
    setShowCourseForm(true); // Automatically open the form after creating a new course
  };






  const handleCourseFormSubmit = (newCourse: Course) => {
    if (selectedCourse) {
      const updatedCourses = courses.map((course) =>
        course.id === selectedCourse.id
          ? { ...newCourse, id: course.id }
          : course
      );
      setCourses(updatedCourses);
    } else {
      setCourses([...courses, { ...newCourse, id: courses.length + 1 }]);
    }
    // setCoursesUpdated(true);
    handleCloseCourseForm();
    alert("Course saved successfully!");
  };

  const handleEdit = (course: Course) => {
    setShowCourseForm(true);
    setSelectedCourse(course);
  };

  const handleDelete = (course: Course) => {
    const updatedCourses = courses.filter((c) => c.id !== course.id);
    setCourses(updatedCourses);
    alert("Course deleted successfully!");
  };




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
                    <button>Add</button>
                  </Link>
                )}

                {userDesignation === "Student" && <button>Enroll</button>}
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
              <CourseForm onSubmit={handleCourseFormSubmit} />
            </div>
          </div>
        )}
      </div>
    </Sidebar>
  );
};

export default Courses;
