import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHandsHelping, faCalendarCheck, faComments } from "@fortawesome/free-solid-svg-icons";

export default function CounselorPortal({ user }) {
  return (
    <div className="counselor-portal">
      <div className="counselor-hero">
        <div>
          <p className="counselor-pill">Peer counselor preview</p>
          <h1>Hi {user?.name || "Counselor"}, your dedicated workspace is on the way.</h1>
          <p>
            You already have access to chat, peer support, and appointments while we finish the
            specialized counselor dashboard. Expect scheduling insights, student cohorts, and
            shared reflections to land here soon.
          </p>
        </div>
        <div className="counselor-hero-grid">
          <article>
            <FontAwesomeIcon icon={faHandsHelping} />
            <h3>Circle facilitation</h3>
            <p>Quick shortcuts into the peer-support rooms you guide each week.</p>
          </article>
          <article>
            <FontAwesomeIcon icon={faCalendarCheck} />
            <h3>Session radar</h3>
            <p>Auto-synced reminders for every 1:1 wellbeing checkpoint.</p>
          </article>
          <article>
            <FontAwesomeIcon icon={faComments} />
            <h3>Guided notes</h3>
            <p>Capture highlights from each conversation so trends stay transparent.</p>
          </article>
        </div>
      </div>
      <section className="counselor-coming-soon">
        <h2>Coming soon</h2>
        <ul>
          <li>Student cohort overview with wellbeing signals.</li>
          <li>Shared notes that sync with the admin analytics view.</li>
          <li>Resource drawer curated for the circles you host.</li>
        </ul>
        <p>
          Let us know if there&apos;s a workflow you want prioritized—we&apos;re shaping this space with
          counselor feedback first.
        </p>
      </section>
    </div>
  );
}
