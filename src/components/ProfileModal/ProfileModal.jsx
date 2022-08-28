import { Modal, useMantineTheme } from "@mantine/core";

import { UilPen, UilTimes } from "@iconscout/react-unicons";
import { Form, Formik } from "formik";
import { useContext, useRef, useState } from "react";
import * as Yup from "yup";
import profile from "../../api/profile";
import AuthContext from "../../auth/context";
import CoverPic from "../../img/cover.jpg";
import ProfilePic from "../../img/profileImg.jpg";

import { showNotification, updateNotification } from "@mantine/notifications";
import { IconCheck } from "@tabler/icons";
import { IconX } from "@tabler/icons";
import ErrorTextComponent from "../Reusables/ErrorTextComponent";

function ProfileModal({ isModalOpen, setIsModalOpen }) {
  const theme = useMantineTheme();
  const dpRef = useRef();
  const coverPicRef = useRef();
  const userContext = useContext(AuthContext);

  const [coverPicUrl, setCoverPicUrl] = useState(CoverPic);
  const [dpUrl, setdpUrl] = useState(ProfilePic);

  const [profilepic, setProfilePic] = useState(null);
  const [coverpic, setCoverPic] = useState(null);

  const handleProfileChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setdpUrl(URL.createObjectURL(img));
      setProfilePic(img);
      console.log("new profile image properties", img);
    }
  };
  const handleCoverChange = (event) => {
    if (event.target.files && event.target.files[0]) {
      let img = event.target.files[0];
      setCoverPicUrl(URL.createObjectURL(img));
      setCoverPic(img);
      console.log("new cover image properties", img);
    }
  };

  //post to db
  const handleUpdateProfile = async (updateProfileInput) => {
    //start notification
    showNotification({
      id: "save-data",
      loading: true,
      title: "Saving profile data",
      message: "Please wait...",
      autoClose: false,
      disallowClose: true,
      style: { zIndex: "999999" },
    });
    var {
      firstName,
      lastname,
      address,
      family,
      relationship,
      profession,
      aboutme,
    } = updateProfileInput;
    //set userId

    const userId = userContext.user.UserId;

    var formData = new FormData();
    coverpic && formData.append("coverpic", coverpic);
    profilepic && formData.append("profilepic", profilepic);
    formData.append("firstName", firstName);
    formData.append("lastname", lastname);
    formData.append("address", address);
    formData.append("family", family);
    formData.append("relationship", relationship);
    formData.append("profession", profession);
    formData.append("aboutme", aboutme);
    formData.append("userId", userId);
    console.log(formData, "formdata Headers....");
    //validate passwords
    const result = await profile.tryUpdateProfile(formData);

    if (!result.ok) {
      // setCreatePostFailed(true);
      // setCreatePostErrors(result.data);
      setTimeout(() => {
        updateNotification({
          id: "save-data",
          color: "red",
          title: "Error while updating your profile",
          message: `${result.status} ${result.problem}`,
          icon: <IconX size={16} />,
          autoClose: 6000,
          style: { zIndex: "99999999" },
        });
      }, 3000);

      return;
    }

    setTimeout(() => {
      updateNotification({
        id: "save-data",
        color: "teal",
        title: "Profile Update succesfull",
        message: "Success",
        icon: <IconCheck size={16} />,
        autoClose: 2000,
        style: { zIndex: "99999999" },
      });
    }, 3000);

    //close modal
    setIsModalOpen(false);
  };

  //validationObjects
  const updateProfileFormValidation = Yup.object().shape({
    firstName: Yup.string().required().min(3).max(25).label("First Name"),
    lastname: Yup.string().required().min(3).max(25).label("Last Name"),
    family: Yup.string().min(3).max(15).label("Church family/Clan"),
    relationship: Yup.string().min(3).max(10).label("Relationship status"),
    profession: Yup.string().min(3).max(10).label("Work/Profession"),
    aboutme: Yup.string().min(10).max(50).label("About me"),
  });

  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={0}
      size="45%"
      opened={isModalOpen}
      onClose={() => setIsModalOpen(false)}
      style={{ overflowY: "scroll", maxHeight: "90%" }}
    >
      <Formik
        initialValues={{
          firstName: "",
          lastname: "",
          address: "",
          family: "",
          status: "",
          profession: "",
          aboutme: "",
          localChurch: "",
          contacts: "",
          favouriteVerse: "",
          relationship: 0,
        }}
        onSubmit={(values, resetForm) => {
          handleUpdateProfile(values);
          resetForm({ values: "" });
        }}
        validationSchema={updateProfileFormValidation}
      >
        {({ handleChange, handleSubmit, errors, setFieldTouched, touched }) => (
          <div className="inputForm">
            <Form action="" className="infoForm">
              <div
                className="ProfileImages"
                style={{ marginTop: "-4rem", position: "relative" }}
              >
                <UilTimes
                  style={{
                    position: "absolute",
                    color: "rgb(255, 255, 255)",
                    backgroundColor: "rgba(39, 44, 48, 0.75)",
                    backdropFilter: "blur(4px)",
                    backdropFilter: "blur(4px)",
                    borderRadius: "50%",
                    marginRight: "-3rem",
                  }}
                  onClick={() => {
                    setCoverPicUrl(
                      "https://via.placeholder.com/728x90.png?text=No+Cover+Image"
                    );
                  }}
                />
                <UilPen
                  style={{
                    position: "absolute",
                    color: "rgb(255, 255, 255)",
                    backgroundColor: "rgba(39, 44, 48, 0.75)",
                    backdropFilter: "blur(4px)",
                    backdropFilter: "blur(4px)",
                    borderRadius: "50%",
                    marginRight: "3rem",
                    padding: "2px",
                  }}
                  onClick={() => coverPicRef.current.click()}
                />
                <UilPen
                  style={{
                    position: "absolute",
                    color: "rgb(255, 255, 255)",
                    backgroundColor: "rgba(39, 44, 48, 0.75)",
                    backdropFilter: "blur(4px)",
                    backdropFilter: "blur(4px)",
                    marginTop: "9rem",
                    zIndex: "9999",
                    borderRadius: "50%",
                    padding: "2px",
                  }}
                  onClick={() => dpRef.current.click()}
                />
                <img src={coverPicUrl} alt="" style={{ height: "9rem" }} />
                <img src={dpUrl} alt="" />
              </div>
              <h3 style={{ marginTop: "4rem" }}>Your info</h3>
              {/* //validation errors */}
              <div style={{ display: "flex", flexDirection: "column" }}>
                <ErrorTextComponent
                  error={errors.firstName}
                  visible={touched.firstName}
                />
                <ErrorTextComponent
                  error={errors.lastname}
                  visible={touched.lastname}
                />
                <ErrorTextComponent
                  error={errors.address}
                  visible={touched.address}
                />
                <ErrorTextComponent
                  error={errors.family}
                  visible={touched.family}
                />
                <ErrorTextComponent
                  error={errors.relationship}
                  visible={touched.relationship}
                />
                <ErrorTextComponent
                  error={errors.Profession}
                  visible={touched.Profession}
                />
                <ErrorTextComponent
                  error={errors.aboutme}
                  visible={touched.aboutme}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="firstName"
                  placeholder="First Name"
                  className="formInput"
                  onChange={handleChange("firstName")}
                  onBlur={() => setFieldTouched("firstName")}
                />

                <input
                  type="text"
                  name="lastname"
                  placeholder="Last Name"
                  className="formInput"
                  onChange={handleChange("lastname")}
                  onBlur={() => setFieldTouched("lastname")}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="address"
                  placeholder="Lives in"
                  className="formInput"
                  onChange={handleChange("address")}
                  onBlur={() => setFieldTouched("address")}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="family"
                  placeholder=" Church Family/Clan"
                  className="formInput"
                  onChange={handleChange("family")}
                  onBlur={() => setFieldTouched("family")}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="relationship"
                  placeholder="Relationship status"
                  className="formInput"
                  onChange={handleChange("relationship")}
                  onBlur={() => setFieldTouched("relationship")}
                />

                <input
                  type="text"
                  name="profession"
                  placeholder="Profession"
                  onChange={handleChange("Profession")}
                  onBlur={() => setFieldTouched("Profession")}
                />
              </div>
              <div>
                <input
                  type="text"
                  name="aboutme"
                  placeholder="About me"
                  className="formInput"
                  onChange={handleChange("aboutme")}
                  onBlur={() => setFieldTouched("aboutme")}
                />
              </div>
              <div>
                <input
                  type="file"
                  name="profileImg"
                  ref={dpRef}
                  hidden={true}
                  onChange={handleProfileChange}
                />
                <input
                  type="file"
                  name="coverImg"
                  ref={coverPicRef}
                  hidden={true}
                  onChange={handleCoverChange}
                />
                <button
                  className="button sign-button"
                  type="submit"
                  onSubmit={handleSubmit}
                >
                  Update
                </button>
              </div>
            </Form>
          </div>
        )}
      </Formik>
    </Modal>
  );
}

export default ProfileModal;
