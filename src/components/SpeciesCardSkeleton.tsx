import "./SpeciesCardSkeleton.css";

function SpeciesCardSkeleton() {
  return (
    <article className="species-card-skeleton">
      <div className="skeleton-image-area">
        <div className="skeleton-block skeleton-image"></div>
      </div>
      <section className="skeleton-about-area">
        <div className="skeleton-block skeleton-heading"></div>
        <div className="skeleton-block skeleton-paragraph"></div>
      </section>
      <div className="skeleton-details-area">
        <div className="skeleton-details-header">
          <div className="skeleton-block skeleton-title"></div>
          <div className="skeleton-block skeleton-scientific-name"></div>
        </div>
        <div className="skeleton-detail-group">
          <div className="skeleton-block skeleton-heading"></div>
          <div className="skeleton-block skeleton-text"></div>
        </div>
        <div className="skeleton-detail-group">
          <div className="skeleton-block skeleton-heading"></div>
          <div className="skeleton-block skeleton-text"></div>
        </div>
        <div className="skeleton-detail-group">
          <div className="skeleton-block skeleton-heading"></div>
          <div className="skeleton-block skeleton-text"></div>
        </div>
      </div>
      <section className="skeleton-taxonomy-area">
        <div className="skeleton-block skeleton-taxonomy-heading"></div>
        <div className="skeleton-taxonomy-list">
          {Array.from({ length: 7 }).map((_, index) => (
            <div className="skeleton-taxonomy-item" key={index}>
              <div className="skeleton-block skeleton-taxonomy-rank"></div>
              <div className="skeleton-block skeleton-taxonomy-name"></div>
            </div>
          ))}
        </div>
      </section>
    </article>
  );
}

export default SpeciesCardSkeleton;
