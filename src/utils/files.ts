export const renameDuplicateFile = (filename: string, files: File[]) => {
  let duplicateCount = 0;

  for (const file of files) {
    if (file.name.includes(filename)) {
      duplicateCount++;
    }
  }

  return duplicateCount > 0 ? `${filename}(${duplicateCount})` : filename;
};

export const checkIfFileExists = (
  filename: string,
  foundIndex: number,
  files: File[],
) => {
  const checkFiles = [
    ...files.slice(0, foundIndex),
    ...files.slice(foundIndex + 1),
  ];
  return checkFiles.some((file) => file.name === filename);
};

export const isFileVideo = (file: File) => {
  return file.type.startsWith('video/');
};
