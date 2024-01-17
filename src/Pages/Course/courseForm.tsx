import React, { useState, ChangeEvent, FormEvent } from "react";
import axios from "axios";
//  import img from "../../assets/images/"
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

   

  const CustomFileInput: React.FC<{
    label: string;
    onChange: (baseURL: string) => void;
  }> = ({ label, onChange }) => {
    const handleFileChanges = (e: ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        const baseURL = "src/assets/images/" + file.name;
        console.log("baseURL", baseURL);
        onChange(baseURL);
      }
    };
    return (
      <div>
        <label>{label}</label>
        <input type="file" onChange={handleFileChanges} />
      </div>
    );
  };

    const handleFileChange = (type: string, baseURL: string) => {
      
      setFormData((prevState) => ({
            ...prevState,
        [type]: baseURL,
             
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
    <form className="myform"   onSubmit={handleSubmit}>




      <label>Title:</label>
      <input
        type="text"
        name="title"
        value={formData.title}
        onChange={handleInputChange}
        required
      />
      <br/>
      

      <label>Overview:</label>
      <textarea
        name="overview"
        value={formData.overview}
        onChange={handleInputChange}
        required
      ></textarea>

      <label>Creator Name:</label>
      <input
        type="text"
        name="creatorName"
        value={formData.creatorName}
        onChange={handleInputChange}
        required
      />
      <label>Creator Email:</label>
      <input
        type="email"
        name="creatorEmail"
        value={formData.creatorEmail}
        onChange={handleInputChange}
        required
        pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}"
        title="Please enter a valid email address"
      />
       <label>Duration (weeks):</label>
      <input
        type="text"
        name="duration"
        value={formData.duration}
        onChange={handleInputChange}
        required
      />
<br />
      
      <CustomFileInput
            label="Image File"
            onChange={(baseURL) => handleFileChange("image", baseURL)}
          />
      <br />
      <button type="submit"     className="spbtn" style={{width:"150px",marginTop:"-30px"}}>
        {isEditMode ? "Save Course" : "Create Course"}
      </button>
     </form>
  );
};

export default CourseForm;


