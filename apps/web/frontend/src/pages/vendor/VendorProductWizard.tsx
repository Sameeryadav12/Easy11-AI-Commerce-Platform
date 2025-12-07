import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Loader2,
  Plus,
  Trash2,
  Wand2,
  Sparkles,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button, Card, CardBody, Badge, Input } from '../../components/ui';
import { useVendorProductStore } from '../../store/vendorProductStore';
import vendorProductAPI from '../../services/vendorProductAPI';
import type {
  MarginCalculation,
  AIValidationResult,
  SEOSuggestion,
  AIImageAnalysis,
  VendorProductFull,
} from '../../types/vendorProduct';
import type { VendorProduct } from '../../types/vendor';
import { AIValidationSummary } from '../../components/vendor/AIValidationSummary';

type WizardStep = 'basics' | 'pricing' | 'media' | 'seo' | 'review';

const steps: { id: WizardStep; title: string; description: string }[] = [
  { id: 'basics', title: 'Product basics', description: 'Titles, category and merchandising tags.' },
  { id: 'pricing', title: 'Pricing & inventory', description: 'Margins, stock rules and alerts.' },
  { id: 'media', title: 'Media & variants', description: 'Hero imagery and optional variant matrix.' },
  { id: 'seo', title: 'SEO & launch', description: 'Search metadata and visibility.' },
  { id: 'review', title: 'AI review', description: 'Validation results & next actions.' },
];

const categories = [
  { id: 'cat-electronics', label: 'Electronics · Audio' },
  { id: 'cat-home', label: 'Home & Living' },
  { id: 'cat-fashion', label: 'Fashion & Apparel' },
  { id: 'cat-beauty', label: 'Beauty & Wellness' },
];

interface VariantDraft {
  id: string;
  name: string;
  sku: string;
  price: number;
  cost_price: number;
  stock_quantity: number;
}

interface ImageDraft {
  url: string;
  alt: string;
  isPrimary?: boolean;
}

