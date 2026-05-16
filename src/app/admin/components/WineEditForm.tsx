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

  const [sustainability, setSustainability] = useState(wine.sustainability);
  const [certification, setCertification] = useState(wine.certification);
  const [vegan, setVegan] = useState(wine.vegan);
  const [allergens, setAllergens] = useState(wine.allergens);

  const [tastingNotes, setTastingNotes] = useState(wine.tastingNotes);
  const [foodRecommendation, setFoodRecommendation] = useState(
    wine.foodRecommendation,
  );
  const [climate, setClimate] = useState(wine.climate);
  const [terroir, setTerroir] = useState(wine.terroir);
  const [viticulture, setViticulture] = useState(wine.viticulture);
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

  const handleSubmit = async (e: React.FormEvent) => {
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
      sustainability: sustainability.trim(),
      certification: certification.trim(),
      vegan,
      allergens,
      visible,
      tastingNotes: tastingNotes.trim(),
      foodRecommendation: foodRecommendation.trim(),
      climate: climate.trim(),
      terroir: terroir.trim(),
      viticulture: viticulture.trim(),
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
            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Basic Information</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="name">Wine Name *</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={styles.input}
                    placeholder="Wine name..."
                    required
                    disabled={isSaving}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="grapeBlend">Grape Blend *</label>
                  <input
                    type="text"
                    id="grapeBlend"
                    value={grapeBlend}
                    onChange={(e) => setGrapeBlend(e.target.value)}
                    className={styles.input}
                    placeholder="e.g., Saperavi, Rkatsiteli..."
                    required
                    disabled={isSaving}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className={styles.input}
                    placeholder="e.g., Kakheti, Tsinandali..."
                    required
                    disabled={isSaving}
                  />
                </div>
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
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="custom">+ Add new category</option>
                  </select>
                  {showCustomCategory && (
                    <input
                      type="text"
                      value={customCategory}
                      onChange={(e) => setCustomCategory(e.target.value)}
                      className={styles.input}
                      placeholder="Enter new category..."
                      required
                    />
                  )}
                </div>
              </div>
              <div className={styles.formGroup}>
                <label htmlFor="description">Short Description *</label>
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
                <small className={styles.charCount}>
                  {description.length} characters
                </small>
              </div>
            </section>

            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Visibility</h3>
              <div className={styles.visibilityRow}>
                <div className={styles.visibilityInfo}>
                  <span className={styles.visibilityLabel}>
                    Show on public website
                  </span>
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
                      Selected: {selectedFile.name} (
                      {Math.round(selectedFile.size / 1024)}KB)
                    </small>
                  )}
                  <small className={styles.helpText}>
                    Supported formats: JPG, PNG, WebP. Max size: 5MB.
                  </small>
                </div>
              </div>
            </section>

            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Quality & Certifications</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="sustainability">Sustainability</label>
                  <input
                    type="text"
                    id="sustainability"
                    value={sustainability}
                    onChange={(e) => setSustainability(e.target.value)}
                    className={styles.input}
                    placeholder="Sustainable practices..."
                    disabled={isSaving}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="certification">Certification</label>
                  <input
                    type="text"
                    id="certification"
                    value={certification}
                    onChange={(e) => setCertification(e.target.value)}
                    className={styles.input}
                    placeholder="Wine certifications..."
                    disabled={isSaving}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="vegan"
                      checked={vegan}
                      onChange={(e) => setVegan(e.target.checked)}
                      className={styles.checkbox}
                      disabled={isSaving}
                    />
                    <label htmlFor="vegan" className={styles.checkboxLabel}>
                      Vegan-friendly
                    </label>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <div className={styles.checkboxGroup}>
                    <input
                      type="checkbox"
                      id="allergens"
                      checked={allergens}
                      onChange={(e) => setAllergens(e.target.checked)}
                      className={styles.checkbox}
                      disabled={isSaving}
                    />
                    <label htmlFor="allergens" className={styles.checkboxLabel}>
                      Contains allergens
                    </label>
                  </div>
                </div>
              </div>
            </section>

            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Tasting & Pairing</h3>
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
                <small className={styles.charCount}>
                  {tastingNotes.length} characters
                </small>
              </div>
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

            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Terroir & Viticulture</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="climate">Climate</label>
                  <input
                    type="text"
                    id="climate"
                    value={climate}
                    onChange={(e) => setClimate(e.target.value)}
                    className={styles.input}
                    placeholder="Climate conditions..."
                    disabled={isSaving}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="terroir">Terroir</label>
                  <input
                    type="text"
                    id="terroir"
                    value={terroir}
                    onChange={(e) => setTerroir(e.target.value)}
                    className={styles.input}
                    placeholder="Soil composition, terrain..."
                    disabled={isSaving}
                  />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="viticulture">Viticulture</label>
                  <input
                    type="text"
                    id="viticulture"
                    value={viticulture}
                    onChange={(e) => setViticulture(e.target.value)}
                    className={styles.input}
                    placeholder="Vineyard practices..."
                    disabled={isSaving}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="yields">Yields</label>
                  <input
                    type="text"
                    id="yields"
                    value={yields}
                    onChange={(e) => setYields(e.target.value)}
                    className={styles.input}
                    placeholder="Yield information..."
                    disabled={isSaving}
                  />
                </div>
              </div>
            </section>

            <section className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Vinification Process</h3>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="harvest">Harvest</label>
                  <input type="text" id="harvest" value={harvest} onChange={(e) => setHarvest(e.target.value)} className={styles.input} placeholder="Harvest details..." disabled={isSaving} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="processing">Processing</label>
                  <input type="text" id="processing" value={processing} onChange={(e) => setProcessing(e.target.value)} className={styles.input} placeholder="Processing methods..." disabled={isSaving} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="fermentation">Fermentation</label>
                  <input type="text" id="fermentation" value={fermentation} onChange={(e) => setFermentation(e.target.value)} className={styles.input} placeholder="Fermentation process..." disabled={isSaving} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="fermentationTime">Fermentation Time</label>
                  <input type="text" id="fermentationTime" value={fermentationTime} onChange={(e) => setFermentationTime(e.target.value)} className={styles.input} placeholder="Duration..." disabled={isSaving} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="fermentationVessel">Fermentation Vessel</label>
                  <input type="text" id="fermentationVessel" value={fermentationVessel} onChange={(e) => setFermentationVessel(e.target.value)} className={styles.input} placeholder="Vessel type..." disabled={isSaving} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="maceration">Maceration</label>
                  <input type="text" id="maceration" value={maceration} onChange={(e) => setMaceration(e.target.value)} className={styles.input} placeholder="Maceration details..." disabled={isSaving} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="macerationVessel">Maceration Vessel</label>
                  <input type="text" id="macerationVessel" value={macerationVessel} onChange={(e) => setMacerationVessel(e.target.value)} className={styles.input} placeholder="Vessel type..." disabled={isSaving} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="maturationTime">Maturation Time</label>
                  <input type="text" id="maturationTime" value={maturationTime} onChange={(e) => setMaturationTime(e.target.value)} className={styles.input} placeholder="Aging duration..." disabled={isSaving} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="maturationVessel">Maturation Vessel</label>
                  <input type="text" id="maturationVessel" value={maturationVessel} onChange={(e) => setMaturationVessel(e.target.value)} className={styles.input} placeholder="Vessel type..." disabled={isSaving} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="filtration">Filtration</label>
                  <input type="text" id="filtration" value={filtration} onChange={(e) => setFiltration(e.target.value)} className={styles.input} placeholder="Filtration process..." disabled={isSaving} />
                </div>
              </div>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="fining">Fining</label>
                  <input type="text" id="fining" value={fining} onChange={(e) => setFining(e.target.value)} className={styles.input} placeholder="Fining agents..." disabled={isSaving} />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="sulphur">Sulphur</label>
                  <input type="text" id="sulphur" value={sulphur} onChange={(e) => setSulphur(e.target.value)} className={styles.input} placeholder="Sulphur usage..." disabled={isSaving} />
                </div>
              </div>
            </section>

            <div className={styles.formActions}>
              <Button type="submit" disabled={isSaving} className={styles.saveButton}>
                {isSaving ? "Saving..." : "Save All Changes"}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel} disabled={isSaving}>
                Cancel
              </Button>
            </div>

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
