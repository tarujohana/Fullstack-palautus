const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) =>{
    return blogs.reduce((sum,blog) => sum +blog.likes, 0)
}

const favouriteBlog = (blogs) => {
    if(blogs.length === 0){
        return null
    }
    const favourite =blogs.reduce((prev, current) => (prev.likes > current.likes) ? prev:current)
    return favourite
}

const mostBlogs = (blogs) =>{
    if(blogs.length === 0) {
        return null
    }
    const counts ={}
    blogs.forEach(blog => {
        if(counts[blog.author]) {
            counts[blog.author]++
        } else {
            counts[blog.author] = 1
        }
    })
    const mostBlogsAuthor = Object.keys(counts).reduce((a, b) => counts[a] > counts[b] ? a : b)
    return {
        author: mostBlogsAuthor,
        blogs: counts[mostBlogsAuthor]
    }
}

const mostLikes = (blogs) => {
    if(blogs.length === 0) {
        return null
    }
    const likesCount = {}
    blogs.forEach(blog => {
        if(likesCount[blog.author]) {
            likesCount[blog.author] += blog.likes
        } else {
            likesCount[blog.author] = blog.likes
        }  
    })
    const mostLikesAuthor = Object.keys(likesCount).reduce((a, b) => likesCount[a] > likesCount[b] ? a : b)
    return {
        author: mostLikesAuthor,
        likes: likesCount[mostLikesAuthor]
    }
}

module.exports = {
  dummy,
  totalLikes,
  favouriteBlog,
  mostBlogs,
  mostLikes
}

