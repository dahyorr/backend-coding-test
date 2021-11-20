import { gql } from 'graphql-request'

// Queries
export const getPostsQuery = gql`
    query GetPosts($count: Int!, $after: Int!) {
        posts(limit: $count order_by: {id: asc}  where: {id: {_gt: $after}}) {
            id
            title
            lastUpdated
            published
            author {
                name
            }
        }
    }
`

export const getPostQuery = gql`
    query GetPost($id: Int!) {
        posts_by_pk(id: $id) {
            id
            title
            content
            published
            createdAt
            lastUpdated
            author {
                name
            }
        }
    }
`

export const getPostAuthorQuery = gql`
    query GetPostAuthor($id: Int!) {
        posts_by_pk(id: $id) {
            authorId
        }
    }
`

export const searchPostQuery = gql`
    query SearchPosts($searchQuery: String!) {
        posts(where: {_or: [{title: {_ilike: $searchQuery}}, {content: {_ilike: $searchQuery}}]}) {
            id
            title
        }
    }
`

// Mutations
export const deletePostMutation = gql`
    mutation DeletePost($id: Int!) {
        delete_posts_by_pk(id: $id) {
            id
        }
    }
`

export const createPostMutation = gql`
    mutation CreatePost($title: String!, $authorId: String!, $content: String!, $published: Boolean) {
            insert_posts_one(object: {title: $title, authorId: $authorId, content: $content, published: $published}) {
                id
                title
                lastUpdated
                createdAt
                published
                content
                author{
                    name
                }
            }
    }
`

export const createUserProfileMutation = gql`
    mutation CreateUserProfile($uid: String!, $dateOfBirth: date!, $name: String!) {
        insert_users_one(object: {uid: $uid, dateOfBirth: $dateOfBirth, name: $name}) 
        {
            name
            dateOfBirth
            uid
            createdAt
        }
    }
`

export const updatePostMutation = gql`
    mutation UpdatePost($id: Int!, $title: String!, $content: String!, $published: Boolean) {
        update_posts_by_pk(pk_columns: {id: $id}, _set: {
            title: $title, 
            content: $content, 
            published: $published
        }) {
            id
            title
            content
            published
            lastUpdated
            createdAt
            author {
                name
            }
        }
    }
`