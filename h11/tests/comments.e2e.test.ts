import request from "supertest";
import {app} from "../src/app";
import {HTTP_STATUS} from "../src/general/global-consts";
import {encodeToBase64ForBasicAuth} from "../src/general/utilities";
import {FULL_TESTING_ENDPOINTS} from "../src/models/testing/endpoints";
import {BLOGS_FULL_URLS} from "../src/models/blog/endpoints";
import {POSTS_FULL_URLS} from "../src/models/post/endpoints";
import {USER_FULL_URLS} from "../src/models/user/endpoints";
import {AUTH_FULL_URLS} from "../src/models/auth/endpoints";
import {COMMENTS_FULL_URLS} from "../src/models/comment/endpoints";
import mongoose from "mongoose";
describe('Blogs API End-to-End Tests', () => {
    let basicAuth: string;
    let blogId: string;
    let blogName: string;
    let createdPost: any;
    let user1Token: string;
    let user2Token: string;

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

        const newPostCreationData = {
            "title": "my first post121",
            "shortDescription": "my first post",
            "content": "my first post111111111111111111111111111111111111111",
            "blogId": blogId
        };

        createdPost = await request(app)
            .post(POSTS_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newPostCreationData)
            .expect(HTTP_STATUS.CREATED);

        const user1CreationData = {
            login: 'CARKORONI',
            password: 'string14344556',
            email: 'examp666@example.com'
        };

        await request(app)
            .post(USER_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(user1CreationData)
            .expect(HTTP_STATUS.CREATED);

        const login1Res = await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .send({
                loginOrEmail: 'examp666@example.com',
                password: 'string14344556'
            })
            .expect(HTTP_STATUS.OK);

        user1Token = login1Res.body.accessToken;

        const user2CreationData = {
            login: 'CARKORONI1',
            password: 'string14344556',
            email: 'examp6661@example.com'
        };

        await request(app)
            .post(USER_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(user2CreationData)
            .expect(HTTP_STATUS.CREATED);

        const login2Res = await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .send({
                loginOrEmail: 'examp6661@example.com',
                password: 'string14344556'
            })
            .expect(HTTP_STATUS.OK);

        user2Token = login2Res.body.accessToken;
    });

    it('should update a comment', async () => {
        const commentData = {
            content: 'stray228 best of the best steamer in the world123'
        };


        const commentRes = await request(app)
            .post(POSTS_FULL_URLS.CREATE_COMMENT_FOR_SPECIFIC_POST(createdPost.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .send(commentData)
            .expect(HTTP_STATUS.CREATED);


        const updatedCommentData = {
            content: 'Updated Comment Contentwqwqwqwqwqwqwqwqw'
        };

        await request(app)
            .put(COMMENTS_FULL_URLS.UPDATE_BY_ID(commentRes.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .send(updatedCommentData)
            .expect(HTTP_STATUS.NO_CONTENT);

        const comment = await request(app)
            .get(COMMENTS_FULL_URLS.GET_BY_ID(commentRes.body.id))
            .expect(HTTP_STATUS.OK);
        expect(comment.body).toBeDefined();

        await request(app)
            .put(COMMENTS_FULL_URLS.UPDATE_BY_ID(commentRes.body.id))
            .set('Authorization', `Bearer ${user2Token}`)
            .send(updatedCommentData)
            .expect(HTTP_STATUS.FORBIDEN);
    });

    it('should delete a comment', async () => {
        const commentData = {
            content: 'stray228 best of the best steamer in the world123'
        };

        const commentRes = await request(app)
            .post(POSTS_FULL_URLS.CREATE_COMMENT_FOR_SPECIFIC_POST(createdPost.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .send(commentData)
            .expect(HTTP_STATUS.CREATED);

        await request(app)
            .delete(COMMENTS_FULL_URLS.DELETE_BY_ID(commentRes.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .expect(HTTP_STATUS.NO_CONTENT);

        await request(app)
            .get(COMMENTS_FULL_URLS.GET_BY_ID(commentRes.body.id))
            .expect(HTTP_STATUS.NOT_FOUND);
    });

});