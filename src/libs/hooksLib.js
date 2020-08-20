import { useState } from "react";

export function useFormFields(initialValues) {
  const { name, value } = event.target;
  const [values, setValues] = useState(initialValues);
  return [
    values,
    function(event) {
      setValues({
        ...values,
        [name]: value
      });
    }
  ];
}



function handleChange(event) {
  const { name, value } = event.target;
  setEditedNugget(prevValues => {
    return {
      ...prevValues,
      [name]: value
    };
  });
}
