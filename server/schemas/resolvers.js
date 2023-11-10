const {User} = require('../models');
const {signToken} = require('../utils/auth');
const {AuthenticationError} = require('apollo-server-express');

const logInErrorMesssage = 'Invalid Email Or Password';
const notLoggedInMessage = 'You Must Log In';

async function addRemoveBook(userId, operation, bookData){
    try {
        if(!userId){
            throw new AuthenticationError(notLoggedInMessage);
        }
        if(operation === 'add'){
            updateQuery = {$push: {savedBooks: bookData}};
        }else if(operation === 'remove'){
            updateQuery = {$pull: {savedBooks: {bookId: bookData.bookId}}};
        }
        updateUser = await User.findByIdAndUpdate(
            {_id: userId},
            updateQuery,
            {new: true, runValidators: true}
        );
        return updateQuery;
    } catch (error) {
        console.log(`Error addRemoveBook: ${error}`)
    }

}

module.exports = resolvers = {
    Query: {
        checkLoggedIn: async ({}, {}, context) => {
            if(context.user){
                const userData = await User.findOne({_id: context.user._id}).select('-__v -password');
                return userData;
            }
            throw new AuthenticationError(notLoggedInMessage);
        }
    },
    Mutation: {
        login: async ({}, {email, password}) => {
            const user = await User.findOne({email});
            if(!user){
                throw new AuthenticationError(logInErrorMesssage)
            }
            const correctPassword = await user.isCorrectPassword(password);
            if(!correctPassword){
                throw new AuthenticationError(logInErrorMesssage)
            }
            const signedtoken = signToken(user);
            return {signedtoken, user};
        }
    },
    addUser: async ({}, args) => {
        const user = await User.create(args);
        const signedtoken = signToken(user);
        return {signedtoken, user};
    },
    saveBook: async ({}, {newBook}, context) => {
            const updateUser = await addRemoveBook(context.id, 'add', newBook)
            return updateUser;
    },
    removeBook: async ({}, {newBook}, context) => {
        const updateUser = await addRemoveBook(context.id, 'remove', newBook)
        return updateUser;
    }
}