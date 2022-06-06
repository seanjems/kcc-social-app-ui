import { Modal, useMantineTheme } from "@mantine/core";

function ProfileModal({ isModalOpen, setIsModalOpen }) {
  const theme = useMantineTheme();

  return (
    <Modal
      overlayColor={
        theme.colorScheme === "dark"
          ? theme.colors.dark[9]
          : theme.colors.gray[2]
      }
      overlayOpacity={0.55}
      overlayBlur={3}
      size="55%"
      opened={isModalOpen}
      onClose={() => setIsModalOpen(false)}>
      <div className="inputForm">
        <form action="" className="infoForm">
          <h3>Your info</h3>

          <div>
            <input
              type="text"
              name="firstname"
              placeholder="First Name"
              className="formInput"
            />

            <input
              type="text"
              name="lastname"
              placeholder="Last Name"
              className="formInput"
            />
          </div>

          <div>
            <input
              type="text"
              name="livesIn"
              placeholder="Lives in"
              className="formInput"
            />
          </div>
          <div>
            <input
              type="text"
              name="familyClan"
              placeholder=" Church Family/Clan"
              className="formInput"
            />
          </div>
          <div>
            <input
              type="text"
              name="status"
              placeholder="Relationship status"
              className="formInput"
            />
            <input
              type="text"
              name="profession"
              placeholder="Profession"
              className="formInput"
            />
          </div>
          <div>
            <input
              type="text"
              name="aboutme"
              placeholder="About me"
              className="formInput"
            />
          </div>
          <div>
            <input type="file" name="profileImg" />
            <input type="file" name="coverImg" />
            <button className="button sign-button">Update</button>
          </div>
        </form>
      </div>
    </Modal>
  );
}

export default ProfileModal;
