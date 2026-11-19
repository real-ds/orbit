"use client";

import { Select } from "@/components/ui/select";
import { formatDevelopmentType } from "@/lib/utils";

export interface FilterPanelProps {
  developmentTypes: string[];
  organizations: string[];
  tags: string[];
  developmentType: string;
  organization: string;
  tag: string;
  onChange: (key: "developmentType" | "organization" | "tag", value: string) => void;
}

export function FilterPanel({
  developmentTypes,
  organizations,
  tags,
  developmentType,
  organization,
  tag,
  onChange,
}: FilterPanelProps) {
  return (
    <div className="panel__fields">
      <Select
        id="filter-development-type"
        label="Development type"
        allLabel="All types"
        value={developmentType}
        onChange={(event) => onChange("developmentType", event.target.value)}
        options={developmentTypes.map((type) => ({
          value: type,
          label: formatDevelopmentType(type),
        }))}
      />

      <Select
        id="filter-organization"
        label="Organization"
        allLabel="All organizations"
        value={organization}
        onChange={(event) => onChange("organization", event.target.value)}
        options={organizations.map((organization) => ({ value: organization, label: organization }))}
      />

      <Select
        id="filter-tag"
        label="Tag"
        allLabel="All tags"
        value={tag}
        onChange={(event) => onChange("tag", event.target.value)}
        options={tags.map((tag) => ({ value: tag, label: tag }))}
      />
    </div>
  );
}
