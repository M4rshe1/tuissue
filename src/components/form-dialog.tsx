"use client";
import { z } from "zod";
import { FormProvider, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import DatePicker from "@/components/ui/date-picker";
import { SelectWithSearch } from "@/components/select-with-search";
import {
  UserSearchInput,
  type UserSearchInputConfig,
} from "@/components/user-search-input";
import { toast } from "sonner";
import { Copy, ChevronLeft, ChevronRight, InfoIcon } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import PasswordInput from "@/components/password-input";
import NumberInput from "@/components/number-input";
import {
  Stepper,
  StepperIndicator,
  StepperItem,
} from "@/components/ui/stepper";
import {
  OutOfField,
  type OutOfFieldConfig,
  type OutOfMultiFieldConfig,
} from "@/components/out-of-field";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";

export type {
  OutOfFieldConfig,
  OutOfMultiFieldConfig,
} from "@/components/out-of-field";

export type FieldConfig =
  | UserFieldConfig
  | SelectFieldConfig
  | DefaultFieldConfig
  | LabelFieldConfig
  | BooleanFieldConfig
  | DateFieldConfig
  | ConfirmFieldConfig
  | NumberFieldConfig
  | RangeFieldConfig
  | OutOfFieldConfig
  | OutOfMultiFieldConfig;

export type BaseFieldConfig = {
  name: string;
  placeholder?: string;
  validation?: z.ZodTypeAny;
  noBreak?: boolean;
  info?: string;
  label?: string;
};

export interface LabelFieldConfig {
  type: "label";
  label: string;
  name: string;
  info?: string;
}
export interface UserFieldConfig extends BaseFieldConfig {
  type: "user";
  defaultValue?: string;
  config?: UserSearchInputConfig;
}

export interface SelectFieldConfig extends BaseFieldConfig {
  type: "select";
  options: { label: string; value: string }[];
  defaultValue?: string;
}

export interface DefaultFieldConfig extends BaseFieldConfig {
  type: "text" | "email" | "textarea" | "password";
  defaultValue?: string | number;
}

export interface NumberFieldConfig extends BaseFieldConfig {
  type: "number";
  defaultValue?: number;
  style?: "input" | "slider";
  min?: number;
  max?: number;
  step?: number;
}

export interface RangeFieldConfig extends BaseFieldConfig {
  type: "range";
  defaultValue?: [number, number];
  min?: number;
  max?: number;
  step?: number;
}

export interface BooleanFieldConfig extends BaseFieldConfig {
  type: "boolean";
  defaultValue?: boolean;
  onLabel?: string;
  offLabel?: string;
}
export interface DateFieldConfig extends BaseFieldConfig {
  type: "date";
  defaultValue?: Date | string;
}

export interface ConfirmFieldConfig extends BaseFieldConfig {
  type: "confirm";
  value?: string;
}

export type FormPageConfig = {
  fields: FieldConfig[];
  title?: string;
  description?: string;
};

export type FormDialogConfig = {
  title: string;
  description?: string;
  fields?: FieldConfig[];
  pages?: FormPageConfig[];
  submitLabel?: string;
  submitVariant?: "default" | "outline" | "destructive" | "ghost" | "link";
  cancelLabel?: string;
  cancelVariant?: "default" | "outline" | "destructive" | "ghost" | "link";
};

type FormDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  config: FormDialogConfig | null;
  onSubmit: (values: Record<string, any>) => void;
};

