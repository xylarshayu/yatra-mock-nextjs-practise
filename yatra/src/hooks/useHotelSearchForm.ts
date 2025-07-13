import { useState, ChangeEvent, FormEvent } from "react";
import { useRouter } from "next/router";
import { SearchHotelsParams, FormErrors } from "@/types";
import { validateSearchForm } from "@/utils/index";

export const useHotelSearchForm = (initialState: SearchHotelsParams) => {
  const router = useRouter();
  const [formData, setFormData] = useState<SearchHotelsParams>(initialState);
  const [errors, setErrors] = useState<FormErrors>({});

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name as keyof FormErrors];
        return newErrors;
      });
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  
  const handleCityChange = (city: string) => {
     if (errors.city) {
      setErrors((prev) => {
        const { city, ...rest } = prev;
        return rest;
      });
    }
    setFormData((prev) => ({ ...prev, city }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const validationErrors = validateSearchForm(formData);
    setErrors(validationErrors);

    if (Object.keys(validationErrors).length === 0) {
      router.push({
        pathname: "/hotels",
        query: {
          city: formData.city,
          checkin: formData.checkin,
          checkout: formData.checkout,
          guests: formData.guests,
        },
      });
    }
  };

  return {
    formData,
    errors,
    handleChange,
    handleCityChange,
    handleSubmit,
  };
};