import { Box } from "@/components/tui/box";
import { Input } from "@/components/tui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/tui/select";
import { Switch } from "@/components/tui/switch";
import { Textarea } from "@/components/tui/textarea";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldContent,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  CUSTOM_FIELD_DEPENDENCY_OPERATOR,
  CUSTOM_FIELD_TYPE,
} from "@/lib/enums";
import { Trash2 } from "lucide-react";
import type React from "react";
import type { CustomField, CustomFieldDraft } from "./types";
import { cn } from "@/lib/utils";

function safeParseStringArray(value: string): string[] {
  const trimmed = value.trim();
  if (!trimmed) return [];
  try {
    const parsed = JSON.parse(trimmed);
    if (Array.isArray(parsed)) {
      return parsed
        .map(String)
        .map((s) => s.trim())
        .filter(Boolean);
    }
  } catch {
    // ignore
  }
  // fallback: comma/newline separated
  return trimmed
    .split(/[\n,]/g)
    .map((s) => s.trim())
    .filter(Boolean);
}

function serializeStringArray(values: string[]): string {
  return JSON.stringify(values.map((s) => s.trim()).filter(Boolean));
}

export function CustomFieldDetailsPanel({
  selectedCustomField,
  draft,
  setDraft,
  canEdit,
  canDelete,
  isSaving,
  onClose,
  onSave,
  onDelete,
}: {
  selectedCustomField: CustomField | null;
  draft: CustomFieldDraft;
  setDraft: React.Dispatch<React.SetStateAction<CustomFieldDraft>>;
  canEdit: boolean;
  canDelete: boolean;
  isSaving: boolean;
  onClose: () => void;
  onSave: () => void;
  onDelete: (customFieldId: string) => void;
}) {
  const hasOptions =
    !!draft && ["SELECT", "MULTI_SELECT", "STATE"].includes(draft.type);

  return (
    <div
      className={cn("min-h-0 transition-all duration-300", {
        "w-2/3": selectedCustomField && hasOptions,
        "w-1/2": !selectedCustomField || !hasOptions,
        "invisible m-0 w-0 px-0": !selectedCustomField,
      })}
    >
      <div
        className={cn(
          "grid h-full max-h-full min-h-0 grid-cols-2 gap-2 overflow-y-auto",
          selectedCustomField && hasOptions ? "grid-cols-2" : "grid-cols-1",
        )}
      >
        <Box
          text={{
            topLeft: (
              <span className="text-foreground">
                Details of {selectedCustomField?.label}
              </span>
            ),
          }}
          onClose={onClose}
          style={{
            box: "h-full max-h-full overflow-hidden",
            content: "flex flex-col gap-2",
          }}
        >
          {!selectedCustomField || !draft ? null : (
            <>
              <FieldGroup className="flex h-fit flex-col gap-2">
                <Field>
                  <FieldContent>
                    <Input
                      value={draft.label}
                      box={{
                        text: {
                          topLeft: "Label",
                        },
                      }}
                      disabled={!canEdit}
                      onChange={(e) =>
                        setDraft((d) =>
                          d ? { ...d, label: e.target.value } : d,
                        )
                      }
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldContent>
                    <Select
                      value={draft.type}
                      disabled={!canEdit}
                      onValueChange={(value) =>
                        setDraft((d) => (d ? { ...d, type: value } : d))
                      }
                    >
                      <SelectTrigger
                        className="w-full"
                        box={{
                          text: {
                            topLeft: "Type",
                          },
                        }}
                      >
                        <SelectValue placeholder="Select a type" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CUSTOM_FIELD_TYPE).map((t) => (
                          <SelectItem key={t} value={t}>
                            {t}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldContent>
                    <Input
                      box={{
                        text: {
                          topLeft: "Placeholder",
                        },
                      }}
                      value={draft.placeholder}
                      disabled={!canEdit}
                      onChange={(e) =>
                        setDraft((d) =>
                          d ? { ...d, placeholder: e.target.value } : d,
                        )
                      }
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldContent>
                    <Input
                      box={{
                        text: {
                          topLeft: "Description",
                        },
                      }}
                      value={draft.description}
                      disabled={!canEdit}
                      onChange={(e) =>
                        setDraft((d) =>
                          d ? { ...d, description: e.target.value } : d,
                        )
                      }
                    />
                  </FieldContent>
                </Field>

                <Field>
                  <FieldContent>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        {draft.type === CUSTOM_FIELD_TYPE.BOOLEAN ? (
                          <div className="flex items-center justify-between rounded-md px-3 py-2">
                            <div className="text-sm font-semibold">
                              Default checked
                            </div>
                            <Switch
                              checked={draft.defaultValue === "true"}
                              disabled={!canEdit}
                              onCheckedChange={(checked) =>
                                setDraft((d) =>
                                  d
                                    ? {
                                        ...d,
                                        defaultValue: checked
                                          ? "true"
                                          : "false",
                                      }
                                    : d,
                                )
                              }
                            />
                          </div>
                        ) : draft.type === CUSTOM_FIELD_TYPE.TEXT_AREA ? (
                          <Textarea
                            box={{
                              text: {
                                topLeft: "Default value",
                              },
                            }}
                            value={draft.defaultValue}
                            disabled={!canEdit}
                            onChange={(e) =>
                              setDraft((d) =>
                                d ? { ...d, defaultValue: e.target.value } : d,
                              )
                            }
                          />
                        ) : draft.type === CUSTOM_FIELD_TYPE.NUMBER ? (
                          <Input
                            box={{
                              text: {
                                topLeft: "Default value",
                              },
                            }}
                            type="number"
                            value={draft.defaultValue}
                            disabled={!canEdit}
                            onChange={(e) =>
                              setDraft((d) =>
                                d ? { ...d, defaultValue: e.target.value } : d,
                              )
                            }
                          />
                        ) : draft.type === CUSTOM_FIELD_TYPE.DATE ? (
                          <Input
                            box={{
                              text: {
                                topLeft: "Default value",
                              },
                            }}
                            type="date"
                            value={draft.defaultValue}
                            disabled={!canEdit}
                            onChange={(e) =>
                              setDraft((d) =>
                                d ? { ...d, defaultValue: e.target.value } : d,
                              )
                            }
                          />
                        ) : draft.type === CUSTOM_FIELD_TYPE.DATE_TIME ? (
                          <Input
                            box={{
                              text: {
                                topLeft: "Default value",
                              },
                            }}
                            type="datetime-local"
                            value={draft.defaultValue}
                            disabled={!canEdit}
                            onChange={(e) =>
                              setDraft((d) =>
                                d ? { ...d, defaultValue: e.target.value } : d,
                              )
                            }
                          />
                        ) : draft.type === CUSTOM_FIELD_TYPE.TIME ? (
                          <Input
                            box={{
                              text: {
                                topLeft: "Default value",
                              },
                            }}
                            type="time"
                            value={draft.defaultValue}
                            disabled={!canEdit}
                            onChange={(e) =>
                              setDraft((d) =>
                                d ? { ...d, defaultValue: e.target.value } : d,
                              )
                            }
                          />
                        ) : draft.type === CUSTOM_FIELD_TYPE.SELECT ||
                          draft.type === CUSTOM_FIELD_TYPE.STATE ? (
                          draft.options.length ? (
                            <Select
                              value={draft.defaultValue}
                              disabled={!canEdit}
                              onValueChange={(value) =>
                                setDraft((d) =>
                                  d ? { ...d, defaultValue: value } : d,
                                )
                              }
                            >
                              <SelectTrigger
                                className="w-full"
                                box={{
                                  text: {
                                    topLeft: "Default value",
                                  },
                                }}
                              >
                                <SelectValue placeholder="No default" />
                              </SelectTrigger>
                              <SelectContent>
                                {draft.options
                                  .map((o) => o.value)
                                  .filter(Boolean)
                                  .map((v) => (
                                    <SelectItem key={v} value={v}>
                                      {v}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                          ) : (
                            <Input
                              value={draft.defaultValue}
                              disabled={!canEdit}
                              placeholder="Add options to pick a default"
                              onChange={(e) =>
                                setDraft((d) =>
                                  d
                                    ? { ...d, defaultValue: e.target.value }
                                    : d,
                                )
                              }
                            />
                          )
                        ) : draft.type === CUSTOM_FIELD_TYPE.USER_LIST ? (
                          <Textarea
                            value={safeParseStringArray(
                              draft.defaultValue,
                            ).join("\n")}
                            disabled={!canEdit}
                            placeholder="One value per line (stored as JSON array)"
                            onChange={(e) =>
                              setDraft((d) =>
                                d
                                  ? {
                                      ...d,
                                      defaultValue: serializeStringArray(
                                        safeParseStringArray(e.target.value),
                                      ),
                                    }
                                  : d,
                              )
                            }
                          />
                        ) : (
                          <Input
                            box={{
                              text: {
                                topLeft: "Default value",
                              },
                            }}
                            value={draft.defaultValue}
                            disabled={!canEdit}
                            onChange={(e) =>
                              setDraft((d) =>
                                d ? { ...d, defaultValue: e.target.value } : d,
                              )
                            }
                          />
                        )}
                      </div>

                      <Button
                        size="sm"
                        variant="link"
                        disabled={!canEdit || !draft.defaultValue}
                        onClick={() =>
                          setDraft((d) => (d ? { ...d, defaultValue: "" } : d))
                        }
                      >
                        Clear
                      </Button>
                    </div>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldContent>
                    <Select
                      value={draft.dependencyOperator}
                      disabled={!canEdit}
                      onValueChange={(value) =>
                        setDraft((d) =>
                          d ? { ...d, dependencyOperator: value } : d,
                        )
                      }
                    >
                      <SelectTrigger
                        className="w-full"
                        box={{
                          text: {
                            topLeft: "Dependency operator",
                          },
                        }}
                      >
                        <SelectValue placeholder="Select operator" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(CUSTOM_FIELD_DEPENDENCY_OPERATOR).map(
                          (op) => (
                            <SelectItem key={op} value={op}>
                              {op}
                            </SelectItem>
                          ),
                        )}
                      </SelectContent>
                    </Select>
                  </FieldContent>
                </Field>

                <Field>
                  <FieldContent>
                    <Input
                      type="number"
                      box={{
                        text: {
                          topLeft: "Order",
                        },
                      }}
                      min={0}
                      value={String(draft.order)}
                      disabled={!canEdit}
                      onChange={(e) =>
                        setDraft((d) =>
                          d
                            ? {
                                ...d,
                                order: Number.isFinite(Number(e.target.value))
                                  ? Number(e.target.value)
                                  : 0,
                              }
                            : d,
                        )
                      }
                    />
                  </FieldContent>
                </Field>

                <div className="flex h-full flex-col">
                  <Box
                    text={{
                      topLeft: "Toggles",
                    }}
                    style={{
                      content: "flex flex-col gap-2 h-fit",
                      box: "h-full",
                    }}
                  >
                    <Field className="flex-row items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <FieldLabel className="text-foreground">
                          Required
                        </FieldLabel>
                        <div className="text-muted-foreground text-xs">
                          if the field has to be filled in before saving the
                          issue
                        </div>
                      </div>
                      <FieldContent className="items-end">
                        <Switch
                          checked={draft.required}
                          disabled={!canEdit}
                          onCheckedChange={(checked) =>
                            setDraft((d) =>
                              d ? { ...d, required: checked } : d,
                            )
                          }
                        />
                      </FieldContent>
                    </Field>

                    <Field className="flex-row items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <FieldLabel className="text-foreground">
                          Show in table
                        </FieldLabel>
                        <div className="text-muted-foreground text-xs">
                          if the field should be shown in the table
                        </div>
                      </div>
                      <FieldContent className="items-end">
                        <Switch
                          checked={draft.tableShow}
                          disabled={!canEdit}
                          onCheckedChange={(checked) =>
                            setDraft((d) =>
                              d ? { ...d, tableShow: checked } : d,
                            )
                          }
                        />
                      </FieldContent>
                    </Field>

                    <Field className="flex-row items-start justify-between">
                      <div className="flex flex-col gap-1">
                        <FieldLabel className="text-foreground">
                          Obsolete
                        </FieldLabel>
                        <div className="text-muted-foreground text-xs">
                          if the field is obsolete, will be hidden from the user
                        </div>
                      </div>
                      <FieldContent className="items-end">
                        <Switch
                          checked={draft.isObsolete}
                          disabled={!canEdit}
                          onCheckedChange={(checked) =>
                            setDraft((d) =>
                              d ? { ...d, isObsolete: checked } : d,
                            )
                          }
                        />
                      </FieldContent>
                    </Field>
                  </Box>
                </div>
              </FieldGroup>

              <div className="mt-2 flex justify-end gap-2">
                {canDelete ? (
                  <Button
                    size="sm"
                    variant="outlineError"
                    onClick={() => onDelete(selectedCustomField.id)}
                  >
                    Delete
                  </Button>
                ) : null}
                {canEdit ? (
                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isSaving}
                    onClick={onSave}
                  >
                    Save
                  </Button>
                ) : null}
              </div>
            </>
          )}
        </Box>

        {selectedCustomField && hasOptions ? (
          <Box
            text={{
              topLeft: <span className="text-foreground">Options</span>,
            }}
            style={{
              box: "h-full overflow-hidden",
              content: "flex flex-col gap-2",
            }}
          >
            {!draft ? null : (
              <div className="flex flex-col gap-2 p-2">
                {draft.options.length === 0 ? (
                  <div className="text-muted-foreground text-sm">
                    No options yet.
                  </div>
                ) : (
                  draft.options.map((opt, idx) => (
                    <div
                      key={opt.id ?? `new-${idx}`}
                      className="border-border flex flex-col gap-2 rounded border p-2"
                    >
                      <div className="flex items-center gap-2">
                        <Input
                          placeholder="Value"
                          value={opt.value}
                          disabled={!canEdit}
                          onChange={(e) =>
                            setDraft((d) => {
                              if (!d) return d;
                              return {
                                ...d,
                                options: d.options.map((o, i) =>
                                  i === idx
                                    ? { ...o, value: e.target.value }
                                    : o,
                                ),
                              };
                            })
                          }
                        />

                        <Button
                          size="icon"
                          variant="ghost"
                          disabled={!canEdit}
                          onClick={() =>
                            setDraft((d) => {
                              if (!d) return d;
                              const next = d.options.filter(
                                (_, i) => i !== idx,
                              );
                              return { ...d, options: next };
                            })
                          }
                          title="Remove option"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1">
                          <div className="grid grid-cols-8 gap-0.5">
                            {[
                              "#64748b",
                              "#ef4444",
                              "#f97316",
                              "#eab308",
                              "#22c55e",
                              "#3b82f6",
                              "#8b5cf6",
                              "#ec4899",
                            ].map((color) => (
                              <button
                                key={color}
                                type="button"
                                disabled={!canEdit}
                                className="aspect-square size-5"
                                style={{
                                  backgroundColor: color,
                                  borderColor:
                                    opt.color === color
                                      ? "#ffffff"
                                      : "transparent",
                                }}
                                onClick={() =>
                                  setDraft((d) => {
                                    if (!d) return d;
                                    return {
                                      ...d,
                                      options: d.options.map((o, i) =>
                                        i === idx ? { ...o, color } : o,
                                      ),
                                    };
                                  })
                                }
                                title={color}
                              />
                            ))}
                          </div>
                        </div>

                        {draft.type === "STATE" ? (
                          <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground text-xs">
                              Closing
                            </span>
                            <Switch
                              checked={opt.isIssueClosing}
                              disabled={!canEdit}
                              onCheckedChange={(checked) =>
                                setDraft((d) => {
                                  if (!d) return d;
                                  return {
                                    ...d,
                                    options: d.options.map((o, i) =>
                                      i === idx
                                        ? { ...o, isIssueClosing: checked }
                                        : o,
                                    ),
                                  };
                                })
                              }
                            />
                          </div>
                        ) : null}
                      </div>
                    </div>
                  ))
                )}

                <Button
                  size="sm"
                  variant="outline"
                  disabled={!canEdit}
                  onClick={() =>
                    setDraft((d) =>
                      d
                        ? {
                            ...d,
                            options: [
                              ...d.options,
                              {
                                value: "",
                                color: "#64748b",
                                isIssueClosing: false,
                              },
                            ],
                          }
                        : d,
                    )
                  }
                >
                  Add option
                </Button>
              </div>
            )}
          </Box>
        ) : null}
      </div>
    </div>
  );
}
