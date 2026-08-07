import DataLoader from 'dataloader'
import Author from './models/author.js'

const batchAuthors = async (authorIds) => {
    const authors = await Author.find({ _id: { $in: authorIds } })
    const authorMap = authors.reduce((acc, author) => {
        acc[author._id.toString()] = author
        return acc
    }, {})
    
    return authorIds.map(authorId => authorMap[authorId.toString()])
}

export const createAuthorLoader = () => new DataLoader(batchAuthors)