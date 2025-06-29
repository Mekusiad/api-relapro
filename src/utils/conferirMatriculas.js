export const conferirMatriculas = (matricula, decodedMatricula) => {
  if (decodedMatricula !== matricula) return false;

  return true;
};
