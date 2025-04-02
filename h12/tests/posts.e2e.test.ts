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
describe('Posts API End-to-End Tests', () => {
    let basicAuth: string;
    let blogId: string;
    let blogName: string;
    let createdPosts: any[] = [];
    let userToken: string;
    let user1Token: string;
    let user2Token: string;
    let user1CreationData: any
    let user1: any

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
        user1CreationData = {
            login: 'CARKORONI',
            password: 'string14344556',
            email: 'examp666@example.com'
        };

        const createdUser1 = await request(app)
            .post(USER_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(user1CreationData)
            .expect(HTTP_STATUS.CREATED);
        user1 = createdUser1.body;

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
        expect(newPost.body.extendedLikesInfo).toBeDefined();
        expect(newPost.body.extendedLikesInfo).toHaveProperty("likesCount");
        expect(newPost.body.extendedLikesInfo.likesCount).toBe(0);
        expect(newPost.body.extendedLikesInfo).toHaveProperty("dislikesCount");
        expect(newPost.body.extendedLikesInfo.dislikesCount).toBe(0);
        expect(newPost.body.extendedLikesInfo).toHaveProperty("myStatus");
        expect(newPost.body.extendedLikesInfo.myStatus).toBe("None");
        expect(newPost.body.extendedLikesInfo).toHaveProperty("newestLikes");
        expect(newPost.body.extendedLikesInfo.newestLikes).toHaveLength(0);
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
        const loginData = {
            loginOrEmail: user1CreationData.login,
            password: user1CreationData.password
        }

        const loginRes = await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .set('User-Agent', "agent")
            .send(loginData);

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
        expect(commentRes.body.likesInfo).toHaveProperty('dislikesCount');
        expect(commentRes.body.likesInfo.dislikesCount).toBe(0);
        expect(commentRes.body.likesInfo).toHaveProperty('likesCount');
        expect(commentRes.body.likesInfo.likesCount).toBe(0);
        expect(commentRes.body.commentatorInfo.userLogin).toBe(user1CreationData.login);
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
            expect(commentsRes.body.items[index].likesInfo).toHaveProperty('dislikesCount');
            expect(commentsRes.body.items[index].likesInfo.dislikesCount).toBe(0);
            expect(commentsRes.body.items[index].likesInfo).toHaveProperty('likesCount');
            expect(commentsRes.body.items[index].likesInfo.likesCount).toBe(0);
        }

    });

    it('should handle 10 users liking/disliking 3 posts randomly via API and validate newestLikes', async () => {
        const users = [];
        const tokens = [];
        const userIds: string[] = [];

        // 1. Создаём 10 пользователей и логинимся
        for (let i = 0; i < 10; i++) {
            const userData = {
                login: `user${i}`,
                password: 'Password123!',
                email: `user${i}@example.com`
            };

            const newUser = await request(app)
                .post(USER_FULL_URLS.CREATE)
                .set('Authorization', `Basic ${basicAuth}`)
                .send(userData)
                .expect(HTTP_STATUS.CREATED);

            const loginRes = await request(app)
                .post(AUTH_FULL_URLS.LOGIN)
                .send({
                    loginOrEmail: userData.login,
                    password: userData.password
                })
                .expect(HTTP_STATUS.OK);

            users.push({...userData, id: newUser.body.id});
            tokens.push(loginRes.body.accessToken);
        }

        const newPostCreationData = {
            title: "my first post121",
            shortDescription: "my first post",
            content: "my first post111111111111111111111111111111111111111",
            blogId: blogId
        };

        // 2. Первые 3 пользователя создают посты
        const postIds = [];
        for (let i = 0; i < 3; i++) {
            const newPost = await request(app)
                .post(POSTS_FULL_URLS.CREATE)
                .set('Authorization', `Basic ${basicAuth}`)
                .send({ ...newPostCreationData, content: newPostCreationData.content + i })
                .expect(HTTP_STATUS.CREATED);

            postIds.push(newPost.body.id);
        }

        // 3. Все 10 пользователей случайно ставят Like / Dislike / None
        const likeStatuses = ['Like', 'Dislike', 'None'];
        const expectedResults: Record<string, { likes: number; dislikes: number}> = {};
        const userStatuses: Record<string, Record<string, string>> = {};

        for (const postId of postIds) {
            expectedResults[postId] = { likes: 0, dislikes: 0};
            userStatuses[postId] = {};

            for (let i = 0; i < tokens.length; i++) {
                const status = likeStatuses[Math.floor(Math.random() * 3)];

                await request(app)
                    .put(POSTS_FULL_URLS.LIKE_POST(postId))
                    .set('Authorization', `Bearer ${tokens[i]}`)
                    .send({ likeStatus: status })
                    .expect(HTTP_STATUS.NO_CONTENT);

                userStatuses[postId][i] = status;

                if (status === 'Like') {
                    expectedResults[postId].likes++;
                }

                if (status === 'Dislike') {
                    expectedResults[postId].dislikes++;
                }

                await new Promise(res => setTimeout(res, 10)); // слегка разнести по времени
            }
        }

        // 4. Проверка количества лайков/дизлайков и поля myStatus и newestLikes
        for (const postId of postIds) {
            const expected = expectedResults[postId];

            for (let i = 0; i < tokens.length; i++) {
                const res = await request(app)
                    .get(POSTS_FULL_URLS.GET_BY_ID(postId))
                    .set('Authorization', `Bearer ${tokens[i]}`)
                    .expect(HTTP_STATUS.OK);

                expect(res.body).toHaveProperty('extendedLikesInfo');
                expect(res.body.extendedLikesInfo.likesCount).toBe(expected.likes);
                expect(res.body.extendedLikesInfo.dislikesCount).toBe(expected.dislikes);
                expect(res.body.extendedLikesInfo.myStatus).toBe(userStatuses[postId][i]);

                const newestLikes = res.body.extendedLikesInfo.newestLikes;
                expect(Array.isArray(newestLikes)).toBe(true);
                expect(newestLikes.length).toBeLessThanOrEqual(3);
            }
        }
    });
    describe("basic post like scenario", () => {
        let newPost: any;
        beforeAll(async () => {
            const newPostCreationData = {
                "title": "my first post121",
                "shortDescription": "my first post",
                "content": "my first post111111111111111111111111111111111111111",
                "blogId": blogId
            };

            newPost = await request(app)
                .post(POSTS_FULL_URLS.CREATE)
                .set('Authorization', `Basic ${basicAuth}`)
                .send(newPostCreationData)
                .expect(HTTP_STATUS.CREATED);

        });

        it('should change myStatus if like dislike none', async () => {
            const likeStatus = [
                { status: "Dislike", likes: 0, dislikes: 1, newestLikes: 0 },
                { status: "Like", likes: 1, dislikes: 0, newestLikes: 1 },
                { status: "None", likes: 0, dislikes: 0, newestLikes: 0 },
            ]

            for (const index in likeStatus){
                await request(app)
                    .put(POSTS_FULL_URLS.LIKE_POST(newPost.body.id))
                    .set('Authorization', `Bearer ${user1Token}`)
                    .send({ likeStatus: likeStatus[index].status })
                    .expect(HTTP_STATUS.NO_CONTENT);

                const post = await request(app)
                    .get(POSTS_FULL_URLS.GET_BY_ID(newPost.body.id))
                    .set('Authorization', `Bearer ${user1Token}`)
                    .expect(HTTP_STATUS.OK);
                expect(post.body.extendedLikesInfo.myStatus).toBe(likeStatus[index].status);
                expect(post.body.extendedLikesInfo.dislikesCount).toBe(likeStatus[index].dislikes);
                expect(post.body.extendedLikesInfo.likesCount).toBe(likeStatus[index].likes);
                expect(post.body.extendedLikesInfo.newestLikes).toBeDefined();
                expect(post.body.extendedLikesInfo.newestLikes).toHaveLength(likeStatus[index].newestLikes);
            }
        });

        it('should not like a post with incorrect data', async () => {
            const likeData = {
                likeStatus: "TestString"
            }

            await request(app)
                .put(POSTS_FULL_URLS.LIKE_POST(newPost.body.id))
                .set('Authorization', `Bearer ${user1Token}`)
                .send(likeData)
                .expect(HTTP_STATUS.BAD_REQUEST);
        });
    })

    describe("basic post like scenario with multiple users ", () => {

        // 1. Функция получения текущих newestLikes
        async function getNewestLikes(postId: string): Promise<LikeEntry[]> {
            const res = await request(app)
                .get(POSTS_FULL_URLS.GET_BY_ID(postId))
                .set('Authorization', `Bearer ${createdUsers[0].accessToken}`)
                .expect(HTTP_STATUS.OK);

            return res.body.extendedLikesInfo.newestLikes;
        }
        interface CreatedUser {
            id: string;
            login: string;
            accessToken: string;
        }
        interface LikeEntry {
            userId: string;
            login: string;
            addedAt: string;
        }

        let postId: string = "";
        let createdUsers: Array<CreatedUser> = [];
        let postIds: string[] = [];
        let postLikeMap: Record<string, LikeEntry[]> = {};

        beforeAll(async () => {
            // 1. Создание 4 пользователей
            for (let i = 0; i < 4; i++) {
                const userData = {
                    login: `userD${i}`,
                    password: 'Password123!',
                    email: `userDeterministic${i}@example.com`
                };

                const createRes = await request(app)
                    .post(USER_FULL_URLS.CREATE)
                    .set('Authorization', `Basic ${basicAuth}`)
                    .send(userData)
                    .expect(HTTP_STATUS.CREATED);

                const loginRes = await request(app)
                    .post(AUTH_FULL_URLS.LOGIN)
                    .send({
                        loginOrEmail: userData.login,
                        password: userData.password
                    })
                    .expect(HTTP_STATUS.OK);

                createdUsers.push({
                    id: createRes.body.id,
                    login: createRes.body.login,
                    accessToken: loginRes.body.accessToken
                });
            }

            for (let i = 0; i < 2; i++) {
                const postRes = await request(app)
                    .post(POSTS_FULL_URLS.CREATE)
                    .set('Authorization', `Basic ${basicAuth}`)
                    .send({
                        title: `Post ${i}`,
                        shortDescription: 'desc',
                        content: 'some content',
                        blogId: blogId
                    })
                    .expect(HTTP_STATUS.CREATED);

                postIds.push(postRes.body.id);
                postLikeMap[postRes.body.id] = [];
            }
            postId = postIds[0];

        });

        it('should update newestLikes correctly when users switch statuses and verify by addedAt', async () => {
            const activeLikes: LikeEntry[] = [];

            // === Шаг 1: каждый пользователь ставит Like и сохраняем addedAt
            for (const user of createdUsers) {
                await request(app)
                    .put(POSTS_FULL_URLS.LIKE_POST(postId))
                    .set('Authorization', `Bearer ${user.accessToken}`)
                    .send({ likeStatus: 'Like' })
                    .expect(HTTP_STATUS.NO_CONTENT);

                await new Promise(res => setTimeout(res, 20)); // гарантируем уникальный addedAt

                const newest = await getNewestLikes(postId);
                const thisUserLike = newest.find(l => l.userId === user.id);
                if (thisUserLike) {
                    activeLikes.push({
                        userId: user.id,
                        login: user.login,
                        addedAt: thisUserLike.addedAt
                    });
                }
            }

            // Проверяем что все 3 лайка есть в правильном порядке (от новых к старым)
            const newest1 = await getNewestLikes(postId);
            console.log(newest1)
            const expected1 = [...activeLikes]
                .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
                .map(l => l.userId).slice(0,3);
            console.log(expected1.slice(0,3))
            const actual1 = newest1.map(l => l.userId);
            console.log(actual1)
            expect(actual1).toEqual(expected1);

            // === Шаг 2: первый пользователь меняет Like → Dislike (удаляется из newestLikes)
            await request(app)
                .put(POSTS_FULL_URLS.LIKE_POST(postId))
                .set('Authorization', `Bearer ${createdUsers[0].accessToken}`)
                .send({ likeStatus: 'Dislike' })
                .expect(HTTP_STATUS.NO_CONTENT);

            const index0 = activeLikes.findIndex(l => l.userId === createdUsers[0].id);
            if (index0 !== -1) activeLikes.splice(index0, 1); // удаляем лайк

            const newest2 = await getNewestLikes(postId);

            const expected2 = [...activeLikes]
                .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
                .map(l => l.userId);
            const actual2 = newest2.map(l => l.userId);
            expect(actual2).toEqual(expected2);

            // === Шаг 3: второй пользователь меняет Like → None
            await request(app)
                .put(POSTS_FULL_URLS.LIKE_POST(postId))
                .set('Authorization', `Bearer ${createdUsers[1].accessToken}`)
                .send({ likeStatus: 'None' })
                .expect(HTTP_STATUS.NO_CONTENT);

            const index1 = activeLikes.findIndex(l => l.userId === createdUsers[1].id);
            if (index1 !== -1) activeLikes.splice(index1, 1);

            const newest3 = await getNewestLikes(postId);
            const expected3 = [...activeLikes]
                .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
                .map(l => l.userId);
            const actual3 = newest3.map(l => l.userId);
            expect(actual3).toEqual(expected3);

            // === Шаг 4: user0 снова ставит Like — появляется в начале списка
            await request(app)
                .put(POSTS_FULL_URLS.LIKE_POST(postId))
                .set('Authorization', `Bearer ${createdUsers[0].accessToken}`)
                .send({ likeStatus: 'Like' })
                .expect(HTTP_STATUS.NO_CONTENT);

            await new Promise(res => setTimeout(res, 20));
            const newestAfterUser0 = await getNewestLikes(postId);
            const user0Like = newestAfterUser0.find(l => l.userId === createdUsers[0].id);
            if (user0Like) {
                activeLikes.push({
                    userId: createdUsers[0].id,
                    login: createdUsers[0].login,
                    addedAt: user0Like.addedAt
                });
            }

            const expected4 = [...activeLikes]
                .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
                .map(l => l.userId);
            const actual4 = newestAfterUser0.map(l => l.userId);
            expect(actual4).toEqual(expected4);
        });

        it('should update newestLikes to show only the latest 3 likes sorted by addedAt DESC', async () => {

            const likeEntries: LikeEntry[] = [];

            // 1. Первые 3 пользователя ставят лайки
            for (let i = 0; i < 3; i++) {
                await request(app)
                    .put(POSTS_FULL_URLS.LIKE_POST(postId))
                    .set('Authorization', `Bearer ${createdUsers[i].accessToken}`)
                    .send({ likeStatus: 'Like' })
                    .expect(HTTP_STATUS.NO_CONTENT);

                await new Promise(res => setTimeout(res, 10)); // немного разнесём по времени

                const newestLikes = await getNewestLikes(postId);
                const thisLike = newestLikes.find(l => l.userId === createdUsers[i].id);
                if (thisLike) {
                    likeEntries.push({
                        userId: thisLike.userId,
                        login: thisLike.login,
                        addedAt: thisLike.addedAt
                    });
                }
            }

            // 2. Проверка, что в newestLikes 3 первых пользователя (в порядке по addedAt DESC)
            const expectedFirst = [...likeEntries]
                .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
                .slice(0, 3)
                .map(l => l.userId);

            const currentLikes1 = await getNewestLikes(postId);
            const actual1 = currentLikes1.map(l => l.userId);

            expect(actual1).toEqual(expectedFirst);

            // 3. 4-й пользователь ставит лайк
            await request(app)
                .put(POSTS_FULL_URLS.LIKE_POST(postId))
                .set('Authorization', `Bearer ${createdUsers[3].accessToken}`)
                .send({ likeStatus: 'Like' })
                .expect(HTTP_STATUS.NO_CONTENT);

            await new Promise(res => setTimeout(res, 10));

            const newestLikesAfter4 = await getNewestLikes(postId);
            const user4Like = newestLikesAfter4.find(l => l.userId === createdUsers[3].id);
            if (user4Like) {
                likeEntries.push({
                    userId: user4Like.userId,
                    login: user4Like.login,
                    addedAt: user4Like.addedAt
                });
            }

            // 4. Проверка, что самый старый (user0) ушёл, остались user1, user2, user3 (в порядке по времени)
            const expectedFinal = [...likeEntries]
                .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
                .slice(0, 3)
                .map(l => l.userId);

            const currentLikes2 = await getNewestLikes(postId);
            const actual2 = currentLikes2.map(l => l.userId);
            expect(actual2).toEqual(expectedFinal);
        });

        it('should track newestLikes separately for each post', async () => {

            // 1. Каждый пользователь лайкает оба поста
            for (const user of createdUsers) {
                for (const postId of postIds) {
                    await request(app)
                        .put(POSTS_FULL_URLS.LIKE_POST(postId))
                        .set('Authorization', `Bearer ${user.accessToken}`)
                        .send({ likeStatus: 'Like' })
                        .expect(HTTP_STATUS.NO_CONTENT);

                    await new Promise(res => setTimeout(res, 10)); // разнесём время

                    const newestLikes = await getNewestLikes(postId);
                    const userLike = newestLikes.find(l => l.userId === user.id);
                    if (userLike) {
                        postLikeMap[postId].push({
                            userId: user.id,
                            login: user.login,
                            addedAt: userLike.addedAt
                        });
                    }
                }
            }

            // 2. Проверка newestLikes для каждого поста
            for (const postId of postIds) {
                const expected = [...postLikeMap[postId]]
                    .sort((a, b) => b.addedAt.localeCompare(a.addedAt))
                    .slice(0, 3)
                    .map(l => l.userId);

                const actual = (await getNewestLikes(postId)).map(l => l.userId);
                expect(actual).toEqual(expected);
            }
        });

    })



});