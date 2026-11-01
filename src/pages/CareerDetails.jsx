import { useEffect, useState } from "react";
import { Link, useParams } from "react-router";
import { fetchCareer } from "../lib/onetProxy";
import { ArrowLeftIcon, CheckIcon } from "../components/Icons";
import occupationsData from "../data/occupations.json";
import "./CareerDetails.css";

const TABS = [
  { id: "overview", label: "Overview" },
  { id: "tasks", label: "Tasks" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "outlook", label: "Outlook" },
];
const usd = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

function CareerDetails() {
  const { code } = useParams();
  // The answer remembers which code it belongs to
  const [result, setResult] = useState({ code: null });
  const [activeTab, setActiveTab] = useState(TABS[0].id);

  useEffect(() => {
    let ignore = false;
    async function load() {
      const answer = await fetchCareer(code);
      if (!ignore) {
        setResult({ code: code, career: answer.career, error: answer.error });
      }
    }
    load();
    return () => {
      ignore = true;
    };
  }, [code]);

  const backLink = (
    <Link to="/results" className="career-back">
      <ArrowLeftIcon />
      Back to matches
    </Link>
  );

  if (result.code !== code) {
    return (
      <section className="career-details">
        {backLink}
        <p className="career-details-status">Loading…</p>
      </section>
    );
  }
  if (result.error) {
    //If the API failed: fall back to the basic info in the local database
    const local = occupationsData.occupations.find(
      (o) => o.code === result.code,
    );
    if (local) {
      return (
        <section className="career-details">
          {backLink}
          <header className="career-details-heading">
            <h1>{local.title}</h1>
            <p className="career-details-code">{code}</p>
          </header>
          <p className="career-details-notice">
            Full details could not be loaded right now. Showing limited basic
            info
          </p>
          <div className="career-details-overview">
            <h2>What You Would Do</h2>
            <p className="career-details-summary">{local.description}</p>
          </div>
        </section>
      );
    }

    //error page code if not in the local either
    return (
      <section className="career-details">
        {backLink}
        <p className="career-details-status">{result.error}</p>
      </section>
    );
  }

  const { career } = result;
  return (
    <section className="career-details">
      {backLink}

      <header className="career-details-heading">
        <h1>{career.title}</h1>
        <p className="career-details-code">{code}</p>
      </header>

      <div className="career-tabs" role="tablist" aria-label="Career sections">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            type="button"
            role="tab"
            aria-selected={activeTab === tab.id}
            className={
              activeTab === tab.id ? "career-tab is-active" : "career-tab"
            }
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="career-details-overview">
        {activeTab === "overview" && (
          <>
            <h2>What You Would Do</h2>
            <p className="career-details-summary">{career.what_they_do}</p>
          </>
        )}

        {activeTab === "tasks" && (
          <>
            <h3>Common tasks</h3>
            <ul className="career-task-list">
              {career.on_the_job?.map((task) => (
                <li key={task} className="career-task">
                  <span className="career-task-check">
                    <CheckIcon />
                  </span>
                  {task}
                </li>
              ))}
            </ul>
          </>
        )}

        {activeTab === "skills" && (
          <>
            <h2>Skills You'll Need</h2>
            {career.skills?.length > 0 ? (
              <>
                {career.skills.map((group) => (
                  <div key={group.id} className="career-skill-group">
                    <h3>{group.name}</h3>
                    <ul className="career-task-list">
                      {group.element.map((skill) => (
                        <li key={skill.id} className="career-task">
                          <span className="career-task-check">
                            <CheckIcon />
                          </span>
                          {skill.name}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </>
            ) : (
              <p className="career-details-status">
                Skills are not available right now.
              </p>
            )}
          </>
        )}

        {activeTab === "education" && (
          <>
            <h2>Education & Training</h2>
            {career.education ? (
              <>
                {career.education.education_usually_needed && (
                  <>
                    <h3>Usually needed</h3>
                    <ul className="career-task-list">
                      {career.education.education_usually_needed.map((item) => (
                        <li key={item} className="career-task">
                          <span className="career-task-check">
                            <CheckIcon />
                          </span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                <h3>{career.education.job_zone.title}</h3>
                <p className="career-fact">
                  <strong>Education: </strong>
                  {career.education.job_zone.education}
                </p>
                <p className="career-fact">
                  <strong>Experience: </strong>
                  {career.education.job_zone.experience}
                </p>
                <p className="career-fact">
                  <strong>Training: </strong>
                  {career.education.job_zone.training}
                </p>
              </>
            ) : (
              <p className="career-details-status">Education & Training info is not available right now.</p>
            )}
          </>
        )}

        {activeTab === "outlook" && (
          <>
            <h2>Job Outlook</h2>
            {career.job_outlook ? (
              <>
                <h3 className="career-outlook-category">{career.job_outlook.outlook.category}</h3>
                <p className="career-details-summary">{career.job_outlook.outlook.description}</p>
                {career.job_outlook.bright_outlook && (
                  <ul className="career-task-list">
                    {career.job_outlook.bright_outlook.map((item) => (
                      <li key={item.code} className="career-task">
                        <span className="career-task-check">
                          <CheckIcon />
                        </span>
                        {item.title}
                      </li>
                    ))}
                  </ul>
                )}
                {career.job_outlook.salary && (
                <>
                <h3>Salary Expectations</h3>
                <p className="career-salary-median">
                  <strong>Median Salary: </strong>
                  {usd.format(career.job_outlook.salary.annual_median)}
                </p>
                <p className="career-details-summary">
                    <strong>Range: </strong>
                    {usd.format(career.job_outlook.salary.annual_10th_percentile)} – {usd.format(career.job_outlook.salary.annual_90th_percentile)}
                </p>
                </>
                )}
              </>
            ) : (
              <p className="career-details-status">Job outlook info is not available right now.</p>
            )}
          </>
        )}
      </div>
    </section>
  );
}

export default CareerDetails;
