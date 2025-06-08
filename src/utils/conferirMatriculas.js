export const conferirMatriculas = (matricula, decodedMatricula) => {
  if (decodedMatricula !== Number(matricula)) return false;

  return true;
};
