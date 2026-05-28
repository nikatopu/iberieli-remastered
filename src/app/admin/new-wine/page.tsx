"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import Link from "next/link";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { useAdminAuth } from "../hooks";
import { AdminToastProvider, LoadingSpinner } from "../components";
import { createImagePreview, cleanupImagePreview, uploadImageToCloudinary } from "../utils/imageUpload";
import styles from "./page.module.scss";

function generateWineId(name: string): string {
  const slug = name
    .toLowerCase()
    .replace(/[^\w\s]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  const suffix = Math.random().toString(36).substring(2, 7);
  return `${slug}-${suffix}`;
}

export default function NewWinePage() {
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading } = useAdminAuth();
  const [isSaving, setIsSaving] = useState(false);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [grapeBlend, setGrapeBlend] = useState("");
  const [category, setCategory] = useState("");
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [visible, setVisible] = useState(true);
  const [cellarName, setCellarName] = useState("Iberieli");
  const [winemaker, setWinemaker] = useState("Zurab Topuridze");
  const [alcoholLevel, setAlcoholLevel] = useState("");
  const [inStock, setInStock] = useState(true);
  const [certification, setCertification] = useState("");
  const [vegan, setVegan] = useState(true);
  const [allergens, setAllergens] = useState(false);

  const [tastingNotes, setTastingNotes] = useState("");
  const [foodRecommendation, setFoodRecommendation] = useState("");
  const [climate, setClimate] = useState("");
  const [terroir, setTerroir] = useState("");
  const [viticulture, setViticulture] = useState("");
  const [organicFarming, setOrganicFarming] = useState("");
  const [yields, setYields] = useState("");

  const [harvest, setHarvest] = useState("");
  const [processing, setProcessing] = useState("");
  const [fermentation, setFermentation] = useState("");
  const [fermentationTime, setFermentationTime] = useState("");
  const [fermentationVessel, setFermentationVessel] = useState("");
  const [maceration, setMaceration] = useState("");
  const [macerationVessel, setMacerationVessel] = useState("");
  const [maturationTime, setMaturationTime] = useState("");
  const [maturationVessel, setMaturationVessel] = useState("");
  const [filtration, setFiltration] = useState("");
  const [fining, setFining] = useState("");
  const [sulphur, setSulphur] = useState("");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) cleanupImagePreview(previewUrl);
    };
  }, [previewUrl]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select an image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("Image must be less than 5MB");
        return;
      }
      if (previewUrl) cleanupImagePreview(previewUrl);
      setSelectedFile(file);
      setPreviewUrl(createImagePreview(file));
    } else {
      setSelectedFile(null);
      if (previewUrl) {
        cleanupImagePreview(previewUrl);
        setPreviewUrl(null);
      }
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    if (previewUrl) {
      cleanupImagePreview(previewUrl);
      setPreviewUrl(null);
    }
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleCategoryChange = (value: string) => {
    if (value === "custom") {
      setShowCustomCategory(true);
      setCategory("");
    } else {
      setShowCustomCategory(false);
      setCategory(value);
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    const finalCategory = showCustomCategory ? customCategory : category;
    if (!finalCategory) {
      toast.error("Please select or enter a category");
      return;
    }

    setIsSaving(true);
    const loadingToast = toast.loading("Creating wine...");

    try {
      const wineId = generateWineId(name);

      let imageUrl = "";
      if (selectedFile) {
        toast.loading("Uploading image...", { id: loadingToast });
        imageUrl = await uploadImageToCloudinary(selectedFile, wineId);
      }

      const response = await fetch("/api/admin/wines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          location: location.trim(),
          grapeBlend: grapeBlend.trim(),
          category: finalCategory,
          cellarName: cellarName.trim(),
          winemaker: winemaker.trim(),
          alcoholLevel: alcoholLevel.trim(),
          inStock,
          certification: certification.trim(),
          vegan,
          allergens,
          tastingNotes: tastingNotes.trim(),
          foodRecommendation: foodRecommendation.trim(),
          climate: climate.trim(),
          terroir: terroir.trim(),
          viticulture: viticulture.trim(),
          organicFarming: organicFarming.trim(),
          yields: yields.trim(),
          vinification: {
            harvest: harvest.trim(),
            processing: processing.trim(),
            fermentation: fermentation.trim(),
            fermentationTime: fermentationTime.trim(),
            fermentationVessel: fermentationVessel.trim(),
            maceration: maceration.trim(),
            macerationVessel: macerationVessel.trim(),
            maturationTime: maturationTime.trim(),
            maturationVessel: maturationVessel.trim(),
            filtration: filtration.trim(),
            fining: fining.trim(),
            sulphur: sulphur.trim(),
          },
          image: imageUrl,
          visible,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create wine");
      }

      toast.success("Wine created successfully!", { id: loadingToast });
      router.push("/admin/dashboard");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to create wine";
      toast.error(message, { id: loadingToast });
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading) {
    return <LoadingSpinner message="Verifying authentication..." />;
  }

  if (!isLoggedIn) {
    return <LoadingSpinner message="Redirecting to login..." />;
  }

  return (
    <>
      <div className={styles.page}>
        <div className="container">
          <div className={styles.pageHeader}>
            <Link href="/admin/dashboard" className={styles.backLink}>
              ← Back to Dashboard
            </Link>
            <h1 className={styles.pageTitle}>Add New Wine</h1>
            <p className={styles.pageSubtitle}>
              Fill in the details below to add a new wine to the collection.
            </p>
          </div>

          <div className={styles.formWrap}>
            <Card variant="elevated">
              <form onSubmit={handleSubmit} className={styles.form}>

                {/* 1. Image Upload */}
                <section className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Wine Image</h3>
                  <div className={styles.formGroup}>
                    {previewUrl && (
                      <div className={styles.imagePreview}>
                        <img src={previewUrl} alt="Preview" className={styles.previewImg} />
                      </div>
                    )}
                    <div className={styles.imageUpload}>
                      <input
                        ref={fileInputRef}
                        type="file"
                        id="image"
                        accept="image/*"
                        onChange={handleFileSelect}
                        className={styles.fileInput}
                        disabled={isSaving}
                      />
                      <div className={styles.imageUploadControls}>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={isSaving}
                        >
                          Choose Image
                        </Button>
                        {selectedFile && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={handleRemoveImage}
                            disabled={isSaving}
                            className={styles.removeButton}
                          >
                            Remove
                          </Button>
                        )}
                      </div>
                      {selectedFile && (
                        <small className={styles.fileInfo}>
                          {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
                        </small>
                      )}
                      <small className={styles.helpText}>
                        Supported formats: JPG, PNG, WebP. Max size: 5MB.
                      </small>
                    </div>
                  </div>
                </section>

                {/* 2. Visibility */}
                <section className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Visibility</h3>
                  <div className={styles.visibilityRow}>
                    <div className={styles.visibilityInfo}>
                      <span className={styles.visibilityLabel}>Show on public website</span>
                      <span className={styles.visibilityHint}>
                        When off, this wine will not appear on the public wines page.
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.toggleSwitch} ${visible ? styles.toggleOn : styles.toggleOff}`}
                      onClick={() => setVisible(!visible)}
                      disabled={isSaving}
                      aria-label={visible ? "Hide wine" : "Show wine"}
                    >
                      <span className={styles.toggleThumb} />
                    </button>
                  </div>
                </section>

                {/* 3–19. Main fields */}
                <section className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Basic Information</h3>

                  {/* 3. Name */}
                  <div className={styles.formGroup}>
                    <label htmlFor="name">Wine Name *</label>
                    <textarea
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={styles.textarea}
                      rows={1}
                      placeholder="Wine name..."
                      required
                      disabled={isSaving}
                    />
                  </div>

                  {/* 4. Summary */}
                  <div className={styles.formGroup}>
                    <label htmlFor="description">Summary *</label>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className={styles.textarea}
                      rows={3}
                      placeholder="Brief wine description for wine cards..."
                      required
                      disabled={isSaving}
                    />
                    <small className={styles.charCount}>{description.length} characters</small>
                  </div>

                  {/* 5. Cellar Name */}
                  <div className={styles.formGroup}>
                    <label htmlFor="cellarName">Cellar Name</label>
                    <textarea
                      id="cellarName"
                      value={cellarName}
                      onChange={(e) => setCellarName(e.target.value)}
                      className={styles.textarea}
                      rows={1}
                      placeholder="Iberieli"
                      disabled={isSaving}
                    />
                  </div>

                  {/* 6. Winemaker */}
                  <div className={styles.formGroup}>
                    <label htmlFor="winemaker">Winemaker</label>
                    <textarea
                      id="winemaker"
                      value={winemaker}
                      onChange={(e) => setWinemaker(e.target.value)}
                      className={styles.textarea}
                      rows={1}
                      placeholder="Zurab Topuridze"
                      disabled={isSaving}
                    />
                  </div>

                  <div className={styles.formRow}>
                    {/* 7. Grape Variety */}
                    <div className={styles.formGroup}>
                      <label htmlFor="grapeBlend">Grape Variety *</label>
                      <textarea
                        id="grapeBlend"
                        value={grapeBlend}
                        onChange={(e) => setGrapeBlend(e.target.value)}
                        className={styles.textarea}
                        rows={1}
                        placeholder="e.g., Saperavi, Rkatsiteli..."
                        required
                        disabled={isSaving}
                      />
                    </div>

                    {/* 8. Alcohol Level */}
                    <div className={styles.formGroup}>
                      <label htmlFor="alcoholLevel">Alcohol Level</label>
                      <textarea
                        id="alcoholLevel"
                        value={alcoholLevel}
                        onChange={(e) => setAlcoholLevel(e.target.value)}
                        className={styles.textarea}
                        rows={1}
                        placeholder="e.g., 12.5%"
                        disabled={isSaving}
                      />
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    {/* 9. Location */}
                    <div className={styles.formGroup}>
                      <label htmlFor="location">Location *</label>
                      <textarea
                        id="location"
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className={styles.textarea}
                        rows={1}
                        placeholder="e.g., Kakheti, Tsinandali..."
                        required
                        disabled={isSaving}
                      />
                    </div>

                    {/* Category select */}
                    <div className={styles.formGroup}>
                      <label htmlFor="category">Category *</label>
                      <select
                        id="category"
                        value={showCustomCategory ? "custom" : category}
                        onChange={(e) => handleCategoryChange(e.target.value)}
                        className={styles.select}
                        required
                        disabled={isSaving}
                      >
                        <option value="">Select category...</option>
                        <option value="red">Red</option>
                        <option value="white">White</option>
                        <option value="pink">Pink</option>
                        <option value="amber">Amber</option>
                        <option value="custom">+ Add new category</option>
                      </select>
                      {showCustomCategory && (
                        <textarea
                          id="customCategory"
                          value={customCategory}
                          onChange={(e) => setCustomCategory(e.target.value)}
                          className={`${styles.textarea} ${styles.customCategoryInput}`}
                          rows={1}
                          placeholder="Enter new category..."
                          aria-label="Custom category name"
                          required
                        />
                      )}
                    </div>
                  </div>

                  {/* 10. Certification */}
                  <div className={styles.formGroup}>
                    <label htmlFor="certification">Certification</label>
                    <textarea
                      id="certification"
                      value={certification}
                      onChange={(e) => setCertification(e.target.value)}
                      className={styles.textarea}
                      rows={2}
                      placeholder="Wine certifications..."
                      disabled={isSaving}
                    />
                  </div>

                  {/* 11. In Stock toggle */}
                  <div className={styles.toggleRow}>
                    <div className={styles.visibilityInfo}>
                      <span className={styles.visibilityLabel}>In Stock</span>
                      <span className={styles.visibilityHint}>
                        Toggle off if this wine is currently out of stock.
                      </span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.toggleSwitch} ${inStock ? styles.toggleOn : styles.toggleOff}`}
                      onClick={() => setInStock(!inStock)}
                      disabled={isSaving}
                      aria-label={inStock ? "Mark out of stock" : "Mark in stock"}
                    >
                      <span className={styles.toggleThumb} />
                    </button>
                  </div>

                  {/* 12. Vegan toggle */}
                  <div className={styles.toggleRow}>
                    <div className={styles.visibilityInfo}>
                      <span className={styles.visibilityLabel}>Vegan-friendly</span>
                      <span className={styles.visibilityHint}>Toggle on if this wine is vegan.</span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.toggleSwitch} ${vegan ? styles.toggleOn : styles.toggleOff}`}
                      onClick={() => setVegan(!vegan)}
                      disabled={isSaving}
                      aria-label={vegan ? "Not vegan" : "Vegan"}
                    >
                      <span className={styles.toggleThumb} />
                    </button>
                  </div>

                  {/* 13. Allergens toggle */}
                  <div className={styles.visibilityRow}>
                    <div className={styles.visibilityInfo}>
                      <span className={styles.visibilityLabel}>Contains Allergens</span>
                      <span className={styles.visibilityHint}>Toggle on if this wine contains allergens.</span>
                    </div>
                    <button
                      type="button"
                      className={`${styles.toggleSwitch} ${allergens ? styles.toggleOn : styles.toggleOff}`}
                      onClick={() => setAllergens(!allergens)}
                      disabled={isSaving}
                      aria-label={allergens ? "No allergens" : "Has allergens"}
                    >
                      <span className={styles.toggleThumb} />
                    </button>
                  </div>
                </section>

                {/* Tasting & Pairing */}
                <section className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Tasting & Pairing</h3>

                  {/* 14. Tasting Notes */}
                  <div className={styles.formGroup}>
                    <label htmlFor="tastingNotes">Tasting Notes *</label>
                    <textarea id="tastingNotes" value={tastingNotes} onChange={(e) => setTastingNotes(e.target.value)} className={styles.textarea} rows={6} placeholder="Detailed tasting notes with aromas, flavors, finish..." required disabled={isSaving} />
                    <small className={styles.charCount}>{tastingNotes.length} characters</small>
                  </div>

                  {/* 15. Food Pairing */}
                  <div className={styles.formGroup}>
                    <label htmlFor="foodRecommendation">Food Pairing</label>
                    <textarea id="foodRecommendation" value={foodRecommendation} onChange={(e) => setFoodRecommendation(e.target.value)} className={styles.textarea} rows={3} placeholder="Recommended food pairings..." disabled={isSaving} />
                  </div>
                </section>

                {/* Terroir & Viticulture */}
                <section className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Terroir & Viticulture</h3>

                  {/* 16. Microclimate */}
                  <div className={styles.formGroup}>
                    <label htmlFor="climate">Microclimate</label>
                    <textarea id="climate" value={climate} onChange={(e) => setClimate(e.target.value)} className={styles.textarea} rows={2} placeholder="Microclimate conditions..." disabled={isSaving} />
                  </div>

                  {/* 17. Terroir */}
                  <div className={styles.formGroup}>
                    <label htmlFor="terroir">Terroir</label>
                    <textarea id="terroir" value={terroir} onChange={(e) => setTerroir(e.target.value)} className={styles.textarea} rows={2} placeholder="Soil composition, terrain..." disabled={isSaving} />
                  </div>

                  {/* 18. Viticulture */}
                  <div className={styles.formGroup}>
                    <label htmlFor="viticulture">Viticulture</label>
                    <textarea id="viticulture" value={viticulture} onChange={(e) => setViticulture(e.target.value)} className={styles.textarea} rows={3} placeholder="Vineyard practices..." disabled={isSaving} />
                  </div>

                  {/* 19. Organic Farming */}
                  <div className={styles.formGroup}>
                    <label htmlFor="organicFarming">Organic Farming</label>
                    <textarea id="organicFarming" value={organicFarming} onChange={(e) => setOrganicFarming(e.target.value)} className={styles.textarea} rows={3} placeholder="Organic farming practices..." disabled={isSaving} />
                  </div>

                  {/* 20. Yields */}
                  <div className={styles.formGroup}>
                    <label htmlFor="yields">Yields</label>
                    <textarea id="yields" value={yields} onChange={(e) => setYields(e.target.value)} className={styles.textarea} rows={2} placeholder="Yield information..." disabled={isSaving} />
                  </div>
                </section>

                {/* 20. Vinification Process */}
                <section className={styles.formSection}>
                  <h3 className={styles.sectionTitle}>Vinification Process</h3>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="harvest">Harvest</label>
                      <textarea id="harvest" value={harvest} onChange={(e) => setHarvest(e.target.value)} className={styles.textarea} rows={2} placeholder="Harvest details..." disabled={isSaving} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="processing">Processing</label>
                      <textarea id="processing" value={processing} onChange={(e) => setProcessing(e.target.value)} className={styles.textarea} rows={2} placeholder="Processing methods..." disabled={isSaving} />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="fermentation">Fermentation</label>
                      <textarea id="fermentation" value={fermentation} onChange={(e) => setFermentation(e.target.value)} className={styles.textarea} rows={2} placeholder="Fermentation process..." disabled={isSaving} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="fermentationTime">Fermentation Time</label>
                      <textarea id="fermentationTime" value={fermentationTime} onChange={(e) => setFermentationTime(e.target.value)} className={styles.textarea} rows={2} placeholder="Duration..." disabled={isSaving} />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="fermentationVessel">Fermentation Vessel</label>
                      <textarea id="fermentationVessel" value={fermentationVessel} onChange={(e) => setFermentationVessel(e.target.value)} className={styles.textarea} rows={2} placeholder="Vessel type..." disabled={isSaving} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="maceration">Maceration</label>
                      <textarea id="maceration" value={maceration} onChange={(e) => setMaceration(e.target.value)} className={styles.textarea} rows={2} placeholder="Maceration details..." disabled={isSaving} />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="macerationVessel">Maceration Vessel</label>
                      <textarea id="macerationVessel" value={macerationVessel} onChange={(e) => setMacerationVessel(e.target.value)} className={styles.textarea} rows={2} placeholder="Vessel type..." disabled={isSaving} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="maturationTime">Maturation Time</label>
                      <textarea id="maturationTime" value={maturationTime} onChange={(e) => setMaturationTime(e.target.value)} className={styles.textarea} rows={2} placeholder="Aging duration..." disabled={isSaving} />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="maturationVessel">Maturation Vessel</label>
                      <textarea id="maturationVessel" value={maturationVessel} onChange={(e) => setMaturationVessel(e.target.value)} className={styles.textarea} rows={2} placeholder="Vessel type..." disabled={isSaving} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="filtration">Filtration</label>
                      <textarea id="filtration" value={filtration} onChange={(e) => setFiltration(e.target.value)} className={styles.textarea} rows={2} placeholder="Filtration process..." disabled={isSaving} />
                    </div>
                  </div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="fining">Fining</label>
                      <textarea id="fining" value={fining} onChange={(e) => setFining(e.target.value)} className={styles.textarea} rows={2} placeholder="Fining agents..." disabled={isSaving} />
                    </div>
                    <div className={styles.formGroup}>
                      <label htmlFor="sulphur">Sulphur</label>
                      <textarea id="sulphur" value={sulphur} onChange={(e) => setSulphur(e.target.value)} className={styles.textarea} rows={2} placeholder="Sulphur usage..." disabled={isSaving} />
                    </div>
                  </div>
                </section>

                {/* 21. Save + Cancel */}
                <div className={styles.formActions}>
                  <Button type="submit" disabled={isSaving} className={styles.saveButton}>
                    {isSaving ? "Creating..." : "Create Wine"}
                  </Button>
                  <Link href="/admin/dashboard">
                    <Button type="button" variant="outline" disabled={isSaving}>
                      Cancel
                    </Button>
                  </Link>
                </div>

              </form>
            </Card>
          </div>
        </div>
      </div>
      <AdminToastProvider />
    </>
  );
}
