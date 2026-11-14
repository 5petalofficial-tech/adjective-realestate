// src/components/blogs/StatusBadge.jsx

import { Badge } from "@/components/ui/badge";

const STATUS_STYLES = {
  published: "bg-[#e6ede0] text-[#4a6b32] border-[#c3d6b3]",
  draft: "bg-gray-100 text-gray-600 border-gray-200",
  scheduled: "bg-[#fdf3e0] text-[#a3720f] border-[#f0d99b]",
  archived: "bg-red-50 text-red-600 border-red-200",
};

const STATUS_LABELS = {
  published: "Published",
  draft: "Draft",
  scheduled: "Scheduled",
  archived: "Archived",
};

const StatusBadge = ({ status }) => {
  const style = STATUS_STYLES[status] || STATUS_STYLES.draft;
  const label = STATUS_LABELS[status] || status;

  return (
    <Badge variant="outline" className={`font-medium capitalize ${style}`}>
      {label}
    </Badge>
  );
};

export default StatusBadge;
