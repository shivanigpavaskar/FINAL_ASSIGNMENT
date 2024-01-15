import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

 interface VideoData{
  vtitle:string;
    description:string;
    video:string;
    document:string;
 }
interface FormData {
  id:number;
  title: string;
  overview: string;
  creatorName: string;
  creatorEmail: string;

  duration: string;
  image:string;
  videos:VideoData[];

}



interface CourseFormProps {
  onSubmit: (newCourse: FormData) => void;
  initialData?: FormData | null;

}

const CourseForm: React.FC<CourseFormProps> = ({ onSubmit,initialData }) => {
  const { courseId } = useParams<{ courseId: string }>();
  console.log('Course ID:', courseId);
  const isEditMode = !!initialData;

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    overview: initialData?.overview || '',
    creatorName: initialData?.creatorName || '',
    creatorEmail: initialData?.creatorEmail || '',
    duration: initialData?.duration || '',
    image: initialData?.image || '',
    videos:[]
   
  });


  
  const handleInputChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setFormData(prevState =>({ ...prevState,
      [name]: value,
    }));
     
  };

  
  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFormData(prevState =>({
      ...prevState,
      image: file ? URL.createObjectURL(file) : '',
    }));
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {

      const formDataToSend = new FormData();
      formDataToSend.append('title', formData.title);
      formDataToSend.append('overview', formData.overview);
      formDataToSend.append('creatorName', formData.creatorName);
      formDataToSend.append('creatorEmail', formData.creatorEmail);
      formDataToSend.append('duration', formData.duration);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
        
    }
      console.log('Submitting data....', formData);
 
      const response = isEditMode
      ? await axios.patch(`http://localhost:3000/courses/${courseId}`, formData)
       : await axios.post('http://localhost:3000/courses', formData);
      const newCourse = response.data;
      onSubmit(newCourse);
      alert(`${isEditMode ? 'Course updated' : 'Course created'} successfully!`);
    } catch (error) {
      console.error(`${isEditMode ? 'Error updating' : 'Error creating'} course:`, error);
    }

    setFormData({
      title: '',
      overview: '',
      creatorName: '',
      creatorEmail: '',
      duration: '',
      image:'',
      videos:[],
      
    
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>Title:</label>
      <input type="text" name="title" value={formData.title} onChange={handleInputChange} />

      <label>Overview:</label>
      <textarea name="overview" value={formData.overview} onChange={handleInputChange}></textarea>

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
      <input type="file" name="image" accept="image/*" onChange={handleImageChange} />
      <button type="submit">{isEditMode ? 'Save Course' : 'Create Course'}</button>

     </form>
  );
};

export default CourseForm;







