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
  creatorEmail: string;
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
  const [enrolledCoursesForLoggedInUser, setEnrolledCoursesForLoggedInUser] =
    useState<number[]>([]);

  useEffect(() => {
    const userString = localStorage.getItem("UserLoggedIn");
    if (userString) {
      const { designation, email } = JSON.parse(userString);
      setUserDesignation(designation);

      fetch("http://localhost:3000/courses")
        .then((response) => response.json())
        .then((data: Course[]) => {
          let filteredCourses = data;

          if (designation !== "Student") {
            filteredCourses = data.filter(
              (course) => course.creatorEmail === email
            );
          }

          setCourses(filteredCourses);
        })
        .catch((error) => {
          console.error("Error fetching courses:", error);
          alert("Error fetching courses!");
        });

      const enrolledCourses = JSON.parse(
        localStorage.getItem("enrolledCourses") || "{}"
      );
      setEnrolledCoursesForLoggedInUser(enrolledCourses[email] || []);
    }
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


  
  const handleCourseFormSubmit = async (newCourse: Course) => {
    if (selectedCourse) {
      const updatedCourses = courses.map((course) =>
        course.id === selectedCourse.id
          ? { ...newCourse, id: selectedCourse.id }
          : course
      );
      setCourses(updatedCourses);
    }
    handleCloseCourseForm();
    alert("Course Created successfully!");
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

  const handleEnroll = (courseId: number) => {
    const userString = localStorage.getItem("UserLoggedIn");
    if (userString) {
      const { email } = JSON.parse(userString);

      const enrolledCourses = JSON.parse(
        localStorage.getItem("enrolledCourses") || "{}"
      );

      enrolledCourses[email] = [...(enrolledCourses[email] || []), courseId];

      localStorage.setItem("enrolledCourses", JSON.stringify(enrolledCourses));

      setEnrolledCoursesForLoggedInUser(enrolledCourses[email] || []);
    }
  };

  return (
    <Sidebar>
      <div>
        <h2>Courses</h2>

        {userDesignation === "Trainer" && (
          <button onClick={handleCreateCourse}>  
 Create Course          </button>
        )}

        <div className="courses-container">
          {courses.map((course)=> (
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

                {userDesignation === "Student" &&
                  (enrolledCoursesForLoggedInUser.includes(course.id) ? (
                    <Link to={`/${course.id}/add`}>
                      <button>View</button>
                    </Link>
                  ) : (
                    <button
                      onClick={() => {
                        handleEnroll(course.id);
                        alert("You Enrolled Successfully For the Course");
                      }}
                    >
                      Enroll
                    </button>
                  ))}
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
