import React, { useState, useRef, useContext } from "react";
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

const PostShare = ({ fetchList, setFetchList }) => {
  const [image, setImage] = useState(null);
  const [uploadFile, setUploadFile] = useState(null);
  const imageRef = useRef();
  const shareTextInput = useRef();
  const userContext = useContext(AuthContext);

  const onImageChanged = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setImage({ image: URL.createObjectURL(img) });
      setUploadFile(img);
    }
  };

  //validationObjects
  const createPostFormValidation = Yup.object().shape({
    description: Yup.string().required().min(3).max(2000).label("description"),
  });

  //post to db
  const handleCreatePost = async (createPostInput) => {
    var { description, imageFile } = createPostInput;
    //set userId

    const userId = userContext.user.UserId;
    imageFile = uploadFile;

    var formData = new FormData();
    formData.append("imageFile", imageFile);
    formData.append("description", description);
    formData.append("userId", userId);
    console.log(formData, "formdate Headers....");
    console.log(imageFile, "image in state");
    //validate passwords
    const result = await posts.tryCreatePost(formData);

    console.log("create user result", result);
    // if (!result.ok) {
    //   setCreatePostFailed(true);
    //   setCreatePostErrors(result.data);
    //   return;
    // }

    //add to posts array
    var currentData = [...fetchList];
    currentData.unshift(result.data);
    setFetchList(currentData);
    console.log(result.data, "this is the new istem we are pushing");

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
              <img src={ProfileImage} alt="" />
              <div className="shareInput">
                <input
                  type="textarea"
                  ref={shareTextInput}
                  placeholder="Share something . . .!"
                  onChange={handleChange("description")}
                  onBlur={() => setFieldTouched("description")}
                ></input>
              </div>
            </div>
            <div className="postOptions">
              <div
                className="option"
                style={{ color: "var(--photo)" }}
                onClick={() => imageRef.current.click()}
              >
                <UilScenery />
                Photo
              </div>
              <div className="option" style={{ color: "var(--video)" }}>
                <UilPlayCircle />
                Video
              </div>
              <div className="option" style={{ color: "var(--location)" }}>
                <UilLocationPoint />
                Location
              </div>
              <div className="option" style={{ color: "var(--shedule)" }}>
                <UilSchedule />
                Schedule
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
                  <img src={image.image} alt="" />
                </div>
              )}
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );
};

export default PostShare;
