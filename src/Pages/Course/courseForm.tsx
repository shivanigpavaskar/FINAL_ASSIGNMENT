import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
 
interface VideoData {
  vtitle: string;
  description: string;
  video: string;
  document: string;
}
interface FormData {
  id: number;
  title: string;
  overview: string;
  creatorName: string;
  creatorEmail: string;
  duration: string;
  image: string;
  videos: VideoData[];
}

interface CourseFormProps {
  onSubmit: (newCourse: FormData) => void;
  initialData?: FormData | null;
}

const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, initialData }) => {
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    id: initialData?.id || undefined,
    title: initialData?.title || "",
    overview: initialData?.overview || "",
    creatorName: initialData?.creatorName || "",
    creatorEmail: initialData?.creatorEmail || "",
    duration: initialData?.duration || "",
    image: initialData?.image || "",
    videos: [],
  });

  const handleInputChange = (
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = event.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFormData((prevState) => ({
      ...prevState,
      image: file ? URL.createObjectURL(file) : "",
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isEditMode) {
        await axios.put(
          `http://localhost:3000/courses/${formData.id}`,
          formData
        );
        alert("Course updated successfully!");
      } else {
        const response = await axios.post(
          "http://localhost:3000/courses",
          formData
        );
        const newCourse = response.data;
        onSubmit(newCourse);
        alert("Course created successfully!");
      }
    } catch (error) {
      console.error(
        isEditMode ? "Error updating course:" : "Error creating course:",
        error
      );
    }

    setFormData({
      title: "",
      overview: "",
      creatorName: "",
      creatorEmail: "",
      duration: "",
      image: "",
      videos: [],
      id: undefined,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Title:</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
      />

      <label>Overview:</label>
      <textarea
        name="overview"
        value={formData.overview}
        onChange={handleInputChange}
      ></textarea>

      <label>Creator Name:</label>
      <input
        type="text"
        name="creatorName"
        value={formData.creatorName}
        onChange={handleInputChange}
      />
      <label>Creator Email:</label>
      <input
        type="email"
        name="creatorEmail"
        value={formData.creatorEmail}
        onChange={handleInputChange}
      />

      <label>Duration (weeks):</label>
      <input
        type="text"
        name="duration"
        value={formData.duration}
        onChange={handleInputChange}
      />

      <label>Image:</label>
      <input
        type="file"
        name="image"
        accept="image/*"
        onChange={handleImageChange}
      />
      <button type="submit">
        {isEditMode ? "Save Course" : "Create Course"}
      </button>
      {/* <button type='submit'>Createcourse</button> */}
    </form>
  );
};

export default CourseForm;