export function FormDialog({
  open,
  onOpenChange,
  config,
  onSubmit,
}: FormDialogProps) {
  const isMultiPage = useMemo(
    () => config?.pages !== undefined && config.pages.length > 0,
    [config?.pages],
  );

  const allFields = useMemo(() => {
    if (!config) return [];
    if (isMultiPage) {
      return config.pages?.flatMap((page) => page.fields) || [];
    }
    return config.fields || [];
  }, [isMultiPage, config?.pages, config?.fields, config]);

  const [currentPageIndex, setCurrentPageIndex] = useState(0);
  const pages = useMemo(
    () => (isMultiPage && config ? config.pages || [] : []),
    [isMultiPage, config?.pages, config],
  );

  const schema = useMemo(
    () =>
      z.object(
        allFields
          .filter((field) => field.type !== "label")
          .reduce(
            (acc, field) => {
              if (field.validation) {
                acc[field.name] = field.validation;
                return acc;
              }

              if (field.type === "confirm") {
                const value = field.value ?? "CONFIRM";
                acc[field.name] = z.enum([value], {
                  message:
                    "Ihre Eingabe stimmt nicht mit der erwarteten Eingabe überein",
                });
                return acc;
              }

              if (field.type === "number") {
                acc[field.name] = z.number().optional();
                return acc;
              }

              if (field.type === "boolean") {
                acc[field.name] = z.boolean().optional();
                return acc;
              }

              if (field.type === "range") {
                acc[field.name] = z.tuple([z.number(), z.number()]).optional();
                return acc;
              }

              if (field.type === "date") {
                acc[field.name] = z.date().optional();
                return acc;
              }

              if (field.type === "outOf") {
                acc[field.name] = z.number().optional();
                return acc;
              }

              if (field.type === "outOfMulti") {
                acc[field.name] = z.array(z.number()).optional();
                return acc;
              }

              acc[field.name] = z.string().optional();
              return acc;
            },
            {} as Record<string, z.ZodTypeAny>,
          ),
      ),
    [allFields],
  );

  const defaultValues = useMemo(
    () =>
      allFields
        .filter((field) => field.type !== "label")
        .reduce(
          (acc, field) => {
            if (field.type === "confirm") {
              acc[field.name] = "";
            } else if ("defaultValue" in field) {
              acc[field.name] = field.defaultValue;
            } else {
              if (field.type === "boolean") {
                acc[field.name] = false;
              } else if (field.type === "number") {
                acc[field.name] = 0;
              } else if (field.type === "outOf") {
                acc[field.name] = 0;
              } else if (field.type === "outOfMulti") {
                acc[field.name] = [];
              } else if (field.type === "range") {
                acc[field.name] = [0, 0];
              } else if (field.type === "date") {
                acc[field.name] = new Date();
              } else {
                acc[field.name] = "";
              }
            }
            return acc;
          },
          {} as Record<string, any>,
        ) || {},
    [allFields],
  );

  const form = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  useEffect(() => {
    if (open && config) {
      setCurrentPageIndex(0);
      form.reset(defaultValues);
    }
  }, [open, config, form, defaultValues]);

  const isFieldRequired = (field: FieldConfig): boolean => {
    if (field.type === "label") return false;
    if (!field.validation) return false;
    try {
      const result = field.validation.safeParse(undefined);
      if (result.success) {
        return false;
      }
    } catch {}
    return true;
  };

  const isPageSkippable = (pageIndex: number): boolean => {
    if (!isMultiPage || !pages[pageIndex]) return false;
    const pageFields = pages[pageIndex].fields;
    return pageFields.every((field) => !isFieldRequired(field));
  };

  const validateCurrentPage = async (): Promise<boolean> => {
    if (!isMultiPage || !pages[currentPageIndex]) return true;

    const pageFields = pages[currentPageIndex].fields;
    const fieldNames = pageFields
      .filter((f) => f.type !== "label")
      .map((f) => f.name);

    console.log(form.getValues());

    const result = await form.trigger(fieldNames as any);
    return result;
  };

  const handleNext = async () => {
    if (!isMultiPage) return;

    const isValid = await validateCurrentPage();
    if (!isValid) {
      toast.error("Bitte füllen Sie alle erforderlichen Felder aus");
      return;
    }

    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPageIndex > 0) {
      setCurrentPageIndex(currentPageIndex - 1);
    }
  };

  const handleSkip = () => {
    if (!isMultiPage) return;
    if (currentPageIndex < pages.length - 1) {
      setCurrentPageIndex(currentPageIndex + 1);
    }
  };

  const handleSubmit = form.handleSubmit((values) => {
    onSubmit(values);
    form.reset();
    setCurrentPageIndex(0);
    onOpenChange(false);
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    if (!isMultiPage || isLastPage) {
      handleSubmit(e);
    }
  };

  const handleExplicitSubmit = async () => {
    if (!isMultiPage || isLastPage) {
      const isValid = await form.trigger();
      if (isValid) {
        const values = form.getValues();
        onSubmit(values);
        form.reset();
        setCurrentPageIndex(0);
        onOpenChange(false);
      }
    }
  };

  const handlePressCopy = (value: string) => {
    navigator.clipboard.writeText(value);
    toast.success("Wert wurde in die Zwischenablage kopiert");
  };

  const currentPageFields = isMultiPage
    ? pages[currentPageIndex]?.fields || []
    : config?.fields || [];

  const currentPage = isMultiPage ? pages[currentPageIndex] : null;
  const isLastPage = isMultiPage ? currentPageIndex === pages.length - 1 : true;
  const isFirstPage = currentPageIndex === 0;
  const canGoBack = isMultiPage && !isFirstPage;
  const canGoForward = isMultiPage && !isLastPage;
  const showSkip =
    isMultiPage && isPageSkippable(currentPageIndex) && canGoForward;

  const groupedFields = useMemo(() => {
    const groups: (FieldConfig | FieldConfig[])[] = [];
    let i = 0;
    while (i < currentPageFields.length) {
      const currentField = currentPageFields[i];
      if (!currentField) {
        i += 1;
        continue;
      }
      if (currentField.type === "label") {
        groups.push(currentField);
        i += 1;
        continue;
      }
      if (currentField.noBreak) {
        // Collect all consecutive fields with noBreak
        const group: FieldConfig[] = [currentField];
        let j = i + 1;
        while (j < currentPageFields.length) {
          const nextField = currentPageFields[j];
          if (!nextField) break;
          if (nextField.type === "label") break;
          group.push(nextField);
          if (!nextField.noBreak) {
            j += 1;
            break;
          }
          j += 1;
        }
        groups.push(group);
        i = j;
      } else {
        groups.push(currentField);
        i += 1;
      }
    }
    return groups;
  }, [currentPageFields]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>
            {isMultiPage && currentPage?.title
              ? currentPage.title
              : config?.title}
          </DialogTitle>
          {(isMultiPage && currentPage?.description) ||
          (!isMultiPage && config?.description) ? (
            <DialogDescription>
              {isMultiPage && currentPage?.description
                ? currentPage.description
                : config?.description}
            </DialogDescription>
          ) : null}
        </DialogHeader>

        {/* {isMultiPage && pages.length > 1 && (
          <div className="flex items-center justify-center gap-2 py-4">
            {pages.map((_, index) => {
              const isCurrent = index === currentPageIndex;
              const isPast = index < currentPageIndex;
              return (
                <div
                  key={index}
                  className={cn(
                    "h-2 w-2 rounded-full transition-colors",
                    isCurrent
                      ? "bg-primary ring-primary/50 ring-2 ring-offset-2"
                      : isPast
                        ? "bg-foreground"
                        : "bg-muted-foreground/30",
                  )}
                />
              );
            })}
          </div>
        )} */}

        {isMultiPage && pages.length > 1 && (
          <Stepper
            value={currentPageIndex + 1}
            className="mx-auto w-full max-w-1/2 gap-2"
          >
            {pages.map(({ title, description }, index) => (
              <StepperItem key={index} step={index + 1} className="flex-1">
                <StepperIndicator
                  asChild
                  className="bg-border h-1 w-full flex-col items-start gap-2"
                >
                  <span className="sr-only">{index + 1}</span>
                </StepperIndicator>
              </StepperItem>
            ))}
          </Stepper>
        )}

        {config && (
          <form onSubmit={handleFormSubmit} className="space-y-4">
            {groupedFields.map((group) => {
              const isGroup = Array.isArray(group);
              const fields = isGroup ? group : [group];

              return (
                <div
                  key={
                    isGroup
                      ? fields.map((f) => f.name).join("-")
                      : fields[0]?.name || "field"
                  }
                  className={isGroup ? "flex gap-4" : ""}
                >
                  {fields.map((field, index) => (
                    <div
                      key={`${field.name}-${index}`}
                      className={`${isGroup ? "flex-1" : "w-full"} space-y-2`}
                    >
                      {field.type == "confirm" ? (
                        <Label htmlFor={field.name}>
                          Gib
                          <Button
                            variant="outline"
                            size="xs"
                            role="button"
                            className="mx-1"
                            onClick={(e) => {
                              e.preventDefault();
                              handlePressCopy(field.value as string);
                            }}
                          >
                            <Copy className="size-4" />
                            {field.value}
                          </Button>
                          unterhalb ein um zu bestätigen.
                        </Label>
                      ) : (
                        <>
                          {field.label && (
                            <Label
                              htmlFor={field.name}
                              className="flex items-center gap-1"
                            >
                              <span
                                className={cn("text-sm font-medium", {
                                  "font-bold": field.type === "label",
                                })}
                              >
                                {field.label}
                              </span>

                              {field.info && (
                                <TooltipProvider delayDuration={0}>
                                  <Tooltip>
                                    <TooltipTrigger asChild>
                                      <InfoIcon className="hover:text-accent-foreground size-3" />
                                    </TooltipTrigger>
                                    <TooltipContent className="dark py-3">
                                      <div className="flex gap-3">
                                        <div className="space-y-1">
                                          <p className="text-xs">
                                            {field.info}
                                          </p>
                                        </div>
                                      </div>
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </Label>
                          )}
                        </>
                      )}
                      {field.type === "select" ? (
                        <SelectWithSearch
                          id={field.name}
                          value={(form.watch(field.name) as string) || ""}
                          onValueChange={(value) =>
                            form.setValue(field.name, value, {
                              shouldValidate: true,
                            })
                          }
                          options={field.options || []}
                          placeholder={field.placeholder || "Option auswählen"}
                          searchPlaceholder="Suche..."
                          emptyMessage="Keine Option gefunden."
                        />
                      ) : field.type === "textarea" ? (
                        <Textarea
                          id={field.name}
                          value={(form.watch(field.name) as string) || ""}
                          onChange={(e) => {
                            form.setValue(field.name, e.target.value, {
                              shouldValidate: true,
                            });
                          }}
                          placeholder={field.placeholder}
                        />
                      ) : field.type === "date" ? (
                        <DatePicker
                          id={field.name}
                          defaultValue={
                            field.defaultValue
                              ? typeof field.defaultValue === "string"
                                ? new Date(
                                    (field as DateFieldConfig)
                                      .defaultValue as string,
                                  )
                                : field.defaultValue instanceof Date
                                  ? field.defaultValue
                                  : undefined
                              : undefined
                          }
                          onSelect={(date: Date | undefined) => {
                            form.setValue(field.name, date ?? new Date(), {
                              shouldValidate: true,
                            });
                          }}
                        />
                      ) : field.type === "boolean" ? (
                        <div className="flex items-center gap-2">
                          <Switch
                            id={field.name}
                            defaultChecked={field.defaultValue as boolean}
                            onCheckedChange={(checked) => {
                              form.setValue(field.name, checked, {
                                shouldValidate: true,
                              });
                            }}
                          />
                          <Label
                            htmlFor={field.name}
                            className="text-sm font-medium"
                          >
                            {form.getValues(field.name)
                              ? field.onLabel
                              : field.offLabel}
                          </Label>
                        </div>
                      ) : field.type === "number" ? (
                        field.style === "slider" ? (
                          <div className="*:not-first:mt-4">
                            <div>
                              <Slider
                                id={field.name}
                                defaultValue={[field.defaultValue as number]}
                                min={field.min || 0}
                                max={field.max || 100}
                                step={field.step || 1}
                                onValueChange={(value) => {
                                  form.setValue(field.name, value[0], {
                                    shouldValidate: true,
                                  });
                                }}
                              />
                              <span
                                className="text-muted-foreground mt-4 flex w-full items-center justify-between gap-1 text-xs font-medium"
                                aria-hidden="true"
                              >
                                <span>{field.min || 0}</span>
                                <span>{form.getValues(field.name)}</span>
                                <span>{field.max || 100}</span>
                              </span>
                            </div>
                          </div>
                        ) : (
                          <NumberInput
                            id={field.name}
                            defaultValue={field.defaultValue as number}
                            placeholder={field.placeholder}
                            onValueChange={(value) => {
                              form.setValue(field.name, value, {
                                shouldValidate: true,
                              });
                            }}
                            min={field.min || 0}
                            max={field.max || 100}
                            step={field.step || 1}
                          />
                        )
                      ) : field.type === "range" ? (
                        <div className="*:not-first:mt-4">
                          <Slider
                            id={field.name}
                            defaultValue={field.defaultValue}
                            min={field.min || 0}
                            max={field.max || 100}
                            step={field.step || 1}
                            onValueChange={(value) => {
                              form.setValue(field.name, value, {
                                shouldValidate: true,
                              });
                            }}
                          />
                          <span
                            className="text-muted-foreground mt-4 flex w-full items-center justify-between gap-1 text-xs font-medium"
                            aria-hidden="true"
                          >
                            <span>{field.min || 0}</span>
                            <span>
                              {form.getValues(field.name)[0]} -{" "}
                              {form.getValues(field.name)[1]}
                            </span>
                            <span>{field.max || 100}</span>
                          </span>
                        </div>
                      ) : field.type === "user" ? (
                        <UserSearchInput
                          value={(form.watch(field.name) as string) || ""}
                          onChange={(value) => {
                            form.setValue(field.name, value, {
                              shouldValidate: true,
                            });
                          }}
                          config={field.config}
                          placeholder={field.placeholder || "Suche Benutzer..."}
                        />
                      ) : field.type === "confirm" ? (
                        <Input
                          id={field.name}
                          value={(form.watch(field.name) as string) || ""}
                          onChange={(e) => {
                            form.setValue(field.name, e.target.value, {
                              shouldValidate: true,
                            });
                          }}
                          type="text"
                          placeholder={field.placeholder}
                        />
                      ) : field.type === "password" ? (
                        <PasswordInput
                          id={field.name}
                          value={(form.watch(field.name) as string) || ""}
                          onChange={(e) => {
                            form.setValue(field.name, e.target.value, {
                              shouldValidate: true,
                            });
                          }}
                          placeholder={field.placeholder}
                        />
                      ) : field.type === "outOf" ||
                        field.type === "outOfMulti" ? (
                        <OutOfField
                          field={field}
                          value={form.watch(field.name) as number | number[]}
                          onChange={(value) => {
                            form.setValue(field.name, value, {
                              shouldValidate: true,
                            });
                          }}
                        />
                      ) : field.type === "text" || field.type === "email" ? (
                        <Input
                          id={field.name}
                          value={(form.watch(field.name) as string) || ""}
                          onChange={(e) => {
                            form.setValue(field.name, e.target.value, {
                              shouldValidate: true,
                            });
                          }}
                          type={field.type || "text"}
                          placeholder={field.placeholder}
                        />
                      ) : null}
                      {form.formState.errors[field.name] && (
                        <p className="text-destructive text-sm">
                          {form.formState.errors[field.name]?.message as string}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              );
            })}
            <DialogFooter className="flex flex-wrap items-center justify-between gap-2 sm:flex-nowrap sm:justify-between">
              <div className="flex items-center gap-2">
                {canGoBack && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handlePrevious}
                    className="shrink-0 gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Zurück
                  </Button>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-2 sm:flex-nowrap">
                {showSkip && (
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={handleSkip}
                    className="shrink-0"
                  >
                    Überspringen
                  </Button>
                )}
                <Button
                  type="button"
                  variant={config.cancelVariant || "outline"}
                  onClick={() => {
                    form.reset();
                    setCurrentPageIndex(0);
                    onOpenChange(false);
                  }}
                  className="shrink-0"
                >
                  {config.cancelLabel || "Abbrechen"}
                </Button>
                {canGoForward ? (
                  <Button
                    type="button"
                    variant={config.submitVariant || "default"}
                    onClick={handleNext}
                    className="shrink-0 gap-2"
                  >
                    Weiter
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant={config.submitVariant || "default"}
                    onClick={handleExplicitSubmit}
                    className="shrink-0"
                  >
                    {config.submitLabel || "Speichern"}
                  </Button>
                )}
              </div>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
