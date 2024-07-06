const Users = require("../models/users-model");
const Activities = require("../models/activities-model");
const Food = require("../models/foods-model");
const Films = require("../models/movies-model");
const Tv_Shows = require("../models/tv-shows-model");

const getUsers = async (req, res) => {
  try {
    const users = await Users.find();
    res.status(200).json({ success: true, data: users });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error.message });
  }
};

const postUser = async (req, res) => {
  try {
    const { username } = req.body[0];

    if (username.length === 0) {
      return res.status(400).json({
        success: false,
        message:
          "Bad Request - please enter a username with one or more characters",
      });
    }

    const user_activities = await Activities.distinct("_id", {}, {});
    const user_food_choices = await Food.distinct("_id", {}, {});
    const user_films = await Films.distinct("_id", {}, {});
    const user_tv_shows = await Tv_Shows.distinct("_id", {}, {});

    if (!Array.isArray(req.body)) {
      return res
        .status(400)
        .json({ success: false, message: "Input should be an array" });
    }

    const savedUser = await Users.updateOne(
      { username },
      {
        $set: {
          user_activities,
          user_food_choices,
          user_films,
          user_tv_shows,
        },
      },
      { upsert: true }
    );

    res.status(201).json({ success: true, data: savedUser });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { _id } = req.body;
    const [userToDelete] = await Users.find({ _id });
    await Users.deleteOne({ _id });
    res
      .status(200)
      .json({
        success: true,
        message: `${userToDelete.username} has been deleted from our records`,
      });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error.message });
  }
};

const getUserById = async (req, res) =>{
  try{
    const { user_id } = req.params;
    const user = await Users.findOne({ _id : user_id })
    res.status(200).json({ success: true, data: user })
  }catch(error){
    res.status(409).json({ success: false, data: [], error: error.message });
  }
}


const getUserCategories = async (req, res) => {
  try {
    const { user_id } = req.params;
    const userData = await Users.findOne({ _id : user_id });
    if (!userData) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const userDataAsObj = userData.toObject();
    const userKeys = Object.keys(userDataAsObj);
    const userCategories = userKeys.filter((cat) =>
      cat !== "_id" && cat !== "username" && cat !== "__v"
    );
    res.status(200).json({ success: true, data: userCategories });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error.message });
  }
};

const getUserCategoryEntries = async (req, res) =>{
  const models = {
    user_activities: Activities,
    user_food_choices: Food,
    user_films: Films,
    user_tv_shows: Tv_Shows,
  };
  try{
    const { user_id, category } = req.params;
    const user = await Users.findById(user_id);

    const categoryIds = user[category]

    const categoryModel = models[category];

    const categoryEntries = await Promise.all(categoryIds.map(async (categoryId) => {
      const entry = await categoryModel.findById(categoryId);
      return entry
    }));
    const filteredCategoryEntries = categoryEntries.filter((entry)=> entry!== null)

    if(filteredCategoryEntries.length === 0){
      return res.status(400).json({ success: False, message: "There are no entries in this category" })
    }

    res.status(200).json({ success: true, data: filteredCategoryEntries });
  }catch(error){
    res.status(409).json({ success: false, data: [], error: error.message });
  }
}

const postEntryToUserCategory = async (req, res) => {
  const { user_id, category } = req.params;
  const { entryId } = req.body;

  try {
    const user = await Users.findById(user_id);

    console.log(user_id, category, entryId)
    
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    console.log(user[category])
    
    if (user[category].includes(entryId)) {
      return res.status(409).json({ success: false, message: "You already have this entry on your profile" });
    }
    
    user[category].push(entryId);
    await user.save();
    
    console.log(user)

    res.status(200).json({ success: true, data: user[category] });
  } catch (error) {
    res.status(409).json({ success: false, data: [], error: error.message });
  }
};

const patchUserEntriesByEntryId = async (req, res) => {
  const { user_id, category } = req.params;
  const { entryId } = req.body
  
  try{
  await Users.updateOne(
    {_id: user_id},
    { $pull: { [category]: entryId } }
  )

    res.status(200).json({ success: true, message: `That option has been removed from ${category}` });
  }catch(error){
    console.log(error)
    res.status(409).json({ success: false, data: [], error: error.message });
}
}




module.exports = { 
  postUser, 
  getUsers, 
  deleteUser, 
  getUserCategories, 
  getUserById, 
  getUserCategoryEntries,
  postEntryToUserCategory, 
  patchUserEntriesByEntryId 
};
