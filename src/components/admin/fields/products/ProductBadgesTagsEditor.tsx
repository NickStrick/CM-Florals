'use client';

type LocalProduct = {
  _id: string;
  badges: string[];
  tags: string[];
};

export default function ProductBadgesTagsEditor({
  product,
  onUpdate,
}: {
  product: LocalProduct;
  onUpdate: (patch: Partial<LocalProduct>) => void;
}) {
  // badges
  const addBadge = () => onUpdate({ badges: [...(product.badges ?? []), ''] });
  const updateBadge = (idx: number, value: string) => {
    const next = (product.badges ?? []).slice();
    next[idx] = value;
    onUpdate({ badges: next });
  };
  const removeBadge = (idx: number) =>
    onUpdate({ badges: (product.badges ?? []).filter((_, i) => i !== idx) });

  // tags
  const addTag = () => onUpdate({ tags: [...(product.tags ?? []), ''] });
  const updateTag = (idx: number, value: string) => {
    const next = (product.tags ?? []).slice();
    next[idx] = value;
    onUpdate({ tags: next });
  };
  const removeTag = (idx: number) =>
    onUpdate({ tags: (product.tags ?? []).filter((_, i) => i !== idx) });

  return (
    <div className="grid md:grid-cols-2 gap-3">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Badges</label>
          <button className="btn btn-ghost" onClick={addBadge}>Add badge</button>
        </div>
        <div className="space-y-2">
          {(product.badges ?? []).map((b, bi) => (
            <div key={`${product._id}-badge-${bi}`} className="grid grid-cols-[1fr_auto] gap-2">
              <input
                className="input"
                value={b}
                onChange={(e) => updateBadge(bi, e.target.value)}
                placeholder="e.g., New, Bestseller"
              />
              <button className="btn btn-ghost" onClick={() => removeBadge(bi)}>
                Remove
              </button>
            </div>
          ))}
          {(product.badges ?? []).length === 0 && (
            <div className="text-sm text-muted">No badges yet. Click “Add badge”.</div>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium">Tags</label>
          <button className="btn btn-ghost" onClick={addTag}>Add tag</button>
        </div>
        <div className="space-y-2">
          {(product.tags ?? []).map((t, ti) => (
            <div key={`${product._id}-tag-${ti}`} className="grid grid-cols-[1fr_auto] gap-2">
              <input
                className="input"
                value={t}
                onChange={(e) => updateTag(ti, e.target.value)}
                placeholder="e.g., bouquet, gift"
              />
              <button className="btn btn-ghost" onClick={() => removeTag(ti)}>
                Remove
              </button>
            </div>
          ))}
          {(product.tags ?? []).length === 0 && (
            <div className="text-sm text-muted">No tags yet. Click “Add tag”.</div>
          )}
        </div>
      </div>
    </div>
  );
}
