import { FormField } from "@/components/formField";
import { AutocompleteInput } from "@/components/autocomplete";
import { getTodayString } from "@/utils";
import { useHotelSearchForm } from "@/hooks/useHotelSearchForm";
import cities from "@/data/cities.json";
export default function Home() {
  const { formData, errors, handleChange, handleCityChange, handleSubmit } =
    useHotelSearchForm({
      city: "",
      checkin: "",
      checkout: "",
      guests: "",
    });

  return (
    <div>
      <main className="items-center py-8 mx-auto max-w-maxwidth min-h-page-height">
        <h1 className="mb-8 text-4xl font-bold text-center">Find My Hotel</h1>
        <p className="text-center text-gray-500 max-w-[60ch] mx-auto">
          Discover amazing hotels and create unforgettable memories with our
          curated selection of accommdations.
        </p>

        <div className="w-full max-w-4xl p-8 mx-auto mt-4 border rounded-lg shadow-xl border-gray-50 dark:border-gray-800 bg-background">
          <form
            onSubmit={handleSubmit}
            noValidate
            className="grid items-end grid-cols-1 gap-6 md:grid-cols-5"
          >
            <FormField
              label="City"
              htmlFor="city"
              error={errors.city}
              className="md:col-span-2"
            >
              <AutocompleteInput
                id="city"
                name="city"
                value={formData.city}
                onValueChange={handleChange}
                onSuggestionSelect={handleCityChange}
                items={cities}
                placeholder="e.g., Mumbai"
              />
            </FormField>

            <FormField
              label="Check-in"
              htmlFor="checkin"
              error={errors.checkin}
            >
              <input
                type="date"
                id="checkin"
                name="checkin"
                value={formData.checkin}
                onChange={handleChange}
                min={getTodayString()}
                className="w-full my-input"
              />
            </FormField>

            <FormField
              label="Check-out"
              htmlFor="checkout"
              error={errors.checkout}
            >
              <input
                type="date"
                id="checkout"
                name="checkout"
                value={formData.checkout}
                onChange={handleChange}
                min={formData.checkin || getTodayString()}
                className="w-full my-input"
              />
            </FormField>

            <FormField
              label="Guests"
              htmlFor="guests"
              error={errors.guests}
              className="md:col-span-1"
            >
              <select
                id="guests"
                name="guests"
                value={formData.guests}
                onChange={handleChange}
                className="w-full my-input"
              >
                <option value="" disabled>
                  Select
                </option>
                {[1, 2, 3, 4, 5].map((num) => (
                  <option key={num} value={num}>
                    {num}
                  </option>
                ))}
              </select>
            </FormField>

            <button
              type="submit"
              className="w-full my-button"
            >
              Search
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
