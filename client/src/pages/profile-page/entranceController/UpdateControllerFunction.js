import axios from 'axios';
import { toast } from 'react-toastify';
import { toastSetup } from '../../../functions/toastSetup';

export const UpdateControllerFunction = async (
  e,
  userId,
  setSelectedValue,
  updateData,
  setUpdateData,
  entranceControllorAcc,
  setButtonContent
) => {
  // Gather all form data
  const select = e.target.elements.event;
  const selectedOptionId = select.options[select.selectedIndex];

  const formData = {
    event: e.target.elements.event.value,
    entrance_num: e.target.elements.entrance_num.value,
    name: e.target.elements.name.value,
    password: e.target.elements.password.value,
    organizer_id: userId,
    collectionName: `tickets_for_${selectedOptionId.getAttribute('data-id')}`,
  };
  console.log(
    formData.event !== '' &&
      formData.entrance_num !== '' &&
      formData.name !== '' &&
      (formData.password.length >= 6 || formData.password === '')
  );
  // Check all form data before adding a entrance controller
  if (
    formData.event !== '' &&
    formData.entrance_num !== '' &&
    formData.name !== '' &&
    (formData.password.length >= 6 || formData.password === '')
  ) {
    try {
      // Update user
      const response = await axios.put(
        process.env.REACT_APP_API_URL +
          `/api/v1/entrance_controllers/update_controller/${updateData.controller_id}`,
        formData
      );

      if (response.status === 200) {
        toast.success(response.data.message, toastSetup('top-right', 2000));
        setSelectedValue('');
        setUpdateData();
        document.querySelector('.control-password-input').value = '';

        // Update selected controller in user interface with new data
        const existingIndex = entranceControllorAcc.findIndex(
          (controller) => controller._id === response.data.updatedController._id
        );
        entranceControllorAcc[existingIndex] = response.data.updatedController;

        setButtonContent('Dodaj račun');
      } else {
        toast.warn(response.data.message, toastSetup('top-right', 2000));
      }
    } catch (error) {
      toast.warn(error.message, toastSetup('top-right', 2000));
    }
  } else {
    let counter = 0;

    // Shou outline on each input that is ==== ""
    document.querySelectorAll('.control-input').forEach((e) => {
      if (e.value === '') {
        e.style = 'outline: 2px solid #f4cd46;';
        counter++;
      }
    });

    // Display different errors
    if (counter > 0) {
      toast.warn('Molimo unesite sva polja', toastSetup('top-right', 3000));
    } else {
      toast.warn(
        'Sifra mora biti duga minimalno 6 karaktera',
        toastSetup('top-right', 3000)
      );
      document.querySelector('.control-password-input').style =
        'outline: 2px solid #f4cd46;';
    }
  }
};
