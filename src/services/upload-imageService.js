export const uploadImage = async (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  const urls = [];

  for (const [campo, arquivos] of Object.entries(req.files)) {
    arquivos.forEach((file, index) => {
      urls.push({
        descricao: `${campo} ${index + 1}`,
        url: file.path,
        cloudinaryId: file.filename,
      });
    });
  }

  return res.status(200).json({
    status: true,
    message: "URLs criadas com sucesso.",
    urls,
  });
};
