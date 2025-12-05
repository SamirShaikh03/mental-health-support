import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faEnvelope,
  faCakeCandles,
  faLocationDot,
  faGraduationCap,
  faCalendarDays,
  faStar,
  faHeartPulse,
  faMoon,
  faBookOpen,
  faUsers,
  faLeaf,
  faPenFancy,
  faHandshakeAngle,
  faUserDoctor,
  faDumbbell,
  faPenToSquare,
  faWind,
  faPeopleGroup,
  faSeedling,
  faBullseye,
  faTrophy,
  faFaceSmile,
  faBolt,
  faCalendarCheck,
} from "@fortawesome/free-solid-svg-icons";

const demoProfile = {
  name: "Aditi Rao",
  email: "aditi.rao@auroratech.edu",
  age: 21,
  location: "Pune, India",
  college: "Aurora Institute of Technology",
  joined: "August 2023",
  status: "Steady growth",
  pronouns: "she/her",
  degree: "B.Tech · Computer Science",
  bio: "Balancing academics with mindful routines, journaling, and weekly counselor check-ins to stay grounded through exam season.",
  interests: ["Mindful journaling", "Yoga flow", "Peer support circles"],
  avatarColor: "#4f46e5",
  lastCheckIn: "Today · 09:15 AM",
  streak: "18-day reflection streak",
  mood: "Balanced ✦ +6% this week",
  nextSession: {
    title: "Campus Counselor",
    date: "Mon · Dec 2",
    time: "3:30 PM",
    medium: "Video session",
  },
  metrics: [
    { label: "Wellness score", value: "82", change: "+4 this week" },
    { label: "Sleep consistency", value: "6.8 hrs", change: "+35 mins" },
    { label: "Journals logged", value: "58 entries", change: "Last entry 8h ago" },
    { label: "Peer support", value: "3 circles", change: "Active this month" },
  ],
  focusAreas: [
    { title: "Breathing reset", detail: "3-min box breathing after afternoon classes", progress: 76 },
    { title: "Nightly journal", detail: "Two prompts + gratitude note before bed", progress: 64 },
    { title: "Peer support circle", detail: "Weekly co-facilitation with campus ambassadors", progress: 48 },
  ],
  supportTeam: [
    { name: "Dr. Meera Shah", role: "Campus Counselor", contact: "meera.shah@wellness.edu", slot: "Mon · 03:30 PM" },
    { name: "Riya Kulkarni", role: "Peer Mentor", contact: "Slack · #aurora-support", slot: "Daily check-ins" },
    { name: "Fitness Studio", role: "Guided Breathwork", contact: "Studio · Blue Room", slot: "Wed · 07:00 AM" },
  ],
  recentActivity: [
    { title: "Reflection recorded", detail: "Gratitude journal • 4 prompts", time: "Today, 09:15 AM" },
    { title: "Guided breathwork", detail: "Calm circuit • 6 minutes", time: "Yesterday, 07:20 AM" },
    { title: "Peer support circle", detail: "Held space for 5 students", time: "Sunday, 05:00 PM" },
  ],
  growthPlan: [
    { title: "Reclaim mornings", status: "In progress", detail: "Lights out by 11PM, journal + stretch" },
    { title: "Confidence in studio", status: "Scheduled", detail: "Co-facilitate the December breathwork lab" },
    { title: "Slow check-ins", status: "Celebrated", detail: "Shared progress with counselor after 4 weeks" },
  ],
};

const getInitials = (name = "") => {
  const parts = name.trim().split(" ");
  return parts.slice(0, 2).map((segment) => segment[0]?.toUpperCase() || "").join("");
};

const ensureArray = (value, fallback) => (Array.isArray(value) && value.length ? value : fallback);

const accentClasses = ["accent-violet", "accent-teal", "accent-amber", "accent-rose"];
const metricIcons = [faHeartPulse, faMoon, faBookOpen, faUsers];
const focusIcons = [faLeaf, faPenFancy, faHandshakeAngle];
const supportIcons = [faUserDoctor, faPeopleGroup, faDumbbell];
const activityIcons = [faPenToSquare, faWind, faPeopleGroup];
const planIcons = [faSeedling, faBullseye, faTrophy];

