import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ImagePlus } from "lucide-react";
import { createProperty } from "../utils/api";
import { Alert } from "../components/ui/Feedback";
import Button from "../components/ui/Button";
import Field, { inputClasses } from "../components/ui/Field";

const Post = () => {
  const [property, setProperty] = useState({
    title: "",
    description: "",
    location: "",
    price: "",
    bedrooms: "",
    bathrooms: "",
  });
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProperty({ ...property, [name]: value });
  };

  const handleFileChange = (e) => {
    setSelectedFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const formData = new FormData();
    selectedFiles.forEach((file) => formData.append("images", file));
    formData.append("title", property.title);
    formData.append("description", property.description);
    formData.append("location", property.location);
    formData.append("price", property.price);
    if (property.bedrooms) formData.append("bedrooms", property.bedrooms);
    if (property.bathrooms) formData.append("bathrooms", property.bathrooms);

    setSubmitting(true);
    try {
      await createProperty(formData);
      setSuccess("Property posted successfully!");
      setProperty({ title: "", description: "", location: "", price: "", bedrooms: "", bathrooms: "" });
      setSelectedFiles([]);
      setTimeout(() => navigate("/my-listings"), 1000);
    } catch (err) {
      setError(err.response?.data?.message || "Error posting property.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-2xl px-5 py-12 sm:px-0">
      <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-brass">List a property</span>
      <h1 className="mt-1 font-display text-4xl font-semibold text-ink">Post a property</h1>
      <p className="mt-2 text-ink-soft">Fill in the details below — it'll appear on the Rent page right away.</p>

      <div className="mt-8 rounded-2xl border border-ink/10 bg-paper p-7 shadow-sm">
        {error && <div className="mb-4"><Alert kind="error">{error}</Alert></div>}
        {success && <div className="mb-4"><Alert kind="success">{success}</Alert></div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <Field label="Property name">
            <input
              name="title"
              className={inputClasses}
              value={property.title}
              onChange={handleInputChange}
              placeholder="e.g. Sunlit 2BHK near Downtown"
              required
            />
          </Field>
          <Field label="Description">
            <textarea
              name="description"
              rows={4}
              className={inputClasses}
              value={property.description}
              onChange={handleInputChange}
              required
            />
          </Field>
          <Field label="Location">
            <input
              name="location"
              className={inputClasses}
              value={property.location}
              onChange={handleInputChange}
              placeholder="Neighborhood, city"
              required
            />
          </Field>

          <div className="grid grid-cols-3 gap-4">
            <Field label="Rent ($/mo)">
              <input
                type="number"
                name="price"
                className={inputClasses}
                value={property.price}
                onChange={handleInputChange}
                required
              />
            </Field>
            <Field label="Bedrooms">
              <input
                type="number"
                name="bedrooms"
                className={inputClasses}
                value={property.bedrooms}
                onChange={handleInputChange}
              />
            </Field>
            <Field label="Bathrooms">
              <input
                type="number"
                name="bathrooms"
                className={inputClasses}
                value={property.bathrooms}
                onChange={handleInputChange}
              />
            </Field>
          </div>

          <Field label="Photos">
            <label
              htmlFor="images"
              className="flex cursor-pointer items-center justify-center gap-2 rounded-lg border border-dashed border-ink/25 px-4 py-6 text-sm text-ink-soft hover:border-brass hover:text-ink"
            >
              <ImagePlus size={18} />
              {selectedFiles.length > 0 ? `${selectedFiles.length} photo(s) selected` : "Click to upload photos"}
            </label>
            <input
              id="images"
              type="file"
              multiple
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
          </Field>

          <Button type="submit" variant="primary" className="w-full" disabled={submitting}>
            {submitting ? "Posting..." : "Post property"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default Post;
