const _ = require('lodash')

const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    return blogs.length === 0
    ? 0
    : blogs.reduce((sum, blog) => sum + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) return null

    const favorite = blogs.reduce((prev, current) => {
    return (prev.likes > current.likes) ? prev : current
    })

    return {
    title: favorite.title,
    author: favorite.author,
    likes: favorite.likes
    }
}

const mostBlogs = (blogs) => {
    if (blogs.length === 0) return null

  // Contamos cuántos blogs tiene cada autor
    const authorCounts = _.countBy(blogs, 'author')
    
  // Encontramos el autor con el valor más alto
    const topAuthor = _.maxBy(Object.keys(authorCounts), (author) => authorCounts[author])

    return {
    author: topAuthor,
    blogs: authorCounts[topAuthor]
    }
}

const mostLikes = (blogs) => {
    if (blogs.length === 0) return null

  // Agrupamos blogs por autor y sumamos sus likes
    const authorLikes = _(blogs)
    .groupBy('author')
    .map((objs, key) => ({
        author: key,
        likes: _.sumBy(objs, 'likes')
    }))
    .value()

    return _.maxBy(authorLikes, 'likes')
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes
}