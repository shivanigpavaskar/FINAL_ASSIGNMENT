import React, { useState, useEffect, ChangeEvent, FormEvent, FC } from "react";
import axios from "axios";
import "./Course/classes.css";

interface ClassData {
  id: number;
  overview: string;
  document: string;
  quiz: string;
  course: string;
  duration: string;
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
  });

  const [courses, setCourses] = useState<ClassData[]>([]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [userDesignation, setUserDesignation] = useState("");

  useEffect(() => {
    const userString = localStorage.getItem("UserLoggedIn");
    if (userString) {
      const { designation } = JSON.parse(userString);
      setUserDesignation(designation);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await axios.get("http://localhost:3000/class");
      setCourses(response.data);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (editingId !== null) {
      // Handle editing
      const updatedCourses = courses.map((course) =>
        course.id === editingId ? formData : course
      );
      setCourses(updatedCourses);
      setEditingId(null);
    } else {
      // Handle adding
      try {
        const response = await axios.post(
          "http://localhost:3000/class",
          formData
        );
        setCourses([...courses, response.data]);
      } catch (error) {
        console.error("Error posting data:", error);
      }
    }

    setFormData({
      id: 0,
      overview: "",
      document: "",
      quiz: "",
      course: "",
      duration: "",
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

  const [courseTitles, setCourseTitles] = useState([]);

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

          <button className="ad-btn" type="submit">
            {editingId !== null ? "Update" : "Create class"}
          </button>
        </form>
      )}

      <div>
        <ul>
          {courses.map((course) => (
            <div className="course-card" key={course.id}>
              <h2 className="course-title">
                Created Class for Course {course.course}
              </h2>
              <p className="course-info">Overview: {course.overview}</p>
              <p className="course-info">
                Document:
                <button>
                  <a href={course.document} download={course.document}>
                    Download
                  </a>
                </button>
              </p>

              <p className="course-info">
                Quiz:
                <button>
                  <a href={course.document} download={course.document}>
                    Download
                  </a>
                </button>
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
            </div>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Classes;
