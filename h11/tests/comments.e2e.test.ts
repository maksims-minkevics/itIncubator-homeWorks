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

    it('should like a comment', async () => {
        const commentData = {
            content: 'stray228 best of the best steamer in the world1234'
        };
        const likeData = {
            likeStatus: "Like"
        }

        const commentRes = await request(app)
            .post(POSTS_FULL_URLS.CREATE_COMMENT_FOR_SPECIFIC_POST(createdPost.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .send(commentData)
            .expect(HTTP_STATUS.CREATED);

        const commentRes1 = await request(app)
            .put(COMMENTS_FULL_URLS.LIKE_COMMENT(commentRes.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .send(likeData)
            .expect(HTTP_STATUS.NO_CONTENT);

        const comment = await request(app)
            .get(COMMENTS_FULL_URLS.GET_BY_ID(commentRes.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .expect(HTTP_STATUS.OK);

        expect(comment.body).toHaveProperty('likesInfo');
        expect(comment.body.likesInfo).toHaveProperty('myStatus');
        expect(comment.body.likesInfo.myStatus).toBe('Like');
        expect(comment.body.likesInfo).toHaveProperty('dislikesCount');
        expect(comment.body.likesInfo.dislikesCount).toBe(0);
        expect(comment.body.likesInfo).toHaveProperty('likesCount');
        expect(comment.body.likesInfo.likesCount).toBe(1);
    });

    it('should dilike a comment', async () => {
        const commentData = {
            content: 'stray228 best of the best steamer in the world1234'
        };
        const likeData = {
            likeStatus: "Dislike"
        }

        const commentRes = await request(app)
            .post(POSTS_FULL_URLS.CREATE_COMMENT_FOR_SPECIFIC_POST(createdPost.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .send(commentData)
            .expect(HTTP_STATUS.CREATED);

        const commentRes1 = await request(app)
            .put(COMMENTS_FULL_URLS.LIKE_COMMENT(commentRes.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .send(likeData)
            .expect(HTTP_STATUS.NO_CONTENT);

        const comment = await request(app)
            .get(COMMENTS_FULL_URLS.GET_BY_ID(commentRes.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .expect(HTTP_STATUS.OK);

        expect(comment.body).toHaveProperty('likesInfo');
        expect(comment.body.likesInfo).toHaveProperty('myStatus');
        expect(comment.body.likesInfo.myStatus).toBe('Dislike');
        expect(comment.body.likesInfo).toHaveProperty('dislikesCount');
        expect(comment.body.likesInfo.dislikesCount).toBe(1);
        expect(comment.body.likesInfo).toHaveProperty('likesCount');
        expect(comment.body.likesInfo.likesCount).toBe(0);
    });

    it('should not like a comment', async () => {
        const commentData = {
            content: 'stray228 best of the best steamer in the world1234'
        };
        const likeData = {
            likeStatus: "None"
        }

        const commentRes = await request(app)
            .post(POSTS_FULL_URLS.CREATE_COMMENT_FOR_SPECIFIC_POST(createdPost.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .send(commentData)
            .expect(HTTP_STATUS.CREATED);

        const commentRes1 = await request(app)
            .put(COMMENTS_FULL_URLS.LIKE_COMMENT(commentRes.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .send(likeData)
            .expect(HTTP_STATUS.NO_CONTENT);

        const comment = await request(app)
            .get(COMMENTS_FULL_URLS.GET_BY_ID(commentRes.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .expect(HTTP_STATUS.OK);

        expect(comment.body).toHaveProperty('likesInfo');
        expect(comment.body.likesInfo).toHaveProperty('myStatus');
        expect(comment.body.likesInfo.myStatus).toBe('None');
        expect(comment.body.likesInfo).toHaveProperty('dislikesCount');
        expect(comment.body.likesInfo.dislikesCount).toBe(0);
        expect(comment.body.likesInfo).toHaveProperty('likesCount');
        expect(comment.body.likesInfo.likesCount).toBe(0);
    });

    it('should not like a comment with incorrect data', async () => {
        const commentData = {
            content: 'stray228 best of the best steamer in the world1234'
        };
        const likeData = {
            likeStatus: "TestString"
        }

        const commentRes = await request(app)
            .post(POSTS_FULL_URLS.CREATE_COMMENT_FOR_SPECIFIC_POST(createdPost.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .send(commentData)
            .expect(HTTP_STATUS.CREATED);

        const commentRes1 = await request(app)
            .put(COMMENTS_FULL_URLS.LIKE_COMMENT(commentRes.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .send(likeData)
            .expect(HTTP_STATUS.BAD_REQUEST);
    });

    it('should handle 10 users liking/disliking 3 comments randomly via API', async () => {
        const users = [];
        const tokens = [];

        // 1. Создаём 10 пользователей и логинимся
        for (let i = 0; i < 10; i++) {
            const userData = {
                login: `user${i}`,
                password: 'Password123!',
                email: `user${i}@example.com`
            };

            await request(app)
                .post(USER_FULL_URLS.CREATE)
                .set('Authorization', `Basic ${basicAuth}`) // твой basic auth
                .send(userData)
                .expect(HTTP_STATUS.CREATED);

            const loginRes = await request(app)
                .post(AUTH_FULL_URLS.LOGIN)
                .send({
                    loginOrEmail: userData.login,
                    password: userData.password
                })
                .expect(HTTP_STATUS.OK);

            users.push(userData);
            tokens.push(loginRes.body.accessToken);
        }


        // 2. Первые 3 пользователя создают комментарии
        const commentIds = [];
        for (let i = 0; i < 3; i++) {
            const commentRes = await request(app)
                .post(POSTS_FULL_URLS.CREATE_COMMENT_FOR_SPECIFIC_POST(createdPost.body.id))
                .set('Authorization', `Bearer ${tokens[i]}`)
                .send({ content: `Comment is too short ${i}` })
                .expect(HTTP_STATUS.CREATED);

            commentIds.push(commentRes.body.id);
        }

        // 3. Все 10 пользователей случайно ставят Like / Dislike / None
        const likeStatuses = ['Like', 'Dislike', 'None'];
        const expectedResults: Record<string, { likes: number; dislikes: number }> = {};
        const userStatuses: Record<string, Record<string, string>> = {}; // commentId -> userIndex -> status

        for (const commentId of commentIds) {
            expectedResults[commentId] = { likes: 0, dislikes: 0 };
            userStatuses[commentId] = {};

            for (let i = 0; i < tokens.length; i++) {
                const status = likeStatuses[Math.floor(Math.random() * 3)];

                await request(app)
                    .put(COMMENTS_FULL_URLS.LIKE_COMMENT(commentId))
                    .set('Authorization', `Bearer ${tokens[i]}`)
                    .send({ likeStatus: status })
                    .expect(HTTP_STATUS.NO_CONTENT);

                userStatuses[commentId][i] = status;

                if (status === 'Like') expectedResults[commentId].likes++;
                if (status === 'Dislike') expectedResults[commentId].dislikes++;
            }
        }

        // 4. Проверка количества лайков/дизлайков и поля myStatus для каждого пользователя
        for (const commentId of commentIds) {
            const expected = expectedResults[commentId];

            for (let i = 0; i < tokens.length; i++) {
                const res = await request(app)
                    .get(COMMENTS_FULL_URLS.GET_BY_ID(commentId))
                    .set('Authorization', `Bearer ${tokens[i]}`)
                    .expect(HTTP_STATUS.OK);

                expect(res.body).toHaveProperty('likesInfo');
                expect(res.body.likesInfo.likesCount).toBe(expected.likes);
                expect(res.body.likesInfo.dislikesCount).toBe(expected.dislikes);
                expect(res.body.likesInfo.myStatus).toBe(userStatuses[commentId][i]);
            }
        }
    });

    it('should change myStatus if like dislike none', async () => {
        const commentData = {
            content: 'stray228 best of the best steamer in the world1234'
        };
        const likeStatus = [
            { status: "Dislike", likes: 0, dislikes: 1 },
            { status: "None", likes: 0, dislikes: 0 },
            { status: "Like", likes: 1, dislikes: 0 },
        ]
        const commentRes = await request(app)
            .post(POSTS_FULL_URLS.CREATE_COMMENT_FOR_SPECIFIC_POST(createdPost.body.id))
            .set('Authorization', `Bearer ${user1Token}`)
            .send(commentData)
            .expect(HTTP_STATUS.CREATED);
        for (const index in likeStatus){
            await request(app)
                .put(COMMENTS_FULL_URLS.LIKE_COMMENT(commentRes.body.id))
                .set('Authorization', `Bearer ${user1Token}`)
                .send({ likeStatus: likeStatus[index].status })
                .expect(HTTP_STATUS.NO_CONTENT);

            const comment = await request(app)
                .get(COMMENTS_FULL_URLS.GET_BY_ID(commentRes.body.id))
                .set('Authorization', `Bearer ${user1Token}`)
                .expect(HTTP_STATUS.OK);
            expect(comment.body.likesInfo.myStatus).toBe(likeStatus[index].status);
            expect(comment.body.likesInfo.dislikesCount).toBe(likeStatus[index].dislikes);
            expect(comment.body.likesInfo.likesCount).toBe(likeStatus[index].likes);
        }
    });
});