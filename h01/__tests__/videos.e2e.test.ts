import request from 'supertest'
import { app } from '../src/app'
import {SETTINGS} from "../src/settings";

describe('/videos', () => {
    beforeAll(async () => {
        await request(app).delete(SETTINGS.BASE_URL + "testing/all-data").expect(SETTINGS.RESP_CODES.NO_CONTENT)
    })

    it('GET products = []', async () => {
        await request(app).get(SETTINGS.BASE_URL + "videos/").expect([])
    })

    it('- POST does not create the video with incorrect data (no title, no author)', async function () {
        await request(app)
            .post(SETTINGS.BASE_URL + "videos/")
            .send({ title: '', author: '' })
            .expect(SETTINGS.RESP_CODES.BAD_REQUEST, {
                errorsMessages: [
                    { message: 'failed', field: 'title' },
                    { message: 'failed', field: 'author' },
                ],
            })

        const res = await request(app).get(SETTINGS.BASE_URL + "videos/")
        expect(res.body).toEqual([])
    })

    it('- POST create the video with data', async function () {
        const newVideo = {
            title: "My First video",
            author: "MM",
            canBeDownloaded: true,
            minAgeRestriction: 11,
            availableResolutions: ["P144", "P240", "P360", "P480"]
        };
        await request(app)
            .post(SETTINGS.BASE_URL + "videos/")
            .send(newVideo)
            .expect(SETTINGS.RESP_CODES.CREATED);

        const res = await request(app).get(SETTINGS.BASE_URL + "videos/")
        const expected = [{
            title: "My First video",
            author: "MM",
            canBeDownloaded: true,
            minAgeRestriction: 11,
            availableResolutions: ["P144", "P240", "P360", "P480"],
            id: 0,
            publicationDate: expect.any(String),
            createdAt: expect.any(String),

        }];
        expect(res.body).toEqual(expected);
    })
    it('- GET product by ID with incorrect id', async () => {
        await request(app)
            .get(SETTINGS.BASE_URL + "videos/helloWorld")
            .expect(SETTINGS.RESP_CODES.BAD_REQUEST);
    })

    it('+ GET product by ID with correct id', async () => {
        const newVideo = {
            title: "My First video",
            author: "MM",
        };
        await request(app)
            .post(SETTINGS.BASE_URL + "videos/")
            .send(newVideo);

        await request(app)
            .get(SETTINGS.BASE_URL + "videos/0")
            .expect(SETTINGS.RESP_CODES.OK);

    })

    it('- PUT product by ID with incorrect data', async () => {
        await request(app)
            .put(SETTINGS.BASE_URL + "videos/" + 1223)
            .send({ title: 'title', author: 'title' })
            .expect(SETTINGS.RESP_CODES.NOT_FOUND_ERR);

        const res = await request(app)
            .get(SETTINGS.BASE_URL + "videos/" + 1223);
        expect(res.body).toEqual({});
    })

    it('+ PUT product by ID with correct data', async () => {
        const newVideo = {
            title: "My First video",
            author: "MM",
            canBeDownloaded: true,
            minAgeRestriction: 11,
            availableResolutions: ["P144", "P240", "P360", "P480"]
        };
        await request(app)
            .post(SETTINGS.BASE_URL + "videos/")
            .send(newVideo)
            .expect(SETTINGS.RESP_CODES.CREATED);

        const toUpdate = {
            title: "My 54321",
            author: "MM 12345",
        };

        await request(app)
            .put(SETTINGS.BASE_URL + "videos/" + 0)
            .send(toUpdate)
            .expect(SETTINGS.RESP_CODES.NO_CONTENT);

        const res = await request(app).get(SETTINGS.BASE_URL + "videos/0")
        expect(res.body).toEqual({
            ...newVideo,
            id: 0,
            title: "My 54321",
            author: "MM 12345",
            publicationDate: expect.any(String),
            createdAt: expect.any(String),
        })

    })

    it('- DELETE product by incorrect ID', async () => {
        await request(app)
            .delete(SETTINGS.BASE_URL + "videos/876328")
            .expect(SETTINGS.RESP_CODES.NOT_FOUND_ERR)
    })
    it('+ DELETE product by correct ID, auth', async () => {
        const newVideo = {
            title: "My First video",
            author: "MM",
            canBeDownloaded: true,
            minAgeRestriction: 11,
            availableResolutions: ["P144", "P240", "P360", "P480"]
        };

        await request(app)
            .post(SETTINGS.BASE_URL + "videos/")
            .send(newVideo)
            .expect(SETTINGS.RESP_CODES.CREATED);

        await request(app)
            .delete(SETTINGS.BASE_URL + "videos/0")
            .expect(SETTINGS.RESP_CODES.NO_CONTENT)

        const res = await request(app).get(SETTINGS.BASE_URL + "videos/0")
        expect(res.body).toEqual({})
    })
})
