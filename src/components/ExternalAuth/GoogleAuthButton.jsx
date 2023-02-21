import { showNotification } from "@mantine/notifications";
import { IconX } from "@tabler/icons";
import { useState } from "react";
import externalAuth from "../../api/externalAuth";

function GoogleAuthButton() {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const result = await externalAuth.tryGetExternalAuthInit("Google");

    if (!result.ok) {
      showNotification({
        icon: <IconX size={16} />,
        title: "Error",
        message: `${result.status ? result.status : ""} ${result.problem}`,
        autoClose: true,
        disallowClose: false,
        style: { zIndex: "999999" },
      });
      console.log("Error initiating external Auth", result.originalError);
      setLoading(false);
      return;
    }
    console.log("After success", result);

    try {
      const { redirectUrl } = result.data.result;
      const width = 500;
      const height = 600;
      const left = window.screen.width / 2 - width / 2;
      const top = window.screen.height / 2 - height / 2;
      const options = `width=${width},height=${height},left=${left},top=${top},location=no,menubar=no,toolbar=no,resizable=no,status=no`;
      const popup = window.open(redirectUrl, "_blank", options);
      if (popup) {
        popup.focus();
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={handleLogin} disabled={loading}>
        {loading ? "please wait .." : "Log in with Google"}
      </button>
    </div>
  );
}
export default GoogleAuthButton;
