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

  const [formData, setFormData] = useState({
    title: initialData?.title || '',
    overview: initialData?.overview || '',
    creatorName: initialData?.creatorName || '',
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
      formDataToSend.append('duration', formData.duration);
      // formDataToSend.append('vtitle', formData.videos.vtitle);
      // formDataToSend.append('description', formData.videos.description);
      // formDataToSend.append('video', formData.videos.video);
      // formDataToSend.append('document', formData.videos.document);
      if (formData.image) {
        formDataToSend.append('image', formData.image);
        
    }
      console.log('Submitting data....', formData);
      const response = await axios.post('http://localhost:3000/courses', formData);
      const newCourse = response.data; 
      onSubmit(newCourse);
      alert('Course created successfully!');
    } catch (error) {
      console.error('Ops Error Creating course:', error);
    }

    setFormData({
      title: '',
      overview: '',
      creatorName: '',
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

      <label>Duration (weeks):</label>
      <input
        type="text"
        name="duration"
        value={formData.duration}
        onChange={handleInputChange}
      />

<label>Image:</label>
      <input type="file" name="image" accept="image/*" onChange={handleImageChange} />

      <button type="submit">Create Course</button>
    </form>
  );
};

export default CourseForm;







