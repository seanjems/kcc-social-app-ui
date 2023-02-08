import React, {
  useState,
  useRef,
  useContext,
  useImperativeHandle,
  useEffect,
} from "react";
import ProfileImage from "../../img/profileImg.jpg";
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
import { UilUpload } from "@iconscout/react-unicons";
import { UilLink } from "@iconscout/react-unicons";
import { UilSchedule } from "@iconscout/react-unicons";
import { UilTimes } from "@iconscout/react-unicons";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import AuthContext from "../../auth/context";
import posts from "../../api/posts";
import { showNotification } from "@mantine/notifications";
import Resizer from "react-image-file-resizer";
import { useNavigate } from "react-router-dom";
import { forwardRef } from "react";
import DOMPurify from "dompurify";
import { result } from "lodash";
import ErrorTextComponent from "../../components/Reusables/ErrorTextComponent";
import { ArrowContainer, Popover } from "react-tiny-popover";
import ReactPlayer from "react-player";

//video editor
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
const ffmpeg = createFFmpeg({ log: true });

const PostShare = forwardRef((props, ref) => {
  const {
    fetchList,
    setFetchList,
    userProfile,
    setReSetPosts,
    setIsModalOpen,
  } = props;

  const [image, setImage] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const [videoPreview, setVideoPreview] = useState(null);
  const [uploadVideoFile, setUploadVideoFile] = useState(null);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [shareVideoLink, setShareVideoLink] = useState(null);
  const [compressionProgress, setCompressionProgress] = useState(null);

  const [ready, setReady] = useState(false);
  const [video, setVideo] = useState();

  const imageRef = useRef();
  const videoRef = useRef();
  const shareTextInput = useRef();
  const userContext = useContext(AuthContext);

  const sharePostRef = useRef();

  // console.log(
  // "🚀 ~ file: PostShare.jsx ~ line 21 ~ PostShare ~ userContext",
  // userContext
  // );

  //handle refs fowarded to textinput
  useImperativeHandle(ref, () => ({
    focusOnShareInput() {
      sharePostRef.current?.scrollIntoView({ behavior: "smooth" });
      sharePostRef && sharePostRef.current?.focus();
    },
  }));
  const PurifyLineBreaks = (text) => {
    const purifiedText = DOMPurify.sanitize(text, { ALLOWED_TAGS: ["br"] });
    return purifiedText;
  };
  const user = userContext.user;
  const navigate = useNavigate();

  //download ffmpeg lib
  const load = async () => {
    await ffmpeg.load();
    setReady(true);
  };

  useEffect(() => {
    if (!ready) {
      load();
    }
  }, []);

  //compress video with ffmpeg

  const shouldCompressVideo = async (file) => {
    const typicalWebVideoSize = 2500000; // 1 MB
    const typicalWebVideoPlaytime = 60; // 60 seconds

    const fileSize = file.size;
    const filePlaytime = await getVideoPlaytime(file);

    const sizeToPlaytimeRatio = fileSize / filePlaytime;
    console.log(
      "🚀 ~ file: PostShare.jsx:103 ~ shouldCompressVideo ~ sizeToPlaytimeRatio",
      sizeToPlaytimeRatio
    );

    if (sizeToPlaytimeRatio > typicalWebVideoSize / typicalWebVideoPlaytime) {
      return true;
    }

    return false;
  };

  //get video playtime
  const getVideoPlaytime = async (videoFile) => {
    // Read the file using the File API

    const videoURL = URL.createObjectURL(videoFile);

    // Create a video element
    const video = document.createElement("video");
    video.src = videoURL;

    // Wait for the video to load its metadata
    return new Promise((resolve, reject) => {
      video.addEventListener("loadedmetadata", () => {
        const playtime = video.duration;
        video.remove();
        URL.revokeObjectURL(videoURL);
        resolve(playtime);
      });
      video.addEventListener("error", (error) => {
        reject(error);
      });
    });
  };

  const compressVideoAsync = async (file) => {
    console.log(
      "🚀 ~ file: PostShare.jsx:93 ~ compressVideoAsync ~ file",
      file
    );
    var bigFile = await shouldCompressVideo(file);
    console.log(
      "🚀 ~ file: PostShare.jsx:133 ~ compressVideoAsync ~ bigFile",
      bigFile
    );
    var blobObj = null;
    if (bigFile) {
      // Write the file to memory
      ffmpeg.FS("writeFile", "test.mp4", await fetchFile(file));

      // Start a loop to periodically update the compression progress
      const interval = setInterval(() => {
        ffmpeg.setProgress(({ ratio }) => {
          console.log(ratio);
          setCompressionProgress((ratio * 100).toFixed(1));
        });
      }, 500);

      // Run the FFMpeg command
      await ffmpeg.run(
        "-i",
        "test.mp4",
        "-c:v",
        "libx264",
        "-crf",
        "35",
        "-preset",
        "ultrafast",
        "-tune",
        "fastdecode",
        "-c:a",
        "aac",
        "-b:a",
        "64k",
        "-vf",
        "scale=854:480",
        "-f",
        "mp4",
        "output.mp4"
      );

      // Stop the progress loop
      clearInterval(interval);
      setCompressionProgress(100);
      setCompressionProgress(null);

      // Read the result
      const data = ffmpeg.FS("readFile", "output.mp4");
      blobObj = new Blob([data.buffer], { type: "video/*" });
    }

    // Create a URL
    const url = URL.createObjectURL(bigFile ? blobObj : file);
    setVideoPreview({ vid: url });
    setUploadVideoFile(blobObj);
  };

  const onImageChanged = async (event) => {
    if (event.target.files && event.target.files[0]) {
      //let img = event.target.files[0]
      try {
        const file = event.target.files[0];
        const img = await resizeFile(file);
        console.log(img);

        setImage({ image: URL.createObjectURL(img) });
        setUploadFile(img);
      } catch (err) {
        console.log(err);
      }
    }
  };
  const onVideoChanged = async (event) => {
    if (event.target.files && event.target.files[0]) {
      //let img = event.target.files[0]
      try {
        const file = event.target.files[0];
        const videoBlob = await compressVideoAsync(file);
        console.log(
          "🚀 ~ file: PostShare.jsx:142 ~ onVideoChanged ~ videoBlob",
          videoBlob
        );
      } catch (err) {
        console.log(err);
      }
    }
  };
  //extract harstags from text
  const extractTagsToArray = (text) => {
    const regex = /(?:^|\s)(#[a-z\d-]+)/gi;
    const tags = text.match(regex) || [];
    result = tags.map((tag) => tag.trim());
    console.log("Captured tags", result);
    return result;
  };

  //Trim image size onclient
  const resizeFile = (file) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        900,
        900,
        "JPEG",
        100,
        0,
        (uri) => {
          resolve(uri);
        },
        "file"
      );
    });
  //validationObjects
  const createPostFormValidation = Yup.object().shape({
    description: Yup.string()
      .required()
      .min(3)
      .max(10000)
      .label("Post Description"),
    exterlVideoUrl: Yup.string().url("Invalid URL").required("URL is required"),
  });

  //post to db
  const handleCreatePost = async (createPostInput) => {
    var { description, imageFile } = createPostInput;

    //addlinebreaks
    description = description.replace(/\n/g, " <br> ");
    description = PurifyLineBreaks(description);
    console.log("purified content", description);
    //set userId

    const userId = userContext.user.UserId;
    imageFile = uploadFile;

    var formData = new FormData();
    formData.append("imageFile", imageFile);
    formData.append("description", description);
    formData.append("hashTags", extractTagsToArray(description));
    formData.append("userId", userId);
    //validate passwords

    //close modal if open
    setIsModalOpen && setIsModalOpen(false);

    //call api
    const result = await posts.tryCreatePost(formData);

    if (!result.ok) {
      showNotification({
        id: "user-data",
        title: "Error",
        message: `${user.status} ${user.problem}`,
        autoClose: true,
        disallowClose: false,
        // style: { zIndex: "999999" },
      });
      return;
    }
    // //add to posts array
    // var currentData = [...fetchList];
    // // console.log(
    // // "🚀 ~ file: PostShare.jsx ~ line 70 ~ handleCreatePost ~ fetchList",
    // // fetchList
    // // );
    // currentData.unshift(result.data);
    // setFetchList(currentData);
    // console.log(result.data, "this is the new istem we are pushing");

    //trigger post refresh
    setReSetPosts((oldValue) => {
      console.log(
        "🚀 ~ file: PostShare.jsx ~ line 116 ~ setReSetPosts ~ oldValue",
        oldValue
      );

      if (oldValue) {
        return !oldValue;
      }
      return true;
    });

    //clear form
    setImage(null);
    shareTextInput.current.value = "";
    setUploadFile(null);
  };

  return (
    <Formik
      initialValues={{
        description: "",
        exterlVideoUrl: "",
        videoFile: "",
        imageFile: "",
      }}
      onSubmit={(values, resetForm) => {
        handleCreatePost(values);
        resetForm({ values: "" });
      }}
      validationSchema={createPostFormValidation}
    >
      {({ handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
        <Form>
          <div className="PostShare">
            <div style={{ marginLeft: "2rem" }}>
              <ErrorTextComponent
                error={errors.description}
                visible={
                  touched.description &&
                  errors.description &&
                  errors.description.includes(
                    "must be at most 10000 characters"
                  )
                }
              />
            </div>

            <div>
              <img
                src={userProfile?.profilePicUrl}
                alt=""
                onClick={() => navigate("../profile")}
              />
              <div className="w-100">
                <div className="shareInput">
                  <textarea
                    type="textarea"
                    ref={shareTextInput}
                    placeholder="Share something . . .!"
                    onChange={handleChange("description")}
                    onBlur={() => setFieldTouched("description")}
                    rows="4"
                    style={{ width: "100%", resize: "none" }}
                  />
                </div>
                {shareVideoLink && (
                  <div className="shareInput">
                    <input
                      type="text"
                      ref={shareTextInput}
                      placeholder="Video Link e.g from youtube, etc..."
                      onChange={(e) => {
                        setShareVideoLink(e.target.value);
                        handleChange("description");
                      }}
                      onBlur={() => setFieldTouched("description")}
                      style={{ width: "100%", resize: "none" }}
                    />
                  </div>
                )}
              </div>
            </div>
            <div className="postOptions">
              <div
                className="option"
                style={{ color: "var(--photo)" }}
                onClick={() => imageRef.current.click()}
              >
                <UilScenery />
                <span className="hideMobile">Photo</span>
              </div>
              <div className="option" style={{ color: "var(--video)" }}>
                <Popover
                  isOpen={isPopoverOpen}
                  positions={["bottom", "left", "right"]} // preferred positions by priority
                  padding={10}
                  onClickOutside={() => setIsPopoverOpen(false)}
                  content={({ position, childRect, popoverRect }) => (
                    <ArrowContainer // if you'd like an arrow, you can import the ArrowContainer!
                      position={position}
                      childRect={childRect}
                      popoverRect={popoverRect}
                      arrowColor={"rgba(40, 52, 62, 0.07)"}
                      arrowSize={15}
                      arrowStyle={{ opacity: 0.7 }}
                      className="popover-arrow-container"
                      arrowClassName="popover-arrow"
                    >
                      <div
                        style={{
                          backgroundColor: "rgba(40, 52, 62, 0.07)",
                          opacity: 1,
                          borderRadius: "10px",
                          padding: "0.5rem",
                          display: "flex",
                          gap: "2rem",
                        }}
                        onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                      >
                        <div
                          className="d-flex flex-column align-items-center text-center"
                          onClick={() => videoRef.current.click()}
                        >
                          <UilUpload color="green" size="30" />
                          <small style={{ fontSize: "0.5rem" }}>
                            {" "}
                            Upload <br />
                            Video
                          </small>
                        </div>

                        <div
                          className="d-flex flex-column align-items-center text-center"
                          onClick={() =>
                            shareVideoLink === true
                              ? setShareVideoLink(false)
                              : setShareVideoLink(true)
                          }
                        >
                          <UilLink color="blue" size="30" />
                          <small
                            style={{
                              fontSize: "0.5rem",
                            }}
                          >
                            External <br />
                            Video Link
                          </small>
                        </div>
                      </div>
                    </ArrowContainer>
                  )}
                >
                  <div onClick={() => setIsPopoverOpen(!isPopoverOpen)}>
                    <UilPlayCircle />
                  </div>
                </Popover>

                <span className="hideMobile">Video</span>
              </div>
              <div
                className="option hideMobile"
                style={{ color: "var(--location)" }}
              >
                <UilLocationPoint />
                <span className="hideMobile">Location</span>
              </div>
              <div
                className="option hideMobile"
                style={{ color: "var(--shedule)" }}
              >
                <UilSchedule />
                <span className="hideMobile">Schedule</span>
              </div>
              <button className="button ps-button" type="submit">
                Share
              </button>
              <div style={{ display: "none" }}>
                <input
                  type="file"
                  name="myImage"
                  accept="image/*"
                  ref={imageRef}
                  onChange={onImageChanged}
                />
              </div>
              <div style={{ display: "none" }}>
                <input
                  type="file"
                  name="myVideo"
                  accept="video/*"
                  ref={videoRef}
                  onChange={onVideoChanged}
                />
              </div>
            </div>

            <div>
              {image && (
                <div className="imagePreview">
                  <UilTimes
                    onClick={() => {
                      setImage(null);
                      setUploadFile(null);
                    }}
                  />
                  {console.log(image.image)}
                  <img src={image.image} alt="" />
                </div>
              )}
            </div>
            <div>
              {compressionProgress && (
                <div className="w-100 mt-4 mb-4">
                  <span>
                    Processing Video...{" "}
                    <span>
                      <b>{compressionProgress}%</b>
                    </span>
                  </span>
                </div>
              )}
              {videoPreview && (
                <div className="imagePreview">
                  <UilTimes
                    onClick={() => {
                      setVideoPreview(null);
                      setUploadVideoFile(null);
                    }}
                  />
                  {/* {console.log(image.image)} */}
                  <ReactPlayer url={videoPreview.vid} controls />
                </div>
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
});

export default PostShare;
