import React, { useState, ChangeEvent, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import ReactPlayer from "react-player";
import './videoForm.css'
 
interface VideoData {
  vId: number;
  vtitle: string;
  description: string;
  video: string;
  document: string;
}
 
interface CourseData {
  id: number;
  title: string;
  overview: string;
  creatorId: number;
  creatorName: string;
  duration: string;
  image: string;
  videos: VideoData[];
}
 
interface VideoProgressState {
  played: number;
  playedSeconds: number;
  loaded: number;
  loadedSeconds: number;
}

const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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
 
const VideoForm: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const [editVideoId, setEditVideoId] = useState<number | null>(null);
  const [formDataArray, setFormDataArray] = useState<CourseData[]>([]);
  const [videoIdCounter, setVideoIdCounter] = useState<number>(1);
  const [userDesignation, setUserDesignation] = useState<string | null>(null);
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [currentFormData, setCurrentFormData] = useState<VideoData>({
    vId: 0,
    vtitle: "",
    description: "",
    video: "",
    document: "",
  });

  const [playedSeconds, setPlayedSeconds] = useState(0);
  const [totalSeconds, setTotalSeconds] = useState(0);
  const [videoProgress, setVideoProgress] = useState(0);
  const handleProgress = (state:VideoProgressState) => {
     setPlayedSeconds(state.playedSeconds);
    setTotalSeconds(state.loadedSeconds);
    setVideoProgress(state.played);

    localStorage.setItem( `videoProgress-${courseId}`, JSON.stringify(state));

  };
 
 

useEffect(() => {
   const savedProgress = localStorage.getItem(`videoProgress-${courseId}`);
  if (savedProgress) {
      const parsedProgress = JSON.parse(savedProgress);
      setPlayedSeconds(parsedProgress.playedSeconds);
      setTotalSeconds(parsedProgress.loadedSeconds);
      setVideoProgress(parsedProgress.played);
  }
}, [courseId]);
























  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const response = await axios.get<CourseData>(
          `http://localhost:3000/courses/${courseId}`
        );
        console.log('Response:', response);
        setFormDataArray([response.data]);
        setVideoIdCounter(response.data.videos.length +1);
      } catch (error) {
        console.error("Error fetching course data:", error);
      }
    };
 
    fetchCourseData();
  }, [courseId]);
 
 
    console.log("videos length" + videoIdCounter)
 
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCurrentFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };
 
  const handleFileChange = (type: string, baseURL: string) => {
       
        setCurrentFormData((prevFormData) => ({
                ...prevFormData,
                [type]: baseURL,
              }));
      };
 
  const createVideo = async () => {
    try {
 
      const { vtitle, description, video, document } = currentFormData;
 
     
      const newVideoId = videoIdCounter;
 
      const newVideo = { vId: newVideoId, vtitle, description, video, document };
 
      const updatedCourse = { ...formDataArray[0] };
      updatedCourse.videos.push(newVideo);
 
      setFormDataArray([updatedCourse]);
 
      await axios.patch(`http://localhost:3000/courses/${courseId}`, updatedCourse);
 
 
      alert("Video Created successfully!");
      handleCloseForm();
      setCurrentFormData({
        vId: 0,
        vtitle: "",
        description: "",
        video: "",
        document: "",
      });
    } catch (error) {
      console.error("Error creating video:", error);
    }
  };
 
  const handleOpenForm = () => {
    setIsFormOpen(true);
  };
 
  const handleCloseForm = () => {
    setIsFormOpen(false);
  };


  const handleDelete = async (videoId: number) => {
    try {
      const updatedVideos = formDataArray[0].videos.filter(
        (video) => video.vId !== videoId
      );

      const updatedCourse = {
        ...formDataArray[0],
        videos: updatedVideos,
      };

      setFormDataArray([updatedCourse]);

      await axios.patch(
        `http://localhost:3000/courses/${courseId}`,
        updatedCourse
      );

      alert("Video Deleted Successfully!");
    } catch (error) {
      console.error("Error deleting video:", error);
    }
  };

  const handleEdit = (video: VideoData) => {
    setCurrentFormData(video);
    setEditVideoId(video.vId);
  };


  const saveEditedVideo = async () => {
    try {
      const updatedVideos = formDataArray[0].videos.map((video) =>
        video.vId === currentFormData.vId ? currentFormData : video
      );

      const updatedCourse = {
        ...formDataArray[0],
        videos: updatedVideos,
      };

      setFormDataArray([updatedCourse]);

      await axios.patch(
        `http://localhost:3000/courses/${courseId}`,
        updatedCourse
      );

      alert("Video Updated Successfully!");
      setEditVideoId(null); 
    } catch (error) {
      console.error("Error updating video:", error);
    }
  };

  useEffect(() => {
    const userString = localStorage.getItem("UserLoggedIn");
    if (userString) {
      const { designation } = JSON.parse(userString);
      setUserDesignation(designation);
    }
  }, []);



 
  return (
    <div>
 
 {  userDesignation === "Trainer" &&  (  <h2>Add a new video for Course{courseId}</h2>)}
    
 {userDesignation === "Trainer" && (
        <button onClick={handleOpenForm} className="blue-button">
          Add Video
        </button>
      )}
     


  
      {isFormOpen && (
        <form onSubmit={createVideo} method="post">
          <label>
            Video Title:
            <input
              type="text"
              name="vtitle"
              value={currentFormData.vtitle}
              onChange={handleChange}
            />
          </label>
          <br />
          <br />
          <label>
            Video Description:
            <textarea
              name="description"
              value={currentFormData.description}
              onChange={handleChange}
            />
          </label>
          <br />
          <CustomFileInput
            label="Video File"
            onChange={(baseURL) => handleFileChange("video",baseURL)}
          />
          <br />
          <CustomFileInput
            label="Documents"
            onChange={(baseURL) => handleFileChange("document",baseURL)}
          />
          <br />
          <button type="submit">Create Video</button>
          <button onClick={handleCloseForm}>Cancel</button>
        </form>
      )}
 
      {formDataArray.map((courseData) => (
        <div key={courseData.id}>
          <h2>Videos for Course: {courseData.title}</h2>
          <div className="video-container">

          {courseData.videos.map((video) => (
            <div key={video.vId} className="video-card" >
                  <ReactPlayer
                  url={video.video}
                  width="100%"
                  height="100%"
                  controls
                  onProgress={handleProgress}
                ></ReactPlayer>
 <p>Played: {formatTime(playedSeconds)}</p>
<p>Total Time: {formatTime(totalSeconds)}</p>
      <p>Progress: {(videoProgress * 100).toFixed(2)}%</p>

      <div className="video-details">
<h3>Video: {video.vtitle}</h3>
<p>Description: {video.description}</p>
<p>
                    Document:
                    <button>
                      <a href={video.document} download={video.document}>
                        Download
                      </a>
                    </button>
                  </p>
                  {userDesignation === "Trainer" && (
                    <>
                  {editVideoId === video.vId ? (
                    <>
                      <label>
                        Video Title:
                        <input
                          type="text"
                          name="vtitle"
                          value={currentFormData.vtitle}
                          onChange={handleChange}
                        />
                      </label>
                      <br />
                      <br />
                      <label>
                        Video Description:
                        <textarea
                          name="description"
                          value={currentFormData.description}
                          onChange={handleChange}
                        />
                      </label>
                      <br />
                      <CustomFileInput
                        label="Video File"
                        onChange={(baseURL) =>
                          handleFileChange("video", baseURL)
                        }
                      />
                      <br />
                      <CustomFileInput
                        label="Documents"
                        onChange={(baseURL) =>
                          handleFileChange("document", baseURL)
                        }
                      />
                      <br />
                      <button onClick={saveEditedVideo}>Save</button>
                      <button onClick={() => setEditVideoId(null)}>
                        Cancel
                      </button>
                    </>
                  ) : (
                    <>
                      <button onClick={() => handleEdit(video)}>Edit</button>
                      <button onClick={() => handleDelete(video.vId)}>
                        Delete
                      </button>
                    </>
                  
                  )}
</>
                  )}
                  










</div>

             </div>
          ))}
        </div>
        </div>
      ))}
    </div>
  );
};
 
export default VideoForm;