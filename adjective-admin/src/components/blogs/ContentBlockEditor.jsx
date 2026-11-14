// src/components/blogs/ContentBlockEditor.jsx
// Client Component. Dynamic block editor supporting all 8 backend block types:
// heading, paragraph, list, table, image, quote, code, video + safe fallback for unknown types.

"use client";

import { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown, GripVertical, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const BLOCK_TYPES = [
  { value: "paragraph", label: "Paragraph" },
  { value: "heading", label: "Heading" },
  { value: "list", label: "List" },
  { value: "table", label: "Table" },
  { value: "image", label: "Image" },
  { value: "quote", label: "Quote" },
  { value: "code", label: "Code Block" },
  { value: "video", label: "Video" },
];

const emptyBlockData = (type) => {
  switch (type) {
    case "heading":
      return { text: "", level: 2 };
    case "paragraph":
      return { text: "" };
    case "list":
      return { style: "unordered", items: [""] };
    case "table":
      return { headers: [""], rows: [[""]] };
    case "image":
      return { url: "", publicId: "", caption: "", alt: "" };
    case "quote":
      return { text: "", author: "" };
    case "code":
      return { code: "", language: "plaintext" };
    case "video":
      return { embedUrl: "", provider: "youtube", caption: "" };
    default:
      return {};
  }
};

/**
 * @param {Array<{type: string, data: object}>} blocks
 * @param {(blocks: Array) => void} onChange
 */
const ContentBlockEditor = ({ blocks = [], onChange }) => {
  const updateBlock = (index, data) => {
    const next = [...blocks];
    next[index] = { ...next[index], data };
    onChange(next);
  };

  const addBlock = (type) => {
    onChange([...blocks, { type, data: emptyBlockData(type) }]);
  };

  const removeBlock = (index) => {
    onChange(blocks.filter((_, i) => i !== index));
  };

  const moveBlock = (index, direction) => {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= blocks.length) return;
    const next = [...blocks];
    [next[index], next[targetIndex]] = [next[targetIndex], next[index]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {blocks.map((block, index) => (
        <div key={index} className="border border-gray-200 rounded-lg p-4 bg-white">
          <div className="flex items-center justify-between mb-3">
            <span className="flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wide text-gray-500">
              <GripVertical size={14} />
              {block.type}
            </span>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => moveBlock(index, -1)}
                disabled={index === 0}
                className="p-1 text-gray-400 hover:text-[#6b7c4d] disabled:opacity-30"
              >
                <ChevronUp size={16} />
              </button>
              <button
                type="button"
                onClick={() => moveBlock(index, 1)}
                disabled={index === blocks.length - 1}
                className="p-1 text-gray-400 hover:text-[#6b7c4d] disabled:opacity-30"
              >
                <ChevronDown size={16} />
              </button>
              <button
                type="button"
                onClick={() => removeBlock(index)}
                className="p-1 text-red-400 hover:text-red-600"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>

          <BlockFields block={block} onUpdate={(data) => updateBlock(index, data)} />
        </div>
      ))}

      {/* Add block toolbar */}
      <div className="flex flex-wrap gap-2 pt-1">
        {BLOCK_TYPES.map((bt) => (
          <Button
            key={bt.value}
            type="button"
            variant="outline"
            size="sm"
            onClick={() => addBlock(bt.value)}
            className="text-xs"
          >
            <Plus size={13} className="mr-1" /> {bt.label}
          </Button>
        ))}
      </div>

      {blocks.length === 0 && (
        <p className="text-sm text-gray-400 italic">
          No content blocks yet — add a paragraph to get started.
        </p>
      )}
    </div>
  );
};

