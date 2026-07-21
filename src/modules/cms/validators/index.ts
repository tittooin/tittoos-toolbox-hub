import { ContentTypeConfig, ContentItem } from "../types";
import { ValidationResult } from "../schemas";

export const validateContentItem = (item: Partial<ContentItem>, config: ContentTypeConfig): ValidationResult => {
  const errors: Record<string, string> = {};

  if (!item.title?.trim()) {
    errors.title = "Title is required";
  }

  if (!item.slug?.trim()) {
    errors.slug = "Slug is required";
  }

  // Validate custom fields
  const customFields = item.customFields || {};
  config.customFields.forEach(field => {
    const value = customFields[field.name];
    if (field.required && (value === undefined || value === null || value === "")) {
      errors[`customFields.${field.name}`] = `${field.label} is required`;
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};
