import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
 

 interface FormData {
  title: string;
  description: string;
  video: string;
  document: string ;
}


interface VideoFormProps {
  formDataArray: FormData[];
  currentFormData: FormData;
  // onFileChange: (name: string, file: File | null) => void;
  // onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  
}

const CustomFileInput: React.FC<{ label: string; onChange: (baseURL: string) => void }> = ({ label, onChange }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      const baseURL = '../src/assets/videos/' + file.name;
      console.log('baseURL' , baseURL)
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
 
const VideoForm: React.FC<VideoFormProps> = () => {
  const { courseId } = useParams<{ courseId: string }>()
  console.log('Course ID:', courseId);

   const [formDataArray, setFormDataArray] = useState<FormData[]>([]);
   const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
   const [currentFormData, setCurrentFormData] = useState<FormData>({
    title: '',
    description: '',
    video: '',
    document: '',
  });


  
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type } = e.target;

    if (type !== 'file') {
      const newValue = e.target.value;
      setCurrentFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
    }
  };

  const handleFileChange = (name: string, file: string) => {
    setCurrentFormData((prevFormData) => ({
      ...prevFormData,
      [name]: file,
    }));
  };


  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentFormData.title && currentFormData.description) {
      try {
        console.log('Submitting data....', currentFormData);
       await axios.patch(`http://localhost:3000/courses/${courseId}`,currentFormData);
        alert("Video Created successfully!");
      setFormDataArray((prevDataArray) => [...prevDataArray, { ...currentFormData }]);
      setCurrentFormData({
        title: '',
        description: '',
        video: '',
        document: '',
      });
     } catch (error) {
       console.error('Ops Error Creating course:', error);
   }
     } else {
      alert('Please fill in title and description.');
    }
  };
   
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
  };
     

  const handleUpdate = (index: number) => {
    setCurrentFormData({ ...formDataArray[index] });
  };

  const handleDelete = (index: number) => {
    const newDataArray = [...formDataArray];
    newDataArray.splice(index, 1);
    setFormDataArray(newDataArray);
  };

 
  return (
    <div>
      <h2>Add a new video for Course</h2>
      <button onClick={handleOpenForm}>Add Video</button>
      {
        isFormOpen &&(
          <form onSubmit={handleSubmit}>
          <label>
          Course Title:
          <input
            type="text"
            name="title"
            value={currentFormData.title}
            onChange={handleChange}
          />
        </label>
        <br /><br />
        <label>
          Course Description:
          <textarea
            name="description"
            value={currentFormData.description}
            onChange={handleChange}
          />
        </label><br />
        <br />
        <CustomFileInput label="Video File" onChange={(baseURL) => handleFileChange('video', baseURL)} />
        <br />
        <CustomFileInput label="Documents" onChange={(baseURL) => handleFileChange('document', baseURL)} />
        <br />
        <button type="submit">Create Course</button>
        <button onClick={handleCloseForm}>Cancel</button>
      </form>
        )
      }
        
      {formDataArray.map((formData, index) => (
        <div key={index}>
          <h2>Video{index + 1}</h2>
          <p>{formData.title} has been created.</p>
          <CourseCard data={formData} />
          <button onClick={() => handleUpdate(index)}>Update</button>
          <button onClick={() => handleDelete(index)}>Delete</button>
        </div>
      ))}
    </div>
  );
};

const CourseCard: React.FC<{ data: FormData }> = ({ data }) => {
  return (
    <div style={{ border: '1px solid #ccc', padding: '10px', margin: '10px', maxWidth: '400px' }}>
      <p><strong>Title:</strong> {data.title}</p>
      <p><strong>Description:</strong> {data.description}</p>
      <p><strong>Video File:</strong> {data.video}</p>
      <p><strong>Document File:</strong> {data.document}</p>
    </div>
  );
};



export default VideoForm;