const BlockFields = ({ block, onUpdate }) => {
  const { type, data = {} } = block;

  if (type === "paragraph") {
    return (
      <Textarea
        placeholder="Write a paragraph..."
        value={data.text || ""}
        onChange={(e) => onUpdate({ ...data, text: e.target.value })}
        rows={4}
      />
    );
  }

  if (type === "heading") {
    const currentLevel = data.level && data.level >= 1 && data.level <= 6 ? data.level : 2;
    return (
      <div className="flex gap-3">
        <Select
          value={String(currentLevel)}
          onValueChange={(v) => onUpdate({ ...data, level: Number(v) })}
        >
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {[1, 2, 3, 4, 5, 6].map((lvl) => (
              <SelectItem key={lvl} value={String(lvl)}>
                H{lvl}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Input
          placeholder="Heading text"
          value={data.text || ""}
          onChange={(e) => onUpdate({ ...data, text: e.target.value })}
        />
      </div>
    );
  }

  if (type === "list") {
    const itemsText = Array.isArray(data.items) ? data.items.join("\n") : "";
    return (
      <div className="space-y-2">
        <Select
          value={data.style || "unordered"}
          onValueChange={(v) => onUpdate({ ...data, style: v })}
        >
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unordered">Bulleted</SelectItem>
            <SelectItem value="ordered">Numbered</SelectItem>
          </SelectContent>
        </Select>
        <Textarea
          placeholder="One item per line..."
          value={itemsText}
          onChange={(e) => onUpdate({ ...data, items: e.target.value.split("\n") })}
          rows={4}
        />
      </div>
    );
  }

  if (type === "table") {
    const headersText = Array.isArray(data.headers) ? data.headers.join(", ") : "";
    const rowsText = Array.isArray(data.rows)
      ? data.rows.map((r) => (Array.isArray(r) ? r.join(", ") : "")).join("\n")
      : "";

    return (
      <div className="space-y-3">
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Table Headers (comma-separated)</Label>
          <Input
            placeholder="Header 1, Header 2, Header 3"
            value={headersText}
            onChange={(e) =>
              onUpdate({
                ...data,
                headers: e.target.value.split(",").map((h) => h.trim()),
              })
            }
          />
        </div>
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Table Rows (one row per line, comma-separated cells)</Label>
          <Textarea
            placeholder={"Row 1 Cell 1, Row 1 Cell 2\nRow 2 Cell 1, Row 2 Cell 2"}
            value={rowsText}
            onChange={(e) =>
              onUpdate({
                ...data,
                rows: e.target.value.split("\n").map((line) => line.split(",").map((c) => c.trim())),
              })
            }
            rows={4}
          />
        </div>
      </div>
    );
  }

  if (type === "image") {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Image URL</Label>
            <Input
              placeholder="https://..."
              value={data.url || ""}
              onChange={(e) => onUpdate({ ...data, url: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Public ID</Label>
            <Input
              placeholder="cloudinary_id_or_file_name"
              value={data.publicId || ""}
              onChange={(e) => onUpdate({ ...data, publicId: e.target.value })}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Caption (optional)</Label>
            <Input
              placeholder="Image caption"
              value={data.caption || ""}
              onChange={(e) => onUpdate({ ...data, caption: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Alt Text (optional)</Label>
            <Input
              placeholder="Alt text"
              value={data.alt || ""}
              onChange={(e) => onUpdate({ ...data, alt: e.target.value })}
            />
          </div>
        </div>
      </div>
    );
  }

  if (type === "quote") {
    return (
      <div className="space-y-2">
        <Textarea
          placeholder="Quote text"
          value={data.text || ""}
          onChange={(e) => onUpdate({ ...data, text: e.target.value })}
          rows={3}
        />
        <Input
          placeholder="Attribution (optional)"
          value={data.author || ""}
          onChange={(e) => onUpdate({ ...data, author: e.target.value })}
        />
      </div>
    );
  }

  if (type === "code") {
    return (
      <div className="space-y-2">
        <Input
          placeholder="Language (e.g. javascript)"
          value={data.language || "plaintext"}
          onChange={(e) => onUpdate({ ...data, language: e.target.value })}
          className="w-48"
        />
        <Textarea
          placeholder="Code..."
          value={data.code || ""}
          onChange={(e) => onUpdate({ ...data, code: e.target.value })}
          rows={6}
          className="font-mono text-sm"
        />
      </div>
    );
  }

  if (type === "video") {
    return (
      <div className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="sm:col-span-2">
            <Label className="text-xs text-gray-500 mb-1 block">Embed URL</Label>
            <Input
              placeholder="https://www.youtube.com/embed/..."
              value={data.embedUrl || ""}
              onChange={(e) => onUpdate({ ...data, embedUrl: e.target.value })}
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500 mb-1 block">Provider</Label>
            <Select
              value={data.provider || "youtube"}
              onValueChange={(v) => onUpdate({ ...data, provider: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="vimeo">Vimeo</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <div>
          <Label className="text-xs text-gray-500 mb-1 block">Caption (optional)</Label>
          <Input
            placeholder="Video caption"
            value={data.caption || ""}
            onChange={(e) => onUpdate({ ...data, caption: e.target.value })}
          />
        </div>
      </div>
    );
  }

  // Fallback for unknown/future block types — preserves type and data safely!
  return <UnknownBlockFallback type={type} data={data} onUpdate={onUpdate} />;
};

const UnknownBlockFallback = ({ type, data, onUpdate }) => {
  const [jsonText, setJsonText] = useState(() => JSON.stringify(data || {}, null, 2));
  const [error, setError] = useState(null);

  const handleJsonChange = (text) => {
    setJsonText(text);
    try {
      const parsed = JSON.parse(text);
      setError(null);
      onUpdate(parsed);
    } catch (e) {
      setError("Invalid JSON format");
    }
  };

  return (
    <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-md space-y-2">
      <div className="flex items-center gap-2 text-amber-800 text-xs font-medium">
        <AlertTriangle size={14} className="text-amber-600" />
        <span>Unsupported Block Type (&quot;{type}&quot;) — data is preserved safely.</span>
      </div>
      <Textarea
        value={jsonText}
        onChange={(e) => handleJsonChange(e.target.value)}
        rows={4}
        className="font-mono text-xs bg-white"
      />
      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
};

export default ContentBlockEditor;
