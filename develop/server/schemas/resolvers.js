const {User, Book} = require('../models')
const {signToken} = require('../utils/auth')
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (_parent, _arg, context) => {
            if(context.user) {
                return User.findOne({_id: context.user._id})
                //.populate? 
                .populate('savedBooks')
            }
            throw new AuthenticationError('Login Please!');
        }
    },
    Mutation: {
        addUser: async (_parent, {username,email,password})=>{
            const user = await User.create(
                {username, email, password})
                const token = signToken(user)
                return {token, user}
        },
        login: async (_parent, {email, password})=>{
            const user = await User.findOne({email});
            if(!user) {
                throw new AuthenticationError('No user with that email')
            }
            const correctPassword = await user.isCorrectPassword(password)
            if(!correctPassword){
                throw new AuthenticationError('incorrect password')
            }
            const token = signToken(user)
            return {token, user};
        },
        saveBook: async (_parent, {book}, context) => {
            console.log(context.user, book)
            if(context.user){
            const updatedUser = await User.findOneAndUpdate(
                {_id: context.user._id},
                {$addToSet:{savedBooks: book}},
                {new: true, runValidators: true}
            )
            return updatedUser;
            }
            throw new AuthenticationError('please login to save')
            
        },
    
        removeBook: async (_parent,{bookId}, context )=> {
            const updatedUser = await User.findOneAndUpdate(
                {_id: context.user_id},
                {$pull:{savedBooks:{bookId}}},
                {new: true}
            )
            if (!updatedUser) {
                throw new AuthenticationError('No book to delete')
            }
            return updatedUser
        }


    }
}

module.exports = resolvers;