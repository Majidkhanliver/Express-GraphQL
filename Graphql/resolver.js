const User = []
const validator = require('validator')
const jwt = require('jsonwebtoken');
const posts = [];
module.exports = {
  createUser: async function ({ userInput }, req) {
    const errors = [];
    if (!validator.isEmail(userInput.email)) {
      errors.push({ message: "Invalid Email" });
    }
    if (validator.isEmpty(userInput.password) ) {
      errors.push({message:'Password too short'})
    }
    if (errors.length > 0) {
      const error = new Error("invalid input");
      error.data = errors;
      error.code = 422;
      throw error
    }
    // const email = args.userInput.email
    const email = userInput.email;
    const existing = User.filter(user => user.email == email)
    if (existing.length > 0)
    {
      const error = new Error('user Already exits')
      throw error;
    }
    User.push(userInput);
    return userInput
  },
  login: async function({ email, password }) {
    const user = User.filter((newUser) => newUser.email == email);
    if (user.length == 0) {
      const error = new Error('Invalid Email Id');
      error.code = 404;
      throw error
    }
    if (!password == user[0].password) {
       const error = new Error("Invalid Password");
       error.code = 404;
       throw error;
    }
    const token = jwt.sign(user[0], 'MyScretKey');
    return { userId: user[0].email, token };
  },
  createPost({ postInput }, req) {
    if (!req.isAuth) {
      const error = new Error('Not authenticated');
      error.code = 401;
      throw error
    }
    const errors = [];
    if (validator.isEmpty(postInput.title) || !validator.isLength(postInput.title, { min: 5 })) {
      errors.push({message:'Title is invalid'})
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      errors.push({ message: "content is invalid" });
    }
    if (errors.length > 0) {
      const error = new Error("invalid input");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    postInput.id = req.userId;
    posts.push(postInput);
    console.log(posts)
    return postInput;
  },
  
  getPost: async function ({page},req) {
    // if (!req.isAuth) {
    //   const error = new Error("Not authenticated");
    //   error.code = 401;
    //   throw error;
    // }
    if (!page) {
      page = 1;
    }
    const perPage = 2;
    const newPosts = posts.slice((page-1)*perPage,page*perPage)
    return { posts: newPosts, totalPosts: posts.length };
  },
  updatePost: async function({ id, post },req) {
       if (!req.isAuth) {
         const error = new Error("Not authenticated");
         error.code = 401;
         throw error;
    }
    const foundPost = post.filter(p => p.id == id);
    if (foundPost.length == 0) {
      const error = new Error("No Post Found");
      error.data = errors;
      error.code = 422;
      throw error;
    }
    const otherPosts = post.filter(p => p.id != id)
    otherPosts.push(post);
    post = otherPosts
  }
};