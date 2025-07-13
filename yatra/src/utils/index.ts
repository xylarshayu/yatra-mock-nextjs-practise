import { SearchHotelsParams, FormErrors } from "@/types";
import cities from "@/data/cities.json";

export const validateSearchForm = (formData: SearchHotelsParams): FormErrors => {
  const newErrors: FormErrors = {};

  if (!formData.city) {
    newErrors.city = "City is required";
  } else if (!cities.includes(formData.city)) {
    newErrors.city = "Please select a valid city from the list";
  }

  if (!formData.checkin) {
    newErrors.checkin = "Check-in date is required";
  }

  if (!formData.checkout) {
    newErrors.checkout = "Check-out date is required";
  } else if (
    formData.checkin &&
    formData.checkout &&
    formData.checkout <= formData.checkin
  ) {
    newErrors.checkout = "Check-out date must be after check-in";
  }

  if (!formData.guests) {
    newErrors.guests = "Guests is required";
  }

  return newErrors;
};

export const getTodayString = (): string => {
  return new Date().toISOString().split("T")[0];
};