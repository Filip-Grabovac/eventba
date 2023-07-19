import axios from "axios";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import { toastSetup } from "./toastSetup";

export const useFacebookLogin = (setIsLoginOpen, setUserID) => {
  const dispatch = useDispatch();

  const facebookLogin = async (fbResponse) => {
    if (fbResponse.accessToken) {
      const fbUserEmail = fbResponse.email;

      // Get user from database
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/users/fbEmail/${fbUserEmail}`,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        const { id } = response.data;
        dispatch(setUserID(id));
        localStorage.setItem("userId", id);

        toast.success("Uspješna prijava!", toastSetup("top-center", 3000));
      } catch (error) {
        // Else register new user
        const user = {
          name: fbResponse.name.split(" ")[0],
          lname:
            fbResponse.name.split(" ")[fbResponse.name.split(" ").length - 1],
          email: fbResponse.email,
          fbEmail: fbResponse.email,
          profileImg: fbResponse.picture.data.url,
          role: "standard",
          isVerified: true,
        };

        try {
          const response = await axios.post(
            process.env.REACT_APP_API_URL + "/api/v1/users",
            user,
            {
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          dispatch(setUserID(response.data.user._id));
          localStorage.setItem("userId", response.data.user._id);
          setIsLoginOpen(false);

          toast.success(
            "Uspješna prijava Facebookom! Ažurirajte svoje podatke na profilnoj stranici!",
            toastSetup("top-center", 3000)
          );
        } catch (error) {
          toast.error(
            `Došlo je do pogreške prilikom registracije. ${error.response.data.error}!`,
            toastSetup("top-center", 3000)
          );
        }
      }
      setIsLoginOpen(false);
    }
  };

  return facebookLogin;
};