export default function Profile() {
  const [profile, setProfile] = useState(null);
  const [state, setState] = useState("loading");

  useEffect(() => {
    let ignore = false;

    const loadProfile = async () => {
      try {
        const res = await fetch("/api/user/profile", { credentials: "include" });
        if (!res.ok) throw new Error("Failed to load profile");
        const data = await res.json();
        if (!ignore) {
          setProfile({ ...demoProfile, ...data });
          setState("ready");
        }
      } catch (error) {
        if (!ignore) {
          setProfile(demoProfile);
          setState("fallback");
        }
      }
    };

    loadProfile();

    return () => {
      ignore = true;
    };
  }, []);

  if (state === "loading" && !profile) {
    return (
      <div className="profile-page">
        <div className="profile-loading-state">
          <div className="profile-spinner" aria-hidden />
          <p>Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="profile-page">
        <div className="profile-empty-state">
          <p>We couldn’t build your profile just yet. Please try refreshing.</p>
        </div>
      </div>
    );
  }

  const avatarUrl = profile.avatar
    ? profile.avatar
    : `https://ui-avatars.com/api/?name=${encodeURIComponent(profile.name || "User")}&background=4f46e5&color=fff&size=160`;

  const metrics = ensureArray(profile.metrics, demoProfile.metrics);
  const focusAreas = ensureArray(profile.focusAreas, demoProfile.focusAreas);
  const supportTeam = ensureArray(profile.supportTeam, demoProfile.supportTeam);
  const recentActivity = ensureArray(profile.recentActivity, demoProfile.recentActivity);
  const growthPlan = ensureArray(profile.growthPlan, demoProfile.growthPlan);
  const infoFields = [
    { label: "Full name", value: profile.name || "—", icon: faUser },
    { label: "Email", value: profile.email || "—", icon: faEnvelope },
    { label: "Age", value: profile.age ? `${profile.age} years` : "—", icon: faCakeCandles },
    { label: "Location", value: profile.location || "—", icon: faLocationDot },
    { label: "College", value: profile.college || profile.degree || "—", icon: faGraduationCap },
    { label: "Member since", value: profile.joined || profile.joinDate || "—", icon: faCalendarDays },
    {
      label: "Interests",
      value: Array.isArray(profile.interests) ? profile.interests.join(", ") : profile.interests || "—",
      icon: faStar,
    },
  ];

  const highlightTiles = [
    {
      label: "Current mood",
      value: profile.mood || "Steady focus",
      meta: "Daily check-ins keep us tuned in",
      icon: faFaceSmile,
      accent: accentClasses[0],
    },
    {
      label: "Reflection streak",
      value: profile.streak || "Start a streak",
      meta: "Consistency unlocks insights",
      icon: faBolt,
      accent: accentClasses[2],
    },
    {
      label: "Next support touchpoint",
      value: profile.nextSession?.title || "Add a session",
      meta: profile.nextSession?.date ? `${profile.nextSession.date} · ${profile.nextSession.time}` : "Nothing on the calendar",
      icon: faCalendarCheck,
      accent: accentClasses[1],
    },
  ];

  return (
    <div className="profile-page">
      {state === "fallback" && (
        <div className="profile-inline-alert" role="status">
          <strong>Offline mode:</strong> Showing a demo profile while we reconnect to your data.
        </div>
      )}

      <section className="profile-hero">
        <div className="profile-identity">
          <div className="profile-avatar-frame" style={{ background: profile.avatarColor }}>
            <img
              src={avatarUrl}
              alt={profile.name ? `${profile.name}'s avatar` : "Profile avatar"}
              onError={(event) => {
                event.target.onerror = null;
                event.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(getInitials(profile.name || "User"))}&background=4f46e5&color=fff&size=160`;
              }}
            />
            <span className="profile-status-dot" aria-label="Active status" />
          </div>
          <div>
            <p className="profile-pill">{profile.status || "Active member"}</p>
            <h1>{profile.name || "Campus Member"}</h1>
            <p className="profile-subtext">{profile.bio || demoProfile.bio}</p>
            <ul className="profile-tags">
              <li>{profile.pronouns || "they/them"}</li>
              <li>{profile.location || "Campus"}</li>
              <li>{profile.degree || profile.college}</li>
            </ul>
          </div>
        </div>
        <div className="profile-hero-panel">
          <div>
            <span className="profile-panel-label">Last mindful check-in</span>
            <p className="profile-panel-value">{profile.lastCheckIn || "—"}</p>
            <p className="profile-panel-note">{profile.streak || "Start a reflection today"}</p>
          </div>
          <div className="profile-panel-divider" />
          <div>
            <span className="profile-panel-label">Next session</span>
            <p className="profile-panel-value">{profile.nextSession?.date || "Not scheduled"}</p>
            <p className="profile-panel-note">
              {profile.nextSession?.time ? `${profile.nextSession.time} · ${profile.nextSession.medium}` : profile.nextSession?.title || "Add a session"}
            </p>
          </div>
        </div>
      </section>

      <section className="profile-highlights">
        {highlightTiles.map((tile) => (
          <article className={`profile-highlight-card ${tile.accent}`} key={tile.label}>
            <span className={`profile-item-icon ${tile.accent}`}>
              <FontAwesomeIcon icon={tile.icon} />
            </span>
            <div>
              <p className="profile-panel-label">{tile.label}</p>
              <h3>{tile.value}</h3>
              <p className="profile-panel-note">{tile.meta}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="profile-metrics">
        {metrics.map((metric, index) => {
          const accent = accentClasses[index % accentClasses.length];
          const icon = metricIcons[index % metricIcons.length];
          return (
            <article className={`profile-metric-card ${accent}`} key={metric.label}>
              <span className={`profile-item-icon profile-metric-icon ${accent}`}>
                <FontAwesomeIcon icon={icon} />
              </span>
              <span className="profile-metric-label">{metric.label}</span>
              <h3>{metric.value}</h3>
              <p>{metric.change}</p>
            </article>
          );
        })}
      </section>

      <section className="profile-grid">
        <article className="profile-card profile-information">
          <header>
            <h2>Personal insights</h2>
            <p>Key details that help your support team personalize care.</p>
          </header>
          <dl>
            {infoFields.map((field) => (
              <div className="profile-info-field" key={field.label}>
                <dt>
                  <span className="profile-item-icon accent-slate">
                    <FontAwesomeIcon icon={field.icon} />
                  </span>
                  {field.label}
                </dt>
                <dd>{field.value}</dd>
              </div>
            ))}
          </dl>
        </article>

        <article className="profile-card profile-focus">
          <header>
            <h2>Focus areas</h2>
            <p>Active routines and practices you’re nurturing.</p>
          </header>
          <ul>
            {focusAreas.map((item, index) => {
              const accent = accentClasses[index % accentClasses.length];
              const icon = focusIcons[index % focusIcons.length];
              return (
                <li key={item.title}>
                  <div className="profile-focus-head">
                    <span className={`profile-item-icon ${accent}`}>
                      <FontAwesomeIcon icon={icon} />
                    </span>
                    <div>
                      <p className="focus-title">{item.title}</p>
                      <p className="focus-detail">{item.detail}</p>
                    </div>
                  </div>
                  {typeof item.progress === "number" && (
                    <div className="focus-progress">
                      <div style={{ width: `${item.progress}%` }} />
                      <span>{item.progress}% complete</span>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        </article>
      </section>

      <section className="profile-grid">
        <article className="profile-card profile-support">
          <header>
            <h2>Support circle</h2>
            <p>Your go-to people and how to reach them quickly.</p>
          </header>
          <ul>
            {supportTeam.map((person, index) => {
              const accent = accentClasses[index % accentClasses.length];
              const icon = supportIcons[index % supportIcons.length];
              return (
                <li key={`${person.name}-${person.role}`}>
                  <div className="profile-support-main">
                    <span className={`profile-item-icon ${accent}`}>
                      <FontAwesomeIcon icon={icon} />
                    </span>
                    <div>
                      <p className="support-name">{person.name}</p>
                      <span className="support-role">{person.role}</span>
                    </div>
                  </div>
                  <div className="profile-support-meta">
                    <p className="support-contact">{person.contact}</p>
                    <span className="support-slot">{person.slot}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        </article>

        <article className="profile-card profile-activity">
          <header>
            <h2>Recent activity</h2>
            <p>Moments you logged or sessions you attended.</p>
          </header>
          <ul>
            {recentActivity.map((entry, index) => {
              const accent = accentClasses[index % accentClasses.length];
              const icon = activityIcons[index % activityIcons.length];
              return (
                <li key={`${entry.title}-${entry.time}`}>
                  <div className="profile-activity-main">
                    <span className={`profile-item-icon ${accent}`}>
                      <FontAwesomeIcon icon={icon} />
                    </span>
                    <div>
                      <p className="activity-title">{entry.title}</p>
                      <span className="activity-detail">{entry.detail}</span>
                    </div>
                  </div>
                  <span className="activity-time">{entry.time}</span>
                </li>
              );
            })}
          </ul>
        </article>
      </section>

      <section className="profile-card profile-plan">
        <header>
          <h2>Growth plan</h2>
          <p>Keep track of the intentions you set with your counselor.</p>
        </header>
        <ul>
          {growthPlan.map((goal, index) => {
            const accent = accentClasses[index % accentClasses.length];
            const icon = planIcons[index % planIcons.length];
            return (
              <li key={goal.title}>
                <div className="profile-plan-main">
                  <span className={`profile-item-icon ${accent}`}>
                    <FontAwesomeIcon icon={icon} />
                  </span>
                  <div>
                    <p className="plan-title">{goal.title}</p>
                    <p className="plan-detail">{goal.detail}</p>
                  </div>
                </div>
                <span className={`plan-status ${accent}`}>{goal.status}</span>
              </li>
            );
          })}
        </ul>
      </section>
    </div>
  );
}
