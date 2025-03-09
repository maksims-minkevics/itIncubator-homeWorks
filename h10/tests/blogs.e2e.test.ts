import request from "supertest";
import {app} from "../src/app";
import {HTTP_STATUS} from "../src/general/global-consts";
import {encodeToBase64ForBasicAuth} from "../src/general/utilities";
import {FULL_TESTING_ENDPOINTS} from "../src/models/testing/endpoints";
import {BLOGS_FULL_URLS} from "../src/models/blog/endpoints";
import {POSTS_FULL_URLS} from "../src/models/post/endpoints";
describe('Blogs API End-to-End Tests', () => {
    let basicAuth: string;

    beforeAll(async () => {
        await request(app)
            .delete(FULL_TESTING_ENDPOINTS.DELETE_ALL_DATA)
            .expect(HTTP_STATUS.NO_CONTENT);

        basicAuth = await encodeToBase64ForBasicAuth(
            process.env.SUPER_SECRET_NAME || "",
            process.env.SUPER_SECRET_PSWRD || ""
        )
    });

    it('Create new blog', async () => {

        const newBlogCreationData = {
            "name": "MM Post4",
            "description": "asdsadas dasdasdasdasd2",
            "websiteUrl": "https://localhost2.com"
        };

        const res = await request(app)
            .post(BLOGS_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newBlogCreationData)
            .expect(HTTP_STATUS.CREATED);

        expect(res).toBeDefined();
    });

    it('Create new blog without name', async () => {

        const newBlogCreationData = {
            "name": "",
            "description": "asdsadas dasdasdasdasd2",
            "websiteUrl": "https://localhost2.com"
        };

        const res = await request(app)
            .post(BLOGS_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newBlogCreationData)
            .expect(HTTP_STATUS.BAD_REQUEST);

        const blogs = await request(app)
            .get(BLOGS_FULL_URLS.GET)
            .expect(HTTP_STATUS.OK)

        const blog = blogs.body.items.find(
            (user: any) =>  (user.name === newBlogCreationData.name)
        );

        expect(blog).toBeUndefined();
    });

    it('Create new blog without description', async () => {

        const newBlogCreationData = {
            "name": "asdsadas dasdasdasdasd2",
            "description": "",
            "websiteUrl": "https://localhost2.com"
        };

        const res = await request(app)
            .post(BLOGS_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newBlogCreationData)
            .expect(HTTP_STATUS.BAD_REQUEST);

        const blogs = await request(app)
            .get(BLOGS_FULL_URLS.GET)
            .expect(HTTP_STATUS.OK);

        const blog = blogs.body.items.find(
            (user: any) =>  (user.description === newBlogCreationData.description)
        );

        expect(blog).toBeUndefined();
    });

    it('Create new blog without websiteUrl', async () => {

        const newBlogCreationData = {
            "name": "asdsadas dasdasdasdasd2",
            "description": "https://localhost2.com",
            "websiteUrl": ""
        };

        const res = await request(app)
            .post(BLOGS_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newBlogCreationData)
            .expect(HTTP_STATUS.BAD_REQUEST);

        const blogs = await request(app)
            .get(BLOGS_FULL_URLS.GET)
            .expect(HTTP_STATUS.OK);

        const blog = blogs.body.items.find(
            (user: any) =>  (user.websiteUrl === newBlogCreationData.websiteUrl)
        );

        expect(blog).toBeUndefined();
    });

    it('Get blog by id', async () => {

        const blogs = await request(app)
            .get(BLOGS_FULL_URLS.GET)
            .expect(HTTP_STATUS.OK);
        expect(blogs).toBeDefined();
        expect(blogs.body.items.length).toBeGreaterThan(0);
        const blog = await request(app)
            .get(BLOGS_FULL_URLS.GET_BY_ID(blogs.body.items[0].id))
            .expect(HTTP_STATUS.OK);

        expect(blog).toBeDefined();
    });

    it('should return correctly paginated and filtered blogs with sorting', async () => {

        const blogs = [
            { name: 'MM Post4', description: 'Test desc 1', websiteUrl: 'https://localhost1.com' },
            { name: 'MM Post5', description: 'Test desc 2', websiteUrl: 'https://localhost2.com' },
            { name: 'Another Blog', description: 'Test desc 3', websiteUrl: 'https://localhost3.com' },
            { name: 'Post4 Special', description: 'Test desc 4', websiteUrl: 'https://localhost4.com' },
            { name: 'Random Blog', description: 'Test desc 5', websiteUrl: 'https://localhost5.com' },
        ];

        for (const blog of blogs) {
            await request(app)
                .post(BLOGS_FULL_URLS.CREATE)
                .set('Authorization', `Basic ${basicAuth}`)
                .send(blog)
                .expect(HTTP_STATUS.CREATED);
        }
        const queryParams = new URLSearchParams({
            pageSize: '15',
            pageNumber: '1',
            searchNameTerm: 'Post4',
            sortDirection: 'asc',
            sortBy: 'name',
        }).toString();

        const res = await request(app)
            .get(BLOGS_FULL_URLS.GET_WITH_QUERY_PARAMS(queryParams))
            .set('Authorization', `Basic ${basicAuth}`)
            .expect(HTTP_STATUS.OK);

        expect(res.body).toHaveProperty('pagesCount', 1);
        expect(res.body).toHaveProperty('page', 1);
        expect(res.body).toHaveProperty('pageSize', 15);
        expect(res.body).toHaveProperty('totalCount');
        expect(res.body).toHaveProperty('items');
        expect(res.body.items.length).toBeLessThanOrEqual(15);
        res.body.items.forEach((blog: any) => {
            expect(blog.name).toContain('Post4');
        });

        const sortedItems = [...res.body.items].sort((a, b) => a.name.localeCompare(b.name));
        expect(res.body.items).toEqual(sortedItems);
    });

    it('Delete blog by id', async () => {

        const blogs = await request(app)
            .get(BLOGS_FULL_URLS.GET)
            .expect(HTTP_STATUS.OK);
        expect(blogs).toBeDefined();
        expect(blogs.body.items.length).toBeGreaterThan(0);
        const blogIdToDelete = blogs.body.items[0].id;
        const blog = await request(app)
            .delete(BLOGS_FULL_URLS.GET_BY_ID(blogIdToDelete))
            .set('Authorization', `Basic ${basicAuth}`)
            .expect(HTTP_STATUS.NO_CONTENT);

        const blogsAfterDelete = await request(app)
            .get(BLOGS_FULL_URLS.GET)
            .expect(HTTP_STATUS.OK);

        const blogAfterDelete = blogsAfterDelete.body.items.find(
            (blog: any) =>  blog.id === blogIdToDelete
        );
        expect(blogAfterDelete).toBeUndefined();
    });

    it('Update blog by id', async () => {
        let allBlogsBeforeUpdate: any[]; // Все блоги перед обновлением
        let blogToUpdate: any; // Блог, который будем обновлять

        const blogs = [
            { name: 'Blog 1', description: 'Desc 1', websiteUrl: 'https://blog1.com' },
            { name: 'Blog 2', description: 'Desc 2', websiteUrl: 'https://blog2.com' },
            { name: 'Blog 3', description: 'Desc 3', websiteUrl: 'https://blog3.com' },
        ];

        for (const blog of blogs) {
            await request(app)
                .post(BLOGS_FULL_URLS.CREATE)
                .set('Authorization', `Basic ${basicAuth}`)
                .send(blog)
                .expect(HTTP_STATUS.CREATED);
        }

        const res = await request(app)
            .get(BLOGS_FULL_URLS.GET)
            .expect(HTTP_STATUS.OK);

        allBlogsBeforeUpdate = res.body.items;
        blogToUpdate = allBlogsBeforeUpdate[0]; // Берём первый блог для обновления
        const fieldsToUpdate = {
            name: 'Updated Blo',
            description: 'Blog description after Update',
            websiteUrl: 'https://beUpdated.com',
        };

        // Отправляем запрос на обновление блога
        await request(app)
            .put(BLOGS_FULL_URLS.UPDATE_BY_ID(blogToUpdate.id))
            .set('Authorization', `Basic ${basicAuth}`)
            .send(fieldsToUpdate)
            .expect(HTTP_STATUS.NO_CONTENT);

        // Получаем все блоги после обновления
        const resAfterUpdate = await request(app)
            .get(BLOGS_FULL_URLS.GET)
            .expect(HTTP_STATUS.OK);

        const allBlogsAfterUpdate = resAfterUpdate.body.items;

        // Проверяем, что обновился только один блог
        const updatedBlog = allBlogsAfterUpdate.find((b: any) => b.id === blogToUpdate.id);
        expect(updatedBlog).toBeDefined();
        expect(updatedBlog!.name).toBe(fieldsToUpdate.name);
        expect(updatedBlog!.description).toBe(fieldsToUpdate.description);
        expect(updatedBlog!.websiteUrl).toBe(fieldsToUpdate.websiteUrl);

        // Проверяем, что неизменённые поля остались теми же
        expect(updatedBlog!.createdAt).toBe(blogToUpdate.createdAt);
        expect(updatedBlog!.isMembership).toBe(blogToUpdate.isMembership);

        // Проверяем, что другие блоги **не изменились**
        allBlogsAfterUpdate.forEach((blog: any) => {
            if (blog.id !== blogToUpdate.id) {
                const originalBlog = allBlogsBeforeUpdate.find((b) => b.id === blog.id);
                expect(blog).toEqual(originalBlog); // Полностью сравниваем объекты
            }
        });
    });

    it('should create a new post for a specific blog', async () => {
        const res = await request(app)
            .get(BLOGS_FULL_URLS.GET)
            .expect(HTTP_STATUS.OK);

        expect(res.body).toHaveProperty('items');
        expect(res.body.items.length).toBeGreaterThan(0);
        const blogId = res.body.items[0].id;
        const blogName = res.body.items[0].name;
        const postData = {
            title: 'my first post',
            shortDescription: 'my first post',
            content: 'my first post',
        };

        const createPostRes = await request(app)
            .post(BLOGS_FULL_URLS.CREATE_POST_FOR_SPECIFIC_BLOG(blogId))
            .set('Authorization', `Basic ${basicAuth}`)
            .send(postData)
            .expect(HTTP_STATUS.CREATED);

        expect(createPostRes.body).toHaveProperty('id');
        expect(createPostRes.body.title).toBe(postData.title);
        expect(createPostRes.body.shortDescription).toBe(postData.shortDescription);
        expect(createPostRes.body.content).toBe(postData.content);
        expect(createPostRes.body.blogId).toBe(blogId);
        expect(createPostRes.body.blogName).toBe(blogName);
        expect(createPostRes.body).toHaveProperty('createdAt');

        const postId = createPostRes.body.id;

        const getAllPostsRes = await request(app)
            .get(POSTS_FULL_URLS.GET)
            .expect(HTTP_STATUS.OK);

        expect(getAllPostsRes.body).toHaveProperty('items');
        expect(getAllPostsRes.body.items.length).toBeGreaterThan(0);

        const createdPost = getAllPostsRes.body.items.find((post: any) => post.id === postId);

        expect(createdPost).toBeDefined();
        expect(createdPost.title).toBe(postData.title);
        expect(createdPost.shortDescription).toBe(postData.shortDescription);
        expect(createdPost.content).toBe(postData.content);
        expect(createdPost.blogId).toBe(blogId);
        expect(createdPost.blogName).toBe(blogName);
        expect(createdPost).toHaveProperty('createdAt');
    });

    it('get all posts for a specific blog id', async () => {
        const res = await request(app)
            .get(BLOGS_FULL_URLS.GET)
            .expect(HTTP_STATUS.OK);

        expect(res.body).toHaveProperty('items');
        expect(res.body.items.length).toBeGreaterThan(0);
        const blogId = res.body.items[0].id;
        const blogName = res.body.items[0].name;
        const postData = {
            title: 'my first post',
            shortDescription: 'my first post',
            content: 'my first post',
        };

        const createPostRes = await request(app)
            .post(BLOGS_FULL_URLS.CREATE_POST_FOR_SPECIFIC_BLOG(blogId))
            .set('Authorization', `Basic ${basicAuth}`)
            .send(postData)
            .expect(HTTP_STATUS.CREATED);

        expect(createPostRes.body).toHaveProperty('id');
        expect(createPostRes.body.title).toBe(postData.title);
        expect(createPostRes.body.shortDescription).toBe(postData.shortDescription);
        expect(createPostRes.body.content).toBe(postData.content);
        expect(createPostRes.body.blogId).toBe(blogId);
        expect(createPostRes.body.blogName).toBe(blogName);
        expect(createPostRes.body).toHaveProperty('createdAt');

        const postId = createPostRes.body.id;

        const getAllPostsRes = await request(app)
            .get(POSTS_FULL_URLS.GET)
            .expect(HTTP_STATUS.OK);

        expect(getAllPostsRes.body).toHaveProperty('items');
        expect(getAllPostsRes.body.items.length).toBeGreaterThan(0);

        const createdPost = getAllPostsRes.body.items.find((post: any) => post.id === postId);

        expect(createdPost).toBeDefined();
        expect(createdPost.title).toBe(postData.title);
        expect(createdPost.shortDescription).toBe(postData.shortDescription);
        expect(createdPost.content).toBe(postData.content);
        expect(createdPost.blogId).toBe(blogId);
        expect(createdPost.blogName).toBe(blogName);
        expect(createdPost).toHaveProperty('createdAt');

        const getPostsByBlogRes = await request(app)
            .get(BLOGS_FULL_URLS.GET_POST_BY_BLOG_ID(blogId))
            .expect(HTTP_STATUS.OK);

        expect(getPostsByBlogRes.body).toHaveProperty('items');
        expect(getPostsByBlogRes.body.items.length).toBeGreaterThan(0);

        const foundPost = getPostsByBlogRes.body.items.find((post: any) => post.id === createdPost.id);
        expect(foundPost).toBeDefined();
        expect(foundPost.title).toBe(postData.title);
        expect(foundPost.shortDescription).toBe(postData.shortDescription);
        expect(foundPost.content).toBe(postData.content);
        expect(foundPost.blogId).toBe(blogId);
        expect(foundPost.blogName).toBe(blogName);
        expect(foundPost).toHaveProperty('createdAt');


    });

});