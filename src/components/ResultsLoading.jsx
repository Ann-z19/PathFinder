import './ResultsLoading.css'

// Short pause shown once, right after the assessment, before the results appear.
// role="status" lets screen readers announce the message.
function ResultsLoading({ careerCount }) {
  return (
    <section className="results-loading" role="status">
      <div className="results-loading-spinner" aria-hidden="true" />
      <h1 className="results-loading-title">Finding your path…</h1>
      <p className="results-loading-copy">
        Matching your interests with {careerCount} careers.
      </p>
    </section>
  )
}

export default ResultsLoading