const slugify = (value: string) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function VendorProductWizard() {
  const navigate = useNavigate();
  const addProduct = useVendorProductStore((state) => state.addProduct);

  const [step, setStep] = useState<WizardStep>('basics');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [marginPreview, setMarginPreview] = useState<MarginCalculation | null>(null);
  const [marginLoading, setMarginLoading] = useState(false);

  const [createdProduct, setCreatedProduct] = useState<VendorProductFull | null>(null);
  const [validation, setValidation] = useState<AIValidationResult | undefined>();
  const [seoSuggestions, setSeoSuggestions] = useState<SEOSuggestion[] | undefined>();
  const [imageInsights, setImageInsights] = useState<AIImageAnalysis[] | undefined>();

  const [variants, setVariants] = useState<VariantDraft[]>([]);
  const [images, setImages] = useState<ImageDraft[]>([
    {
      url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=900&q=80',
      alt: 'Premium wireless headphones',
      isPrimary: true,
    },
  ]);

  const [form, setForm] = useState({
    name: '',
    slug: '',
    description: '',
    shortDescription: '',
    brand: '',
    categoryId: 'cat-electronics',
    tags: 'wireless, noise-cancelling, headphones',
    sku: '',
    barcode: '',
    costPrice: 0,
    sellPrice: 0,
    compareAtPrice: 0,
    stockQuantity: 0,
    lowStockThreshold: 10,
    allowBackorder: false,
    trackInventory: true,
    metaTitle: '',
    metaDescription: '',
    metaKeywords: 'wireless headphones, audio',
    focusKeyword: 'wireless headphones',
    visibility: 'public' as const,
  });

  const allTags = useMemo(
    () =>
      form.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter(Boolean),
    [form.tags]
  );

  const handleField = <K extends keyof typeof form>(field: K, value: (typeof form)[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddVariant = () => {
    setVariants((prev) => [
      ...prev,
      {
        id: `variant-${Date.now()}`,
        name: `Variant ${prev.length + 1}`,
        sku: `${form.sku || 'SKU'}-${prev.length + 1}`,
        price: form.sellPrice || 0,
        cost_price: form.costPrice || 0,
        stock_quantity: Math.max(0, Math.floor(form.stockQuantity / (prev.length + 1))),
      },
    ]);
  };

  const handleVariantChange = (variantId: string, field: keyof VariantDraft, value: string | number) => {
    setVariants((prev) =>
      prev.map((variant) =>
        variant.id === variantId
          ? {
              ...variant,
              [field]: typeof value === 'string' ? value : Number.isFinite(value) ? Number(value) : value,
            }
          : variant
      )
    );
  };

  const handleRemoveVariant = (variantId: string) => {
    setVariants((prev) => prev.filter((variant) => variant.id !== variantId));
  };

  const handleImageChange = (index: number, field: keyof ImageDraft, value: string | boolean) => {
    setImages((prev) =>
      prev.map((image, idx) =>
        idx === index
          ? {
              ...image,
              [field]: typeof value === 'boolean' ? value : value,
            }
          : field === 'isPrimary' && value === true
          ? { ...image, isPrimary: false }
          : image
      )
    );
  };

  const handleAddImage = () => {
    setImages((prev) => [
      ...prev,
      {
        url: '',
        alt: '',
        isPrimary: false,
      },
    ]);
  };

  const handleRemoveImage = (index: number) => {
    setImages((prev) => prev.filter((_, idx) => idx !== index));
  };

  useEffect(() => {
    if (form.name && !form.slug) {
      handleField('slug', slugify(form.name));
    }
  }, [form.name, form.slug]);

  useEffect(() => {
    let active = true;
    if (form.costPrice > 0 && form.sellPrice > 0) {
      setMarginLoading(true);
      vendorProductAPI
        .calculateMargin(form.costPrice, form.sellPrice)
        .then((result) => {
          if (active) {
            setMarginPreview(result);
          }
        })
        .finally(() => {
          if (active) setMarginLoading(false);
        });
    } else {
      setMarginPreview(null);
    }

    return () => {
      active = false;
    };
  }, [form.costPrice, form.sellPrice]);

  const currentStepIndex = steps.findIndex((item) => item.id === step);
  const goToStep = (nextStep: WizardStep) => setStep(nextStep);

  const goNext = () => {
    if (currentStepIndex < steps.length - 1) {
      setStep(steps[currentStepIndex + 1].id);
    }
  };

  const goPrevious = () => {
    if (currentStepIndex > 0) {
      setStep(steps[currentStepIndex - 1].id);
    } else {
      navigate('/vendor/products');
    }
  };

  const buildProductPayload = (): Partial<VendorProductFull> => {
    const now = new Date().toISOString();
    return {
      name: form.name,
      slug: form.slug || slugify(form.name),
      description: form.description,
      short_description: form.shortDescription,
      brand: form.brand,
      category_id: form.categoryId,
      tags: allTags,
      sku: form.sku || `SKU-${Date.now()}`,
      barcode: form.barcode,
      cost_price: form.costPrice,
      sell_price: form.sellPrice,
      compare_at_price: form.compareAtPrice || undefined,
      margin_percentage: marginPreview?.margin_percentage ?? 0,
      stock_quantity: form.stockQuantity,
      low_stock_threshold: form.lowStockThreshold,
      allow_backorder: form.allowBackorder,
      track_inventory: form.trackInventory,
      images: images
        .filter((image) => image.url)
        .map((image, index) => ({
          id: `img-${Date.now()}-${index}`,
          product_id: '',
          vendor_id: 'vendor-123',
          url: image.url,
          thumbnail_url: image.url,
          alt_text: image.alt || form.name,
          caption: '',
          is_primary: image.isPrimary ?? index === 0,
          sort_order: index,
          ai_tags: [],
          quality_score: 80,
          width: 1280,
          height: 720,
          file_size: 0,
          format: 'jpg',
          created_at: now,
        })),
      has_variants: variants.length > 0,
      variants:
        variants.length > 0
          ? variants.map((variant) => ({
              id: variant.id,
              vendor_product_id: '',
              name: variant.name,
              sku: variant.sku,
              price: variant.price,
              cost_price: variant.cost_price,
              stock_quantity: variant.stock_quantity,
              is_active: true,
              created_at: now,
              updated_at: now,
            }))
          : undefined,
      seo: {
        meta_title: form.metaTitle || form.name,
        meta_description: form.metaDescription || form.shortDescription,
        meta_keywords: form.metaKeywords.split(',').map((keyword) => keyword.trim()),
        focus_keyword: form.focusKeyword,
      },
      visibility: form.visibility,
      status: 'draft',
    };
  };

  const toVendorProductSummary = (product: VendorProductFull): VendorProduct => ({
    id: product.id,
    vendor_id: product.vendor_id,
    name: product.name,
    slug: product.slug,
    description: product.description,
    short_description: product.short_description,
    category: product.category_name || product.category_id,
    subcategory: product.subcategory_id,
    price: product.sell_price,
    compare_at_price: product.compare_at_price,
    cost_price: product.cost_price,
    sku: product.sku,
    barcode: product.barcode,
    stock_quantity: product.stock_quantity,
    low_stock_threshold: product.low_stock_threshold,
    allow_backorder: product.allow_backorder,
    images: product.images?.map((image) => image.url) ?? [],
    specifications: undefined,
    variants:
      product.variants?.map((variant) => ({
        id: variant.id,
        name: variant.name,
        sku: variant.sku,
        price: variant.price,
        stock_quantity: variant.stock_quantity,
        attributes: {
          ...(variant.color ? { color: variant.color } : {}),
          ...(variant.size ? { size: variant.size } : {}),
          ...(variant.material ? { material: variant.material } : {}),
          ...(variant.custom_attributes ?? {}),
        },
      })) ?? [],
    meta_title: product.seo?.meta_title,
    meta_description: product.seo?.meta_description,
    meta_keywords: product.seo?.meta_keywords,
    status: product.status === 'approved' ? 'active' : 'draft',
    visibility: product.visibility === 'public' ? 'public' : 'hidden',
    views_count: product.metrics?.views ?? 0,
    sales_count: product.metrics?.total_sales ?? 0,
    avg_rating: product.metrics?.avg_rating ?? 0,
    reviews_count: product.metrics?.reviews_count ?? 0,
    created_at: product.created_at,
    updated_at: product.updated_at,
    published_at: product.published_at,
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    setSubmitError(null);
    setValidation(undefined);
    setSeoSuggestions(undefined);
    setImageInsights(undefined);

    try {
      const payload = buildProductPayload();
      const product = await vendorProductAPI.createProduct('vendor-123', payload);
      const summary = toVendorProductSummary(product);
      addProduct(summary);
      setCreatedProduct(product);
      setStep('review');

      const [validationResponse] = await Promise.all([
        vendorProductAPI.validateProduct(product.id),
      ]);

      setValidation(validationResponse.validation);
      setSeoSuggestions(validationResponse.seo_suggestions);
      setImageInsights(validationResponse.image_analysis);
    } catch (error) {
      console.error(error);
      setSubmitError('We were unable to create the product. Please review the fields and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (step) {
      case 'basics':
        return (
          <Card>
            <CardBody className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-white">
                  Product identity
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Give shoppers the essentials they’ll see across search, PDPs and merchandising widgets.
                </p>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Product name"
                  placeholder="Premium Wireless Headphones"
                  value={form.name}
                  onChange={(event) => handleField('name', event.target.value)}
                  required
                />
                <Input
                  label="Slug"
                  placeholder="premium-wireless-headphones"
                  value={form.slug}
                  onChange={(event) => handleField('slug', slugify(event.target.value))}
                  helperText="Appears in URLs. Automatically generated from the name."
                />
              </div>
              <Input
                label="Short description"
                placeholder="High-fidelity wireless headphones with ANC and 30-hour battery life."
                value={form.shortDescription}
                onChange={(event) => handleField('shortDescription', event.target.value)}
              />
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="Brand"
                  placeholder="AudioTech Pro"
                  value={form.brand}
                  onChange={(event) => handleField('brand', event.target.value)}
                />
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Category
                  </label>
                  <select
                    className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400"
                    value={form.categoryId}
                    onChange={(event) => handleField('categoryId', event.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <Input
                  label="SKU"
                  placeholder="ATP-WH-001"
                  value={form.sku}
                  onChange={(event) => handleField('sku', event.target.value.toUpperCase())}
                  required
                />
                <Input
                  label="Barcode (optional)"
                  placeholder="1234567890123"
                  value={form.barcode}
                  onChange={(event) => handleField('barcode', event.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Rich description
                </label>
                <textarea
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 dark:focus:border-blue-400"
                  rows={5}
                  placeholder="Describe key benefits, standout features, and who this product is for."
                  value={form.description}
                  onChange={(event) => handleField('description', event.target.value)}
                />
              </div>
              <div>
                <Input
                  label="Tags (comma separated)"
                  placeholder="wireless, bluetooth, premium, noise-cancelling"
                  value={form.tags}
                  onChange={(event) => handleField('tags', event.target.value)}
                />
                {allTags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {allTags.map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </CardBody>
          </Card>
        );
      case 'pricing':
        return (
          <Card>
            <CardBody className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-white">
                  Pricing & inventory rules
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Set healthy margins and inventory alerts so Easy11 can automate replenishment.
                </p>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  label="Cost price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.costPrice}
                  onChange={(event) => handleField('costPrice', Number(event.target.value))}
                  required
                />
                <Input
                  label="Sell price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.sellPrice}
                  onChange={(event) => handleField('sellPrice', Number(event.target.value))}
                  required
                />
                <Input
                  label="Compare at price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.compareAtPrice}
                  onChange={(event) => handleField('compareAtPrice', Number(event.target.value))}
                  helperText="Optional — shows strike-through for promos."
                />
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <Input
                  label="Stock quantity"
                  type="number"
                  min="0"
                  value={form.stockQuantity}
                  onChange={(event) => handleField('stockQuantity', Number(event.target.value))}
                />
                <Input
                  label="Low stock threshold"
                  type="number"
                  min="0"
                  value={form.lowStockThreshold}
                  onChange={(event) => handleField('lowStockThreshold', Number(event.target.value))}
                />
                <div className="flex flex-col justify-end gap-2 rounded-lg border-2 border-gray-200 p-4 dark:border-gray-700">
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={form.allowBackorder}
                      onChange={(event) => handleField('allowBackorder', event.target.checked)}
                    />
                    Allow backorders when out of stock
                  </label>
                  <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                    <input
                      type="checkbox"
                      checked={form.trackInventory}
                      onChange={(event) => handleField('trackInventory', event.target.checked)}
                    />
                    Track inventory for this product
                  </label>
                </div>
              </div>

              {marginPreview && (
                <Card className="border border-blue-200 bg-blue-50/80 dark:border-blue-900/40 dark:bg-blue-900/20">
                  <CardBody className="grid gap-4 md:grid-cols-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-blue-500 dark:text-blue-300">
                        Margin
                      </p>
                      <p className="text-lg font-heading font-semibold text-blue-900 dark:text-blue-100">
                        {marginPreview.margin_percentage.toFixed(1)}% ({marginPreview.margin_amount.toFixed(2)} AUD)
                      </p>
                      <p className="text-xs text-blue-800/80 dark:text-blue-200/80">
                        Markup {marginPreview.markup_percentage.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-blue-500 dark:text-blue-300">
                        Suggested price range
                      </p>
                      <p className="text-sm text-blue-900 dark:text-blue-100">
                        Min {marginPreview.suggested_price_range.min.toFixed(2)} · Optimal{' '}
                        {marginPreview.suggested_price_range.optimal.toFixed(2)} · Max{' '}
                        {marginPreview.suggested_price_range.max.toFixed(2)}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-blue-500 dark:text-blue-300">
                        Break even units
                      </p>
                      <p className="text-lg font-heading font-semibold text-blue-900 dark:text-blue-100">
                        {marginPreview.break_even_units}
                      </p>
                    </div>
                  </CardBody>
                </Card>
              )}
              {marginLoading && (
                <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                  <Loader2 className="h-4 w-4 animate-spin" /> recalculating margin…
                </div>
              )}
            </CardBody>
          </Card>
        );
      case 'media':
        return (
          <Card>
            <CardBody className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-white">
                  Media & variants
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Showcase the product and optionally configure variants (e.g. colourways, sizes).
                </p>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                    Media
                  </h3>
                  <Button variant="secondary" size="sm" onClick={handleAddImage}>
                    <Plus className="h-4 w-4" />
                    Add image
                  </Button>
                </div>
                <div className="mt-4 space-y-4">
                  {images.map((image, index) => (
                    <div
                      key={`image-${index}`}
                      className="grid gap-4 rounded-xl border border-gray-200 p-4 md:grid-cols-[1fr,1fr,auto] dark:border-gray-700"
                    >
                      <Input
                        label="Image URL"
                        value={image.url}
                        onChange={(event) => handleImageChange(index, 'url', event.target.value)}
                        placeholder="https://…"
                      />
                      <Input
                        label="Alt text"
                        value={image.alt}
                        onChange={(event) => handleImageChange(index, 'alt', event.target.value)}
                        placeholder="Premium wireless headphones in black"
                      />
                      <div className="flex flex-col items-start justify-between gap-3">
                        <label className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                          <input
                            type="radio"
                            name="primary-image"
                            checked={image.isPrimary ?? index === 0}
                            onChange={() => handleImageChange(index, 'isPrimary', true)}
                          />
                          Use as primary image
                        </label>
                        {images.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleRemoveImage(index)}
                            className="text-red-500 hover:text-red-600"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between gap-3">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.3em] text-gray-500 dark:text-gray-400">
                    Variants (optional)
                  </h3>
                  <Button variant="secondary" size="sm" onClick={handleAddVariant}>
                    <Plus className="h-4 w-4" />
                    Add variant
                  </Button>
                </div>
                {variants.length === 0 && (
                  <p className="mt-3 rounded-lg border border-dashed border-gray-300 p-4 text-sm text-gray-500 dark:border-gray-700 dark:text-gray-400">
                    Add variants if you sell multiple colours, sizes or bundles. Otherwise skip this step.
                  </p>
                )}
                <div className="mt-4 space-y-4">
                  {variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="grid gap-4 rounded-xl border border-gray-200 p-4 md:grid-cols-5 dark:border-gray-700"
                    >
                      <Input
                        label="Variant name"
                        value={variant.name}
                        onChange={(event) => handleVariantChange(variant.id, 'name', event.target.value)}
                      />
                      <Input
                        label="SKU"
                        value={variant.sku}
                        onChange={(event) => handleVariantChange(variant.id, 'sku', event.target.value)}
                      />
                      <Input
                        label="Price"
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.price}
                        onChange={(event) =>
                          handleVariantChange(variant.id, 'price', Number(event.target.value))
                        }
                      />
                      <Input
                        label="Cost"
                        type="number"
                        min="0"
                        step="0.01"
                        value={variant.cost_price}
                        onChange={(event) =>
                          handleVariantChange(variant.id, 'cost_price', Number(event.target.value))
                        }
                      />
                      <div className="flex items-end justify-between gap-3">
                        <Input
                          label="Stock"
                          type="number"
                          min="0"
                          value={variant.stock_quantity}
                          onChange={(event) =>
                            handleVariantChange(variant.id, 'stock_quantity', Number(event.target.value))
                          }
                        />
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveVariant(variant.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
          </Card>
        );
      case 'seo':
        return (
          <Card>
            <CardBody className="space-y-6">
              <div>
                <h2 className="text-xl font-heading font-semibold text-gray-900 dark:text-white">
                  SEO & launch settings
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Optimise how Easy11 surfaces this product across search, marketing and shoppers’ feeds.
                </p>
              </div>
              <Input
                label="Meta title"
                value={form.metaTitle}
                onChange={(event) => handleField('metaTitle', event.target.value)}
                helperText="Ideal: 50–60 characters with primary keyword near the front."
              />
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Meta description
                </label>
                <textarea
                  rows={4}
                  className="w-full rounded-lg border-2 border-gray-300 bg-white px-4 py-3 text-gray-900 transition focus:border-blue focus:outline-none focus:ring-4 focus:ring-blue-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100"
                  value={form.metaDescription}
                  onChange={(event) => handleField('metaDescription', event.target.value)}
                />
                <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Aim for ~155 characters summarising benefits and differentiators.
                </p>
              </div>
              <Input
                label="Meta keywords (comma separated)"
                value={form.metaKeywords}
                onChange={(event) => handleField('metaKeywords', event.target.value)}
              />
              <Input
                label="Focus keyword"
                value={form.focusKeyword}
                onChange={(event) => handleField('focusKeyword', event.target.value)}
              />
              <div className="rounded-lg border-2 border-gray-200 p-4 dark:border-gray-700">
                <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="visibility"
                    value="public"
                    checked={form.visibility === 'public'}
                    onChange={() => handleField('visibility', 'public')}
                  />
                  Public — immediately available for shoppers once approved.
                </label>
                <label className="mt-2 flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                  <input
                    type="radio"
                    name="visibility"
                    value="hidden"
                    checked={form.visibility === 'hidden'}
                    onChange={() => handleField('visibility', 'hidden')}
                  />
                  Hidden — keep in draft while AI checks and merchandising are in progress.
                </label>
              </div>
            </CardBody>
          </Card>
        );
      case 'review':
        return (
          <div className="space-y-6">
            <Card>
              <CardBody className="space-y-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-500 dark:text-emerald-300">
                      Product created
                    </p>
                    <h2 className="text-2xl font-heading font-semibold text-gray-900 dark:text-white">
                      {createdProduct?.name ?? 'Product draft'}
                    </h2>
                  </div>
                  <Badge variant="success" size="sm" className="flex items-center gap-1">
                    <CheckCircle2 className="h-4 w-4" />
                    Draft saved
                  </Badge>
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Your product draft is saved. Review AI validation to boost approval chances, then submit for
                  review when ready.
                </p>
                <div className="flex flex-wrap gap-3">
                  <Button variant="primary" onClick={() => navigate('/vendor/products')}>
                    Back to product catalog
                  </Button>
                  <Button variant="secondary">Submit for marketplace review</Button>
                </div>
              </CardBody>
            </Card>

            <AIValidationSummary
              validation={validation}
              seoSuggestions={seoSuggestions}
              imageInsights={imageInsights}
            />
          </div>
        );
      default:
        return null;
    }
  };

  const isFinalStep = step === 'seo';
  const isReviewStep = step === 'review';

  return (
    <div className="container-custom py-10 space-y-8">
      <div className="flex items-center justify-between gap-4">
        <div className="space-y-2">
          <button
            className="flex items-center gap-2 text-sm font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-300"
            onClick={() => navigate('/vendor/products')}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to product list
          </button>
          <h1 className="text-3xl font-heading font-bold text-gray-900 dark:text-white">
            Launch a new product
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Guided wizard with AI assistance for quality, compliance and go-to-market readiness.
          </p>
        </div>
        <Badge variant="info" size="sm" className="flex items-center gap-2">
          <Sparkles className="h-4 w-4" />
          Sprint 8 — Product Intelligence
        </Badge>
      </div>

      <div className="grid gap-6 lg:grid-cols-[260px,1fr]">
        <aside className="space-y-4">
          {steps.map((item, index) => {
            const isActive = item.id === step;
            const isComplete = index < currentStepIndex || (createdProduct && item.id === 'review');
            return (
              <motion.button
                key={item.id}
                whileHover={{ x: 2 }}
                onClick={() => {
                  if (createdProduct || index <= currentStepIndex) {
                    goToStep(item.id);
                  }
                }}
                className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                  isActive
                    ? 'border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/30'
                    : 'border-gray-200 bg-white hover:border-blue-200 dark:border-gray-700 dark:bg-gray-900'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-[0.3em] text-gray-400">
                    Step {index + 1}
                  </span>
                  {isComplete && <CheckCircle2 className="h-4 w-4 text-emerald-500" />}
                </div>
                <p
                  className={`mt-1 text-sm font-semibold ${
                    isActive ? 'text-blue-600 dark:text-blue-300' : 'text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {item.title}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
              </motion.button>
            );
          })}
        </aside>

        <main className="space-y-6">
          {submitError && (
            <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200">
              {submitError}
            </div>
          )}
          {renderStep()}

          {!isReviewStep && (
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Button variant="secondary" onClick={goPrevious} className="flex items-center gap-2">
                <ArrowLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-3">
                {isFinalStep ? (
                  <Button
                    variant="primary"
                    className="flex items-center gap-2"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating product…
                      </>
                    ) : (
                      <>
                        <Wand2 className="h-4 w-4" />
                        Create draft & run AI checks
                      </>
                    )}
                  </Button>
                ) : (
                  <Button variant="primary" onClick={goNext} className="flex items-center gap-2">
                    Next
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}


