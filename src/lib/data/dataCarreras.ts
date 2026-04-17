// src/lib/data/studyData.ts
export const facultyCareerMap = {
  'Ingeniería': ['Ingeniería Civil', 'Ingeniería Informática', 'Ingeniería Eléctrica'],
  'Ciencias Sociales': ['Psicología', 'Sociología', 'Trabajo Social'],
  'Medicina': ['Medicina General', 'Enfermería', 'Kinesiología'],
  'Derecho': ['Derecho', 'Ciencias Jurídicas'],
  'Arquitectura': ['Arquitectura', 'Urbanismo', 'Diseño de Interiores'],
  // Añade aquí todas las facultades y carreras que necesites
};

export type Faculty = keyof typeof facultyCareerMap;
export const faculties = Object.keys(facultyCareerMap) as Faculty[];