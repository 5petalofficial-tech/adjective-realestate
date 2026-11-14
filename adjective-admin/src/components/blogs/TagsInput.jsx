// src/components/blogs/TagsInput.jsx
// Client Component. Tags are stored as ObjectId refs (per the Blog schema),
// so this always resolves to real Tag documents — either picked from the
// existing list, or created on the fly via the Tag admin API.

"use client";

import { useState } from "react";
import { Check, ChevronsUpDown, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { api } from "@/utils/api";
import { toast } from "sonner";

const getTagId = (t) => (typeof t === "string" ? t : t?._id);
const getTagName = (t) => (typeof t === "string" ? t : t?.name || t?._id || "");

/**
 * @param {Array<{_id, name}>} availableTags - full tag list (from server)
 * @param {Array<{_id, name}>} value - currently selected tags
 * @param {(tags: Array<{_id, name}>) => void} onChange
 */
const TagsInput = ({ availableTags = [], value = [], onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);

  const selectedIds = new Set(value.map(getTagId).filter(Boolean));
  const filteredOptions = availableTags.filter(
    (t) => !selectedIds.has(t._id) && t.name.toLowerCase().includes(search.toLowerCase())
  );

  const exactMatchExists = availableTags.some(
    (t) => t.name.toLowerCase() === search.trim().toLowerCase()
  );

  const addTag = (tag) => {
    onChange([...value, tag]);
    setSearch("");
  };

  const removeTag = (tagId) => {
    onChange(value.filter((t) => getTagId(t) !== tagId));
  };

  const handleCreateTag = async () => {
    const name = search.trim();
    if (!name) return;

    setCreating(true);
    try {
      const res = await api.post("/api/admin/blog-tags", { name });
      const newTag = res.data;
      addTag(newTag);
    } catch (err) {
      toast.error(err?.message || "Could not create tag");
    } finally {
      setCreating(false);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-2">
        {value.map((tag) => {
          const id = getTagId(tag);
          const name = getTagName(tag);
          return (
            <Badge key={id} variant="secondary" className="flex items-center gap-1 pr-1">
              {name}
              <button
                type="button"
                onClick={() => removeTag(id)}
                className="hover:bg-gray-300 rounded-full p-0.5"
              >
                <X size={12} />
              </button>
            </Badge>
          );
        })}
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            role="combobox"
            className="w-full justify-between text-gray-500 font-normal"
          >
            Add tags...
            <ChevronsUpDown size={14} className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search or create a tag..."
              value={search}
              onValueChange={setSearch}
            />
            <CommandList>
              <CommandEmpty>
                {search.trim() && !exactMatchExists && (
                  <button
                    type="button"
                    onClick={handleCreateTag}
                    disabled={creating}
                    className="flex items-center gap-2 w-full px-3 py-2 text-sm text-[#6b7c4d] hover:bg-gray-50"
                  >
                    <Plus size={14} />
                    {creating ? "Creating..." : `Create "${search.trim()}"`}
                  </button>
                )}
              </CommandEmpty>
              <CommandGroup>
                {filteredOptions.map((tag) => (
                  <CommandItem
                    key={tag._id}
                    value={tag.name}
                    onSelect={() => {
                      addTag(tag);
                      setOpen(true);
                    }}
                  >
                    <Check size={14} className="mr-2 opacity-0" />
                    {tag.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
};

export default TagsInput;
