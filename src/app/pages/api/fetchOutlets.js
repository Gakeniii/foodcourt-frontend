export default async (req, res) => {
  try {
    const response = await fetch('https://foodcourt-db.onrender.com/outlets');
    if (!response.ok) throw new Error('Network response was not ok');
    const data = await response.json();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
