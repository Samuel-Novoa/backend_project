import Role from "../../models/roles";

const getData = async (req, res) => {
  try {
    const data = await Role.findAll();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getDataById = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Role.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: 'Venta no encontrada' });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const postData = async (req, res) => {
  const { role_name } = req.body;
  try {
    const newPost = await Role.create({ role_name });
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateDataById = async (req, res) => {
  const { id } = req.params;
  const { role_name } = req.body;
  try {
    const data = await Role.findByPk(id);
    if (!data) {
      return res.status(404).json({ message: 'Role not found' });
    }
    data.role_name = role_name;
    await data.save();
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export { getData, getDataById, postData, updateDataById };
