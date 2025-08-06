export const uploadImage = async (req, res) => {
  if (!req.files || req.files.length === 0) {
    return res.status(400).json({ error: "Nenhum arquivo enviado" });
  }

  const urlsPorCampo = {};

  req.files.forEach((file, index) => {
    const [campoOriginal] = file.fieldname.split("__");

    const fotoInfo = {
      descricao: `${file.fieldname} ${index + 1}`,
      url: file.path,
      cloudinaryId: file.filename,
    };

    if (!urlsPorCampo[campoOriginal]) {
      urlsPorCampo[campoOriginal] = [];
    }

    urlsPorCampo[campoOriginal].push(fotoInfo);
  });

  return res.status(200).json({
    status: true,
    message: "URLs criadas com sucesso.",
    urlsPorCampo,
  });
};
