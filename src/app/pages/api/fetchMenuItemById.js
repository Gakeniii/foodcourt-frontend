export default async (req, res) => {
  const { id } = req.query;

  try {
    const response = await fetch(`https://foodcourt-db.onrender.com/menu_items/${id}`);
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
