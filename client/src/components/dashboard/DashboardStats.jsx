import React from "react";
import { FileText, Target, Briefcase, Award } from "lucide-react";
import TelemetryCard from "../common/TelemetryCard";

const DashboardStats = ({ resumesCount, totalTracked, activeInterviews, totalOffers }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4 text-left">
      <TelemetryCard
        label="Resumes"
        value={resumesCount}
        icon={FileText}
        color="emerald"
        subtext={resumesCount > 0 ? "Ready to export" : "Create draft"}
      />

      <TelemetryCard
        label="ATS Score"
        value="96%"
        icon={Target}
        color="blue"
        subtext="Workday & Lever"
      />

      <TelemetryCard
        label="Tracked Jobs"
        value={totalTracked}
        icon={Briefcase}
        color="amber"
        subtext={activeInterviews > 0 ? `${activeInterviews} interviews` : "Pipeline active"}
        pulseDot={true}
      />

      <TelemetryCard
        label="Offers"
        value={totalOffers}
        icon={Award}
        color="purple"
        subtext="Milestones"
      />
    </div>
  );
};

export default DashboardStats;
