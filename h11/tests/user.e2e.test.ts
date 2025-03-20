import request from "supertest";
import {app} from "../src/app";
import {HTTP_STATUS} from "../src/general/global-consts";
import {USER_FULL_URLS} from "../src/models/user/endpoints";
import {FULL_TESTING_ENDPOINTS} from "../src/models/testing/endpoints";
import {encodeToBase64ForBasicAuth} from "../src/general/utilities";
import {AUTH_FULL_URLS} from "../src/models/auth/endpoints";
import {userServiceInstance} from "../src/general/composition-root";
import mongoose from "mongoose";
describe('User API End-to-End Tests', () => {
    let basicAuth: string;

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
    });

    it('Create new user', async () => {

        const newUserCreationData = {
            login: "itiincub12",
            password: "string1234556",
            email: "exampl1234@example.com"
        };

        await request(app)
            .post(USER_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newUserCreationData)
            .expect(HTTP_STATUS.CREATED);

        const allUsers = await request(app)
            .get(USER_FULL_URLS.GET_ALL)
            .set('Authorization', `Basic ${basicAuth}`);
        expect(allUsers.status).toBe(HTTP_STATUS.OK);
        const user = allUsers.body.items.find(
            (user: any) =>  user.login === newUserCreationData.login
        );
        expect(user).toBeDefined();

        const agent = 'MyDevice01234'
        const res = await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .set('User-Agent', agent)
            .send({
                loginOrEmail: newUserCreationData.login,
                password: newUserCreationData.password,
            })
            .expect(HTTP_STATUS.OK);
        expect(res.body.accessToken).toBeDefined();
        const createdUser = await userServiceInstance.findByField({email: newUserCreationData.email});
        expect(createdUser.data).toBeDefined();
        expect(createdUser.data!.isActivated).toBe(true);
        expect(createdUser.data!.confirmationCode).toBe("");
    });

    it('Create new user with existing email', async () => {
        const newUserCreationData = {
            login: "itiinsascub12",
            password: "string9876543211",
            email: "exampl1234@example.com"
        };

        await request(app)
            .post(USER_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newUserCreationData)
            .expect(HTTP_STATUS.BAD_REQUEST);

        const allUsers = await request(app)
            .get(USER_FULL_URLS.GET_ALL)
            .set('Authorization', `Basic ${basicAuth}`);

        expect(allUsers.status).toBe(HTTP_STATUS.OK);

        const usersWithSameEmail = allUsers.body.items.filter(
            (user: any) => user.email === newUserCreationData.email
        );

        expect(usersWithSameEmail.length).toBe(1);
    });

    it('Create new user with existing login', async () => {
        const newUserCreationData = {
            login: "itiincub12",
            password: "string9876543211",
            email: "exampl123sasa4@example.com"
        };

        await request(app)
            .post(USER_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newUserCreationData)
            .expect(HTTP_STATUS.BAD_REQUEST);

        const allUsers = await request(app)
            .get(USER_FULL_URLS.GET_ALL)
            .set('Authorization', `Basic ${basicAuth}`);

        expect(allUsers.status).toBe(HTTP_STATUS.OK);

        const usersWithSameLogin = allUsers.body.items.filter(
            (user: any) => user.login === newUserCreationData.login
        );

        expect(usersWithSameLogin.length).toBe(1);

    });

    it('Create new user without login', async () => {

        const newUserCreationData = {
            login: "",
            password: "string9876543211",
            email: "exampl123sasa4@example.com"
        };

        const res = await request(app)
            .post(USER_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newUserCreationData)
            .expect(HTTP_STATUS.BAD_REQUEST);

        const allUsers = await request(app)
            .get(USER_FULL_URLS.GET_ALL)
            .set('Authorization', `Basic ${basicAuth}`);
        expect(allUsers.status).toBe(HTTP_STATUS.OK);
        const user = allUsers.body.items.find(
            (user: any) =>  user.login === newUserCreationData.login
        );
        expect(user).toBeUndefined();
    });

    it('Create new user without password', async () => {

        const newUserCreationData = {
            login: "string9876543211",
            password: "",
            email: "exampl123sasa4@example.com"
        };

        const res = await request(app)
            .post(USER_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newUserCreationData)
            .expect(HTTP_STATUS.BAD_REQUEST);

        const allUsers = await request(app)
            .get(USER_FULL_URLS.GET_ALL)
            .set('Authorization', `Basic ${basicAuth}`);
        expect(allUsers.status).toBe(HTTP_STATUS.OK);
        const user = allUsers.body.items.find(
            (user: any) =>  user.login === newUserCreationData.login
        );
        expect(user).toBeUndefined();
    });

    it('Create new user without email', async () => {

        const newUserCreationData = {
            login: "string9876543211",
            password: "sasasa111",
            email: ""
        };

        const res = await request(app)
            .post(USER_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newUserCreationData)
            .expect(HTTP_STATUS.BAD_REQUEST);

        const allUsers = await request(app)
            .get(USER_FULL_URLS.GET_ALL)
            .set('Authorization', `Basic ${basicAuth}`);
        expect(allUsers.status).toBe(HTTP_STATUS.OK);
        const user = allUsers.body.items.find(
            (user: any) =>  user.login === newUserCreationData.login
        );
        expect(user).toBeUndefined();
    });


    it('Delete User', async () => {

        const newUserCreationData = {
            login: "forDel",
            password: "string1234556",
            email: "exampleDele@example.com"
        };

        const res = await request(app)
            .post(USER_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newUserCreationData)
            .expect(HTTP_STATUS.CREATED);

        const allUsers = await request(app)
            .get(USER_FULL_URLS.GET_ALL)
            .set('Authorization', `Basic ${basicAuth}`);
        expect(allUsers.status).toBe(HTTP_STATUS.OK);
        const user = allUsers.body.items.find(
            (user: any) =>  user.login === newUserCreationData.login
        );
        expect(user).toBeDefined();
        const deleteUser = await request(app)
            .delete(USER_FULL_URLS.DELETE_BY_ID(user.id))
            .set('Authorization', `Basic ${basicAuth}`)
            .expect(HTTP_STATUS.NO_CONTENT);

        const allUsers1 = await request(app)
            .get(USER_FULL_URLS.GET_ALL)
            .set('Authorization', `Basic ${basicAuth}`);
        expect(allUsers1.status).toBe(HTTP_STATUS.OK);
        const isDeletedUserAvailable = allUsers1.body.items.find(
            (user: any) =>  user.login === newUserCreationData.login
        );
        expect(isDeletedUserAvailable).toBeUndefined();

    });

});