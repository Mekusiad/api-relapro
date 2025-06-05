export const handleError = (
  res,
  error,
  defaultMessage = "Erro interno do servidor."
) => {
  console.error(error);
  return res.status(500).json({
    status: false,
    message: defaultMessage,
  });
};
