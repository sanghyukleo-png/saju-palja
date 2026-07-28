import type { FortuneCategoryResult } from '../../data/dummyFortune';

export function FortuneGrid({ categories }: { categories: FortuneCategoryResult[] }) {
  return (
    <div className="fortune-grid">
      {categories.map((category) => (
        <div key={category.key} className="fortune-item">
          <h4>
            {category.emoji} {category.label}
          </h4>
          <span>{category.score}</span>
        </div>
      ))}
    </div>
  );
}
