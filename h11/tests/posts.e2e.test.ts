import request from "supertest";
import {app} from "../src/app";
import {HTTP_STATUS} from "../src/general/global-consts";
import {encodeToBase64ForBasicAuth} from "../src/general/utilities";
import {FULL_TESTING_ENDPOINTS} from "../src/models/testing/endpoints";
import {BLOGS_FULL_URLS} from "../src/models/blog/endpoints";
import {POSTS_FULL_URLS} from "../src/models/post/endpoints";
import {USER_FULL_URLS} from "../src/models/user/endpoints";
import {AUTH_FULL_URLS} from "../src/models/auth/endpoints";
import mongoose from "mongoose";
describe('Blogs API End-to-End Tests', () => {
    let basicAuth: string;
    let blogId: string;
    let blogName: string;
    let createdPosts: any[] = [];
    let userToken: string;

    beforeAll(async () => {
        await mongoose.connect(process.env.MONGOOSE_URL || "mongodb://localhost:27017/testdb");
        console.log("✅ Connected to test database");
        await request(app)
            .delete(FULL_TESTING_ENDPOINTS.DELETE_ALL_DATA)
            .expect(HTTP_STATUS.NO_CONTENT);

        basicAuth = await encodeToBase64ForBasicAuth(
            process.env.SUPER_SECRET_NAME || "",
            process.env.SUPER_SECRET_PSWRD || ""
        )

        const newBlogCreationData = {
            "name": "MM Post4",
            "description": "asdsadas dasdasdasdasd2",
            "websiteUrl": "https://localhost2.com"
        };

        let newBlog = await request(app)
            .post(BLOGS_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newBlogCreationData)
            .expect(HTTP_STATUS.CREATED);
        expect(newBlog).toBeDefined();
        blogId = newBlog.body.id;
        blogName = newBlog.body.name;
    });

    it('Create new post', async () => {
        const newPostCreationData = {
            "title": "my first post121",
            "shortDescription": "my first post",
            "content": "my first post111111111111111111111111111111111111111",
            "blogId": blogId
        };

        const newPost = await request(app)
            .post(POSTS_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newPostCreationData)
            .expect(HTTP_STATUS.CREATED);

        expect(newPostCreationData.title).toBe(newPost.body.title);
        expect(newPostCreationData.shortDescription).toBe(newPost.body.shortDescription);
        expect(newPostCreationData.content).toBe(newPost.body.content);
        expect(blogId).toBe(newPost.body.blogId);
        expect(newPost.body.createdAt).toBeDefined();
        expect(newPost.body.id).toBeDefined();
    });

    it('Create new post without title', async () => {
        const newPostCreationData = {
            "title": "",
            "shortDescription": "my first post",
            "content": "my first post111111111111111111111111111111111111111",
            "blogId": blogId
        };

        const newPost = await request(app)
            .post(POSTS_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newPostCreationData)
            .expect(HTTP_STATUS.BAD_REQUEST);
        expect(newPost.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(newPost.body.errorsMessages)).toBe(true);
        expect(newPost.body.errorsMessages.length).toBeGreaterThan(0);

        expect(newPost.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: "title",
                    message: "Invalid value",
                }),
            ])
        );
    });

    it('Create new post without shortDescription', async () => {
        const newPostCreationData = {
            "title": "my first post121",
            "shortDescription": "",
            "content": "my first post111111111111111111111111111111111111111",
            "blogId": blogId
        };

        const newPost = await request(app)
            .post(POSTS_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newPostCreationData)
            .expect(HTTP_STATUS.BAD_REQUEST);
        expect(newPost.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(newPost.body.errorsMessages)).toBe(true);
        expect(newPost.body.errorsMessages.length).toBeGreaterThan(0);

        expect(newPost.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: "shortDescription",
                    message: "Invalid value",
                }),
            ])
        );
    });

    it('Create new post without content', async () => {
        const newPostCreationData = {
            "title": "my first post121",
            "shortDescription": "my first post",
            "content": "",
            "blogId": blogId
        };

        const newPost = await request(app)
            .post(POSTS_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newPostCreationData)
            .expect(HTTP_STATUS.BAD_REQUEST);
        expect(newPost.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(newPost.body.errorsMessages)).toBe(true);
        expect(newPost.body.errorsMessages.length).toBeGreaterThan(0);

        expect(newPost.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: "content",
                    message: "Invalid value",
                }),
            ])
        );
    });

    it('Create new post without blogId', async () => {
        const newPostCreationData = {
            "title": "my first post121",
            "shortDescription": "my first post",
            "content": "my first post111111111111111111111111111111111111111",
            "blogId": ""
        };

        const newPost = await request(app)
            .post(POSTS_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newPostCreationData)
            .expect(HTTP_STATUS.BAD_REQUEST);
        expect(newPost.body).toHaveProperty('errorsMessages');
        expect(Array.isArray(newPost.body.errorsMessages)).toBe(true);
        expect(newPost.body.errorsMessages.length).toBeGreaterThan(0);

        expect(newPost.body.errorsMessages).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    field: "blogId",
                    message: "Invalid value",
                }),
            ])
        );
    });

    it('should create posts and verify pagination', async () => {
        // 2️⃣ Создаём 15 постов для теста пагинации
        for (let i = 1; i <= 15; i++) {
            const newPostCreationData = {
                title: `Test Post ${i}`,
                shortDescription: `Short Description ${i}`,
                content: `Content ${i}`,
                blogId: blogId,
            };

            const newPostRes = await request(app)
                .post(POSTS_FULL_URLS.CREATE)
                .set('Authorization', `Basic ${basicAuth}`)
                .send(newPostCreationData)
                .expect(HTTP_STATUS.CREATED);
            createdPosts.push(newPostRes.body);
        }

        const queryParams = new URLSearchParams({
            pageSize: '10',
            pageNumber: '1',
        }).toString();

        const res = await request(app)
            .get(POSTS_FULL_URLS.GET_WITH_QUERY_PARAMS(queryParams))
            .expect(HTTP_STATUS.OK);

        expect(res.body).toHaveProperty('pagesCount');
        expect(res.body).toHaveProperty('page', 1);
        expect(res.body).toHaveProperty('pageSize', 10);
        expect(res.body.totalCount).toBeGreaterThanOrEqual(createdPosts.length);
        expect(res.body).toHaveProperty('items');
        expect(res.body.items.length).toBeLessThanOrEqual(10);
    });

    it('should get a post by ID', async () => {
        const postToCheck = createdPosts[0];
        const res = await request(app)
            .get(POSTS_FULL_URLS.GET_BY_ID(postToCheck.id))
            .expect(HTTP_STATUS.OK);

        expect(res.body).toHaveProperty('id', postToCheck.id);
        expect(res.body).toHaveProperty('title', postToCheck.title);
        expect(res.body).toHaveProperty('shortDescription', postToCheck.shortDescription);
        expect(res.body).toHaveProperty('content', postToCheck.content);
        expect(res.body).toHaveProperty('blogId', blogId);
        expect(res.body).toHaveProperty('blogName', blogName);
        expect(res.body).toHaveProperty('createdAt');

        await request(app)
            .get(POSTS_FULL_URLS.GET_BY_ID("FAKE ID"))
            .expect(HTTP_STATUS.NOT_FOUND);
    });

    it('should delete a post', async () => {
        const postToDelete = createdPosts[0];

        await request(app)
            .delete(POSTS_FULL_URLS.DELETE_BY_ID(postToDelete.id))
            .set('Authorization', `Basic ${basicAuth}`)
            .expect(HTTP_STATUS.NO_CONTENT);

        await request(app)
            .get(POSTS_FULL_URLS.GET_BY_ID(postToDelete.id))
            .expect(HTTP_STATUS.NOT_FOUND);

        await request(app)
            .delete(POSTS_FULL_URLS.DELETE_BY_ID("FAKE iD"))
            .set('Authorization', `Basic ${basicAuth}`)
            .expect(HTTP_STATUS.NOT_FOUND);
    });

    it('should update a post', async () => {
        const postToUpdate = createdPosts[1];
        const updatedData = {
            title: 'Updated Title',
            shortDescription: 'Updated Short Description',
            content: 'Updated Content',
            blogId: postToUpdate.blogId
        };

        await request(app)
            .put(POSTS_FULL_URLS.UPDATE_BY_ID(postToUpdate.id))
            .set('Authorization', `Basic ${basicAuth}`)
            .send(updatedData)
            .expect(HTTP_STATUS.NO_CONTENT);

        const res = await request(app)
            .get(POSTS_FULL_URLS.GET_BY_ID(postToUpdate.id))
            .expect(HTTP_STATUS.OK);

        expect(res.body.title).toBe(updatedData.title);
        expect(res.body.shortDescription).toBe(updatedData.shortDescription);
        expect(res.body.content).toBe(updatedData.content);

        await request(app)
            .put(POSTS_FULL_URLS.UPDATE_BY_ID("FAKE ID"))
            .set('Authorization', `Basic ${basicAuth}`)
            .send(updatedData)
            .expect(HTTP_STATUS.NOT_FOUND);
    });

    it('should create a comment for specific post', async () => {
        const newUserCreationData = {
            login: "CARKORONI",
            password: "string14344556",
            email: "examp666@example.com"
        };

        const userData = await request(app)
            .post(USER_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newUserCreationData)
            .expect(HTTP_STATUS.CREATED);

        const loginRes = await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .set('User-Agent', "agent")
            .send({
                loginOrEmail: 'examp666@example.com',
                password: 'string14344556',
            });

        userToken = loginRes.body.accessToken;

        const postToComment = createdPosts[2];
        const commentData = {
            content: 'stray228 best of the best steamer in the world123'
        };


        const commentRes = await request(app)
            .post(POSTS_FULL_URLS.CREATE_COMMENT_FOR_SPECIFIC_POST(postToComment.id))
            .set('Authorization', `Bearer ${userToken}`)
            .send(commentData)
            .expect(HTTP_STATUS.CREATED);
        expect(commentRes.body).toHaveProperty('id');
        expect(commentRes.body.content).toBe(commentData.content);
        expect(commentRes.body).toHaveProperty('createdAt');
        expect(commentRes.body).toHaveProperty('commentatorInfo');
        expect(commentRes.body).toHaveProperty('likesInfo');
        expect(commentRes.body.likesInfo).toHaveProperty('myStatus');
        expect(commentRes.body.likesInfo.myStatus).toBe('None');
        expect(commentRes.body.likesInfo).toHaveProperty('dislikeCount');
        expect(commentRes.body.likesInfo.dislikeCount).toBe(0);
        expect(commentRes.body.likesInfo).toHaveProperty('likeCount');
        expect(commentRes.body.likesInfo.likeCount).toBe(0);
        expect(commentRes.body.commentatorInfo.userLogin).toBe(newUserCreationData.login);
    });

    it('should retrieve comments for a post with pagination', async () => {
        const queryParams = new URLSearchParams({
            pageSize: '5',
            pageNumber: '1',
        }).toString();
        const postToComment = createdPosts[2];
        for (let i = 1; i <= 12; i++) {
            const commentData = {
                content: `Test comment ${i} фыыфыфыфыфыфыфыфыфыфыфыфыфыфыф`
            };

            await request(app)
                .post(POSTS_FULL_URLS.CREATE_COMMENT_FOR_SPECIFIC_POST(postToComment.id))
                .set('Authorization', `Bearer ${userToken}`)
                .send(commentData)
                .expect(HTTP_STATUS.CREATED);
        };

        const commentsRes = await request(app)
            .get(POSTS_FULL_URLS.GET_COMMENTS_FOR_SPECIFIC_POST_WITH_QUERY_PARAMS(postToComment.id, queryParams))
            .expect(HTTP_STATUS.OK);

        expect(commentsRes.body).toHaveProperty('pagesCount');
        expect(commentsRes.body).toHaveProperty('page');
        expect(commentsRes.body).toHaveProperty('pageSize', 5);
        expect(commentsRes.body).toHaveProperty('totalCount');
        expect(commentsRes.body).toHaveProperty('items');
        expect(Array.isArray(commentsRes.body.items)).toBe(true);
        expect(commentsRes.body.items.length).toBeLessThanOrEqual(5);

        for (let index in commentsRes.body.items)
        {
            expect(commentsRes.body.items[index]).toHaveProperty('likesInfo');
            expect(commentsRes.body.items[index].likesInfo).toHaveProperty('myStatus');
            expect(commentsRes.body.items[index].likesInfo.myStatus).toBe('None');
            expect(commentsRes.body.items[index].likesInfo).toHaveProperty('dislikeCount');
            expect(commentsRes.body.items[index].likesInfo.dislikeCount).toBe(0);
            expect(commentsRes.body.items[index].likesInfo).toHaveProperty('likeCount');
            expect(commentsRes.body.items[index].likesInfo.likeCount).toBe(0);
        }

    });
});