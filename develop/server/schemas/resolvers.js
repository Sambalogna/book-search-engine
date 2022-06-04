const {User, Book} = require('../models')
const {signToken} = require('../utils/auth')
const { AuthenticationError } = require('apollo-server-express');

const resolvers = {
    Query: {
        me: async (_parent, _arg, context) => {
            if(context.user) {
                return User.findOne({_id: context.user._id}).populate('savedBooks')
            }
            throw newAuthenticationError('You need to be logged in!');
        }
    },
    Mutation: {

    }
}

module.exports = resolvers;