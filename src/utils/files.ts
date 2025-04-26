export const renameDuplicateFile = (filename: string, files: File[]) => {
  let duplicateCount = 0;

  for (const file of files) {
    if (file.name.includes(filename)) {
      duplicateCount++;
    }
  }

  return duplicateCount > 0 ? `${filename}(${duplicateCount})` : filename;
};
