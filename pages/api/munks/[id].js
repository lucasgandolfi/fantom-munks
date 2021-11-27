import Cors from "cors";

export default async function handler(req, res) {
  await Cors(req, res);
  const id = req.query.id;
  res.status(200).json({
    message: "test",
  });
}
