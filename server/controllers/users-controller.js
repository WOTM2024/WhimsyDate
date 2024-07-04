const Users = require("../models/users-model");

const getUsers = async (req, res) => {
  try {
    const users = await Users.find();
   
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error });
  }
};

const postUsers = async (req, res) => {
  try {
   
    const { username } = req.body;
   
    const newUser = new Users({
        username: username
      });
    
      const savedUser = await newUser.save();
    
      res.status(201).json({ success: true, data: savedUser });
    } catch (error) {
      res.status(409).json({ success: false, data: [], error: error });
    }
 
};

const deleteUser = async (req, res) =>{
  try {
    const { _id } = req.body;
    const [ userToDelete ] = await Users.find({ _id });
    await Users.deleteOne({ _id });
    res.status(200).json({success: true, message: `${userToDelete.username} has been deleted from our records`})
  }catch(error){
    res.status(409).json({ success: false, data: [], error: error.message})
  }
}

module.exports = { postUsers, getUsers, deleteUser };
