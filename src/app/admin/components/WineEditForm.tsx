import { useState, useRef, useEffect } from "react";
import toast from "react-hot-toast";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import { IWine } from "@/data/types";
import { createImagePreview, cleanupImagePreview } from "../utils/imageUpload";
import DeleteConfirmModal from "./DeleteConfirmModal";
import styles from "./WineEditForm.module.scss";

interface WineEditFormProps {
  wine: IWine;
  onSave: (wineData: Partial<IWine>, imageFile?: File) => Promise<void>;
  onCancel: () => void;
  onDelete: (wineId: string) => Promise<void>;
  isSaving: boolean;
  existingCategories?: string[];
}

export default function WineEditForm({
  wine,
  onSave,
  onCancel,
  onDelete,
  isSaving,
  existingCategories = ["red", "white", "pink", "amber"],
}: WineEditFormProps) {
  const [name, setName] = useState(wine.name);
  const [description, setDescription] = useState(wine.description);
  const [location, setLocation] = useState(wine.location);
  const [grapeBlend, setGrapeBlend] = useState(wine.grapeBlend);
  const [category, setCategory] = useState<string>(wine.category);
  const [customCategory, setCustomCategory] = useState("");
  const [showCustomCategory, setShowCustomCategory] = useState(false);
  const [visible, setVisible] = useState(wine.visible);
  const [cellarName, setCellarName] = useState(wine.cellarName ?? "Iberieli");
  const [winemaker, setWinemaker] = useState(wine.winemaker ?? "Zurab Topuridze");
  const [alcoholLevel, setAlcoholLevel] = useState(wine.alcoholLevel ?? "");
  const [inStock, setInStock] = useState(wine.inStock ?? true);
  const [certification, setCertification] = useState(wine.certification);
  const [vegan, setVegan] = useState(wine.vegan);
  const [allergens, setAllergens] = useState(wine.allergens);
  const [tastingNotes, setTastingNotes] = useState(wine.tastingNotes);
  const [foodRecommendation, setFoodRecommendation] = useState(wine.foodRecommendation);
  const [climate, setClimate] = useState(wine.climate);
  const [terroir, setTerroir] = useState(wine.terroir);
  const [viticulture, setViticulture] = useState(wine.viticulture);
  const [organicFarming, setOrganicFarming] = useState(wine.organicFarming);
  const [yields, setYields] = useState(wine.yields);

  const [harvest, setHarvest] = useState(wine.vinification?.harvest || "");
  const [processing, setProcessing] = useState(wine.vinification?.processing || "");
  const [fermentation, setFermentation] = useState(wine.vinification?.fermentation || "");
  const [fermentationTime, setFermentationTime] = useState(wine.vinification?.fermentationTime || "");
  const [fermentationVessel, setFermentationVessel] = useState(wine.vinification?.fermentationVessel || "");
  const [maceration, setMaceration] = useState(wine.vinification?.maceration || "");
  const [macerationVessel, setMacerationVessel] = useState(wine.vinification?.macerationVessel || "");
  const [maturationTime, setMaturationTime] = useState(wine.vinification?.maturationTime || "");
  const [maturationVessel, setMaturationVessel] = useState(wine.vinification?.maturationVessel || "");
  const [filtration, setFiltration] = useState(wine.vinification?.filtration || "");
  const [fining, setFining] = useState(wine.vinification?.fining || "");
  const [sulphur, setSulphur] = useState(wine.vinification?.sulphur || "");

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setCategory(value as "red" | "white" | "pink" | "amber");
    }
  };

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const finalCategory = showCustomCategory ? customCategory : category;
    if (!finalCategory) {
      toast.error("Please select or enter a category");
      return;
    }

    const wineData: Partial<IWine> = {
      name: name.trim(),
      description: description.trim(),
      location: location.trim(),
      grapeBlend: grapeBlend.trim(),
      category: finalCategory as "red" | "white" | "pink" | "amber",
      cellarName: cellarName.trim(),
      winemaker: winemaker.trim(),
      alcoholLevel: alcoholLevel.trim() || null,
      inStock,
      certification: certification.trim(),
      vegan,
      allergens,
      visible,
      tastingNotes: tastingNotes.trim(),
      foodRecommendation: foodRecommendation.trim(),
      climate: climate.trim(),
      terroir: terroir.trim(),
      viticulture: viticulture.trim(),
      organicFarming: organicFarming?.trim() || null,
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
    };

    await onSave(wineData, selectedFile || undefined);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(wine.id);
    } catch {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <>
      {showDeleteModal && (
        <DeleteConfirmModal
          wineName={wine.name}
          onConfirm={handleConfirmDelete}
          onAbort={() => setShowDeleteModal(false)}
          isDeleting={isDeleting}
        />
      )}

      <div className={styles.editForm}>
        <Card variant="elevated">
          <div className={styles.editHeader}>
            <div className={styles.winePreview}>
              <div className={styles.imageContainer}>
                <img
                  src={previewUrl || wine.image}
                  alt={wine.name}
                  className={styles.previewImage}
                />
                {previewUrl && (
                  <div className={styles.previewBadge}>New Image</div>
                )}
              </div>
              <div>
                <h2>Edit Wine: {name}</h2>
                <p className={styles.grapeInfo}>{grapeBlend}</p>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>

            {/* 1. Image Upload */}
            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Wine Image</h3>
              <div className={styles.formGroup}>
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
                      Choose New Image
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
                      Selected: {selectedFile.name} ({Math.round(selectedFile.size / 1024)}KB)
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

            {/* 3–16. Main fields */}
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

              {/* 4. Summary/Description */}
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

                {/* Category select (kept as select) */}
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
                    {existingCategories.map((cat) => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
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
                <textarea
                  id="tastingNotes"
                  value={tastingNotes}
                  onChange={(e) => setTastingNotes(e.target.value)}
                  className={styles.textarea}
                  rows={6}
                  placeholder="Detailed tasting notes with aromas, flavors, finish..."
                  required
                  disabled={isSaving}
                />
                <small className={styles.charCount}>{tastingNotes.length} characters</small>
              </div>

              {/* 15. Food Pairing */}
              <div className={styles.formGroup}>
                <label htmlFor="foodRecommendation">Food Pairing</label>
                <textarea
                  id="foodRecommendation"
                  value={foodRecommendation}
                  onChange={(e) => setFoodRecommendation(e.target.value)}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Recommended food pairings..."
                  disabled={isSaving}
                />
              </div>
            </section>

            {/* Terroir & Viticulture */}
            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Terroir & Viticulture</h3>

              {/* 16. Microclimate */}
              <div className={styles.formGroup}>
                <label htmlFor="climate">Microclimate</label>
                <textarea
                  id="climate"
                  value={climate}
                  onChange={(e) => setClimate(e.target.value)}
                  className={styles.textarea}
                  rows={2}
                  placeholder="Microclimate conditions..."
                  disabled={isSaving}
                />
              </div>

              {/* 17. Terroir */}
              <div className={styles.formGroup}>
                <label htmlFor="terroir">Terroir</label>
                <textarea
                  id="terroir"
                  value={terroir}
                  onChange={(e) => setTerroir(e.target.value)}
                  className={styles.textarea}
                  rows={2}
                  placeholder="Soil composition, terrain..."
                  disabled={isSaving}
                />
              </div>

              {/* 18. Viticulture */}
              <div className={styles.formGroup}>
                <label htmlFor="viticulture">Viticulture</label>
                <textarea
                  id="viticulture"
                  value={viticulture}
                  onChange={(e) => setViticulture(e.target.value)}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Vineyard practices..."
                  disabled={isSaving}
                />
              </div>

              {/* 19. Organic Farming */}
              <div className={styles.formGroup}>
                <label htmlFor="organicFarming">Organic Farming</label>
                <textarea
                  id="organicFarming"
                  value={organicFarming || ""}
                  onChange={(e) => setOrganicFarming(e.target.value)}
                  className={styles.textarea}
                  rows={3}
                  placeholder="Organic farming practices..."
                  disabled={isSaving}
                />
              </div>

              {/* 20. Yields */}
              <div className={styles.formGroup}>
                <label htmlFor="yields">Yields</label>
                <textarea
                  id="yields"
                  value={yields}
                  onChange={(e) => setYields(e.target.value)}
                  className={styles.textarea}
                  rows={2}
                  placeholder="Yield information..."
                  disabled={isSaving}
                />
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
                {isSaving ? "Saving..." : "Save All Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
                Cancel
              </Button>
            </div>

            {/* 22. Danger Zone */}
            <div className={styles.dangerZone}>
              <h3 className={styles.dangerTitle}>Danger Zone</h3>
              <div className={styles.dangerContent}>
                <div>
                  <p className={styles.dangerLabel}>Delete this wine</p>
                  <p className={styles.dangerHint}>
                    Permanently removes all data for this wine. This cannot be undone.
                  </p>
                </div>
                <button
                  type="button"
                  className={styles.deleteButton}
                  onClick={() => setShowDeleteModal(true)}
                  disabled={isSaving}
                >
                  Delete Wine
                </button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
}
