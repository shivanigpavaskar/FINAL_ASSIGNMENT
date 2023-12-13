import React, { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  title: string;
  description: string;
  video: File | null;
  document: File | null;
}

const CustomFileInput: React.FC<{ label: string; onChange: (file: File | null) => void }> = ({ label, onChange }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onChange(file);
  };

  return (
    <div>
      <label>{label}</label>
      <input type="file" onChange={handleFileChange} />
    </div>
  );
};
 
const Courses: React.FC = () => {
  const [formDataArray, setFormDataArray] = useState<FormData[]>([]);
  const [currentFormData, setCurrentFormData] = useState<FormData>({
    title: '',
    description: '',
    video: null,
    document: null,
  });

 
  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, type } = e.target;

    if (type !== 'file') {
      const newValue = e.target.value;
      setCurrentFormData((prevFormData) => ({ ...prevFormData, [name]: newValue }));
    }
  };

  const handleFileChange = (name: string, file: File | null) => {
    setCurrentFormData((prevFormData) => ({
      ...prevFormData,
      [name]: file,
    }));
  };


  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (currentFormData.title && currentFormData.description) {
      setFormDataArray((prevDataArray) => [...prevDataArray, { ...currentFormData }]);
      setCurrentFormData({
        title: '',
        description: '',
        video: null,
        document: null,
      });
    } else {
      alert('Please fill in title and description.');
    }
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
      <h2>Create a New Course</h2>
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
        <CustomFileInput label="Video File" onChange={(file) => handleFileChange('video', file)} />
        <br />
        <CustomFileInput label="Documents" onChange={(file) => handleFileChange('document', file)} />
        <br />
        <button type="submit" onClick={}>Create Course</button>
      </form>



      {formDataArray.map((formData, index) => (
        <div key={index}>
          <h2>Video{index + 1}</h2>
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
      <p><strong>Video File:</strong> {data.video?.name}</p>
      <p><strong>Document File:</strong> {data.document?.name}</p>
    </div>
  );
};



export default Courses;



