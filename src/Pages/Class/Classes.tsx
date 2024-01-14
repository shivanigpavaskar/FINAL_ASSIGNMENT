import React, { useState, useEffect, ChangeEvent, FormEvent, FC } from "react";
import axios from "axios";
import "../Class/classes.css";
import SearchBar from "../../Components/SearchBar";

interface ClassData {
  id: number;
  overview: string;
  document: string;
  quiz: string;
  course: string;
  duration: string;
  title: string;
  trainerEmail: string;
}

interface Courses {
  title: string;
}

const Classes: FC = () => {
  const [formData, setFormData] = useState<ClassData>({
    id: 0,
    overview: "",
    document: "",
    quiz: "",
    course: "",
    duration: "",
    title: "",
    trainerEmail: "",
  });

  const [courses, setCourses] = useState<ClassData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [userDesignation, setUserDesignation] = useState("");
  const [filteredCourses, setFilteredCourses] = useState<ClassData[]>(courses);
  const [enrolledCourses, setEnrolledCourses] = useState<number[]>([]);
  const [userEnrolledTitles, setUserEnrolledTitles] = useState<string[]>([]);
  const [courseTitles, setCourseTitles] = useState([]);

  useEffect(() => {
    const userString = localStorage.getItem("UserLoggedIn");
    if (userString) {
      const { designation, email } = JSON.parse(userString);
      setUserDesignation(designation);
      setFormData((prevState) => ({ ...prevState, trainerEmail: email }));
    }
  }, []);

  useEffect(() => {
    const userString = localStorage.getItem("UserLoggedIn");
    if (userString) {
      const { email, designation } = JSON.parse(userString);
      setUserDesignation(designation);
      const enrolledCoursesForUser =
        JSON.parse(localStorage.getItem("enrolledCourses") || "{}")[email] ||
        [];
      setEnrolledCourses(enrolledCoursesForUser);

      const titles = courses
        .filter((course) => enrolledCoursesForUser.includes(course.id))
        .map((course) => course.title);
      setUserEnrolledTitles(titles);
    }
  }, [courses]);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/class");
      const userString = localStorage.getItem("UserLoggedIn");
      if (userString) {
        const { email,designation } = JSON.parse(userString);
        if (designation === "Student") {
          setCourses(response.data);
          setFilteredCourses(response.data);
        } else {
          const filteredCoursesByTrainer = response.data.filter(
            (course: ClassData) => course.trainerEmail === email
          );
          setCourses(filteredCoursesByTrainer);
          setFilteredCourses(filteredCoursesByTrainer);
        }
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };



  const trainerHasClassForCourse = (courses: ClassData[], courseName: string, trainerEmail: string): boolean => {
    return courses.some(course => course.course === courseName && course.trainerEmail === trainerEmail);
  };
  


  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (editingId !== null) {
      const updatedCourses = courses.map((course) =>
        course.id === editingId ? formData : course
      );
      setCourses(updatedCourses);
      setEditingId(null);
    } else {
      try {
        if (trainerHasClassForCourse(courses, formData.course, formData.trainerEmail)) {
          alert("You already have a class for this course!");
          return;
        }
        const response = await axios.post(
          "http://localhost:3000/class",
          formData
        );
        setCourses([...courses, response.data]);
      } catch (error) {
        console.error("Error posting data:", error);
      }
      fetchCourses();
    }

    setFormData({
      id: 0,
      overview: "",
      document: "",
      quiz: "",
      course: "",
      duration: "",
      title: "",
      trainerEmail: "",
    });
  };

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (e.target.type === "file") {
      const inputElement = e.target as HTMLInputElement;
      const file =
        inputElement.files && inputElement.files.length > 0
          ? inputElement.files[0]
          : null;

      setFormData((prevState) => ({
        ...prevState,
        [name]: file,
      }));
    } else {
      setFormData((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  const CustomFileInput: React.FC<{
    label: string;
    onChange: (baseURL: string) => void;
  }> = ({ label, onChange }) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const baseURL = "../assets/videos/" + file.name;
        console.log("baseURL", baseURL);
        onChange(baseURL);
      }
    };

    return (
      <div>
        <label>{label}</label>
        <input type="file" onChange={handleFileChange} />
      </div>
    );
  };

  const handleFileChange = (type: string, baseURL: string) => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      [type]: baseURL,
    }));
  };

  const handleEdit = (course: ClassData) => {
    setFormData(course);
    setEditingId(course.id);
  };

  const handleDelete = async (id: number) => {
    try {
      await axios.delete(`http://localhost:3000/class/${id}`);
      const filteredCourses = courses.filter((course) => course.id !== id);
      setCourses(filteredCourses);
      alert("Class deleted successfully!");
    } catch (error) {
      console.error("Error deleting course:", error);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("http://localhost:3000/courses");
        const titles = response.data.map((course: Courses) => course.title);
        setCourseTitles(titles);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  const handleSearch = (query: string) => {
    const filtered = courses.filter((course) =>
      course.course.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredCourses(filtered);
  };

  const handleJoin = (course: ClassData) => {
    if (userEnrolledTitles.includes(course.course)) {
      alert("You have joined the class!");
    } else {
      alert("You are not enrolled in the course of the same title!");
    }
  };

  return (
    <div>
      {userDesignation === "Trainer" ? (
        <h1>Create class</h1>
      ) : (
        <h1>Welcome to the class</h1>
      )}

      {userDesignation === "Trainer" && (
        <button onClick={toggleForm} className="create-class-btn">
          {showForm ? "Hide Form" : "Create New Class"}
        </button>
      )}

      {showForm && (
        <form onSubmit={handleSubmit}>
          <label htmlFor="Overview">Overview</label>
          <input
            type="text"
            name="overview"
            placeholder="Overview"
            value={formData.overview}
            onChange={handleChange}
            required
          />
          <br />

          <div>
            <CustomFileInput
              label="Other Documents"
              onChange={(baseURL) => handleFileChange("document", baseURL)}
            />
          </div>

          <div>
            <CustomFileInput
              label="Quiz"
              onChange={(baseURL) => handleFileChange("quiz", baseURL)}
            />
          </div>

          <label htmlFor="duration">Duration</label>
          <input
            type="text"
            name="duration"
            placeholder="Duration"
            value={formData.duration}
            onChange={handleChange}
            required
          />
          <br />

          <label htmlFor="trainerEmail">Enter Your Email</label>
          <input
            type="email"
            name="trainerEmail"
            placeholder="Enter your email"
            value={formData.trainerEmail}
            onChange={handleChange}
            required
          />
          <br />

          <select
            name="course"
            value={formData.course}
            onChange={handleChange}
            required
          >
            <option value="">Select Course</option>
            {courseTitles.map((title, index) => (
              <option key={index} value={title}>
                {title}
              </option>
            ))}
          </select>

          <button
            onClick={() => alert("Class created successfully")}
            className="ad-btn"
            type="submit"
          >
            {editingId !== null ? "Update" : "Create class"}
          </button>
        </form>
      )}

      {userDesignation === "Student" && <SearchBar onSearch={handleSearch} />}
      <div>
        <ul>
          {filteredCourses.map((course) => (
            <div className="course-card" key={course.id}>
              <h2 className="course-title">
                Created Class for Course {course.course}
              </h2>
              <p className="course-info">Overview: {course.overview}</p>
              <p className="course-info">
                Document:
                {(userDesignation === "Student" &&
                  enrolledCourses.includes(course.id)) ||
                userDesignation === "Trainer" ? (
                  <div>
                    <button>
                      <a href={course.document} download={course.document}>
                        Download
                      </a>
                    </button>
                  </div>
                ) : null}
              </p>

              <p className="course-info">
                Quiz:
                {(userDesignation === "Student" &&
                  enrolledCourses.includes(course.id)) ||
                userDesignation === "Trainer" ? (
                  <div>
                    <button>
                      <a href={course.document} download={course.document}>
                        Download
                      </a>
                    </button>
                  </div>
                ) : null}
              </p>
              <p className="course-info">Duration: {course.duration} weeks.</p>

              {userDesignation === "Trainer" && (
                <div className="course-actions">
                  <button
                    className="edit-btn"
                    onClick={() => handleEdit(course)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(course.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
              {userDesignation === "Student" && (
                <div>
                  {enrolledCourses.includes(course.id) ? (
                    <button
                      onClick={() =>
                        alert("You have already joined this class!")
                      }
                    >
                      Joined
                    </button>
                  ) : (
                    <button onClick={() => handleJoin(course)}>
                      Enroll the course first
                    </button>
                  )}
                </div>
              )}
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Classes;
