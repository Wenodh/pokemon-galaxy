import { Result, Collection } from "../types";

export const validateCollectionName = (
  name: string,
  existingCollections: Collection[],
  excludeId?: string
): Result<string> => {
  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return { ok: false, error: "EMPTY_NAME" };
  }

  if (trimmedName.length > 40) {
    return { ok: false, error: "NAME_TOO_LONG" };
  }

  const isDuplicate = existingCollections.some(
    (col) =>
      col.name.toLowerCase() === trimmedName.toLowerCase() &&
      col.id !== excludeId
  );

  if (isDuplicate) {
    return { ok: false, error: "DUPLICATE_NAME" };
  }

  return { ok: true, value: trimmedName };
};

export const generateUniqueCollectionCopyName = (
  originalName: string,
  existingCollections: Collection[]
): string => {
  const baseName = `${originalName} Copy`;
  let candidateName = baseName;
  let counter = 2;

  const names = new Set(existingCollections.map((c) => c.name.toLowerCase()));

  while (names.has(candidateName.toLowerCase())) {
    candidateName = `${baseName} ${counter}`;
    counter++;
  }

  return candidateName;
};
