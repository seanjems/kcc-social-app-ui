import React, {
  useState,
  useRef,
  useContext,
  useImperativeHandle,
} from "react";
import ProfileImage from "../../img/profileImg.jpg";
import "./PostShare.css";
import { UilScenery } from "@iconscout/react-unicons";
import { UilPlayCircle } from "@iconscout/react-unicons";
import { UilLocationPoint } from "@iconscout/react-unicons";
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
import DOMPurify from 'dompurify';

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
  const imageRef = useRef();
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
    const purifiedText = DOMPurify.sanitize(text, {ALLOWED_TAGS: ['br']});
    return purifiedText;
  };
  const user = userContext.user;
  const navigate = useNavigate();
  const onImageChanged = async (event) => {
    if (event.target.files && event.target.files[0]) {
      //let img = event.target.files[0];

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
    description: Yup.string().required().min(3).max(2000).label("description"),
  });

  //post to db
  const handleCreatePost = async (createPostInput) => {
    var { description, imageFile } = createPostInput;

    //addlinebreaks
    description = description.replace(/\n/g, ' <br> ');
    description = PurifyLineBreaks(description);
    console.log("purified content", description);
    //set userId

    const userId = userContext.user.UserId;
    imageFile = uploadFile;

    var formData = new FormData();
    formData.append("imageFile", imageFile);
    formData.append("description", description);
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
      initialValues={{ description: "", imageFile: "" }}
      onSubmit={(values, resetForm) => {
        handleCreatePost(values);
        resetForm({ values: "" });
      }}
      validationSchema={createPostFormValidation}
    >
      {({ handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
        <Form>
          <div className="PostShare">
            <div>
              <img
                src={userProfile?.profilePicUrl}
                alt=""
                onClick={() => navigate("../profile")}
              />
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
                <UilPlayCircle />
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
          </div>
        </Form>
      )}
    </Formik>
  );
});

export default PostShare;
