import axios from "axios";
import { toast } from "react-toastify";
import { toastSetup } from "../../../functions/toastSetup";

export const AddControllerFunction = async (
  e,
  userId,
  setEntranceControllorAcc,
  setSelectedValue,
  setControllerName,
  setEntranceNum
) => {
  const select = e.target.elements.event;
  const selectedOptionId = select.options[select.selectedIndex];

  // Gather all form data
  const formData = {
    event: e.target.elements.event.value,
    entrance_num: e.target.elements.entrance_num.value,
    name: e.target.elements.name.value,
    password: e.target.elements.password.value,
    organizer_id: userId,
    collection_name: `tickets_for_${selectedOptionId.getAttribute("data-id")}`,
  };

  // Check all form data before adding a entrance controller
  if (
    formData.event !== "" &&
    formData.entrance_num !== "" &&
    formData.name !== "" &&
    formData.password !== "" &&
    formData.password.length >= 6
  ) {
    try {
      const response = await axios.post(
        process.env.REACT_APP_API_URL +
          "/api/v1/entrance_controllers/add_entrance_checker",
        formData
      );

      // Update user interface with new controller
      setEntranceControllorAcc((acc) => [
        ...acc,
        {
          ...formData,
          _id: response.data.data._id,
        },
      ]);

      // Clear all inputs
      document.querySelectorAll(".control-input").forEach((e) => {
        e.value = "";
      });
      toast.success(response.data.message, toastSetup("top-right", 2000));
      setSelectedValue("");
      setControllerName("");
      setEntranceNum("");
    } catch (error) {
      console.error(error);
    }
  } else {
    let counter = 0;

    // Show outline on each input that is ==== ""
    document.querySelectorAll(".control-input").forEach((e) => {
      if (e.value === "") {
        e.style = "outline: 2px solid #f4cd46;";
        counter++;
      }
    });

    // Display different errors
    if (counter > 0) {
      toast.warn("Molimo unesite sva polja", toastSetup("top-right", 3000));
    } else {
      toast.warn(
        "Šifra mora biti duga minimalno 6 karaktera",
        toastSetup("top-right", 3000)
      );
      document.querySelector(".control-password-input").style =
        "outline: 2px solid #f4cd46;";
    }
  }
};
