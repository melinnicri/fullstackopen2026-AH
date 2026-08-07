const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

const blogs = [
    { _id: "5a422a851b54a676234d17f7", title: "React patterns", author: "Michael Chan", url: "https://reactpatterns.com/", likes: 7, __v: 0 },
    { _id: "5a422aa71b54a676234d17f8", title: "Go To Statement Considered Harmful", author: "Edsger W. Dijkstra", url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html", likes: 5, __v: 0 },
    { _id: "5a422b3a1b54a676234d17f9", title: "Canonical string reduction", author: "Edsger W. Dijkstra", url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD0808.html", likes: 12, __v: 0 },
    { _id: "5a422b891b54a676234d17fa", title: "First class tests", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll", likes: 10, __v: 0 },
    { _id: "5a422ba91b54a676234d17fb", title: "TDD harms architecture", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html", likes: 0, __v: 0 },
    { _id: "5a422bc61b54a676234d17fc", title: "Type wars", author: "Robert C. Martin", url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html", likes: 2, __v: 0 }
]

test('4.3: dummy returns one', () => {
    assert.strictEqual(listHelper.dummy([]), 1)
})

describe('4.4: total likes', () => {
    test('of a bigger list is calculated right', () => {
    assert.strictEqual(listHelper.totalLikes(blogs), 36)
    })

    test('of empty list is zero', () => {
    assert.strictEqual(listHelper.totalLikes([]), 0)
    })
})

describe('4.5: favorite blog', () => {
    test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        likes: 12
    })
    })
})

describe('4.6: most blogs', () => {
    test('returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    assert.deepStrictEqual(result, {
        author: "Robert C. Martin",
        blogs: 3
    })
    })
})

describe('4.7: most likes', () => {
    test('returns the author with most total likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, {
        author: "Edsger W. Dijkstra",
        likes: 17
    })
    })
})