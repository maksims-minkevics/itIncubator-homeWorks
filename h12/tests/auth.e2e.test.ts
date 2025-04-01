import request from "supertest";
import {app} from "../src/app";
import {HTTP_STATUS} from "../src/general/global-consts";
import {USER_FULL_URLS} from "../src/models/user/endpoints";
import {FULL_TESTING_ENDPOINTS} from "../src/models/testing/endpoints";
import {encodeToBase64ForBasicAuth} from "../src/general/utilities";
import {AUTH_FULL_URLS} from "../src/models/auth/endpoints";
import {passwordServiceInstance, userServiceInstance} from "../src/general/composition-root";
import mongoose from "mongoose";

describe('Auth API End-to-End Tests', () => {
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

    it('should register a new user', async () => {
        const newUserBody = {
            login: "regUser",
            password: "string1234556",
            email: "itiincubator.training1312@gmail.com"
        };
        await request(app)
            .post(AUTH_FULL_URLS.REGISTRATION)
            .send(newUserBody)
            .expect(HTTP_STATUS.NO_CONTENT);
        const createdUser = await userServiceInstance.findByField({email: newUserBody.email});
        expect(createdUser.data).toBeDefined();
        expect(createdUser.data!.isActivated).toBe(false);
        expect(createdUser.data!.confirmationCode).toBeDefined();
    });

    it('should login user with correct data ', async () => {
        await request(app)
            .delete(FULL_TESTING_ENDPOINTS.DELETE_ALL_DATA)
            .expect(HTTP_STATUS.NO_CONTENT);
        const newUserData = {
            login: "regUser",
            password: "string1234556",
            email: "itiincubator.training1312@gmail.com"
        };
        await request(app)
            .post(AUTH_FULL_URLS.REGISTRATION)
            .send(newUserData)
            .expect(HTTP_STATUS.NO_CONTENT);
        const createdUser = await userServiceInstance.findByField({email: newUserData.email});
        expect(createdUser.data).toBeDefined();
        expect(createdUser.data!.isActivated).toBe(false);
        expect(createdUser.data!.confirmationCode).toBeDefined();

        await request(app)
            .post(AUTH_FULL_URLS.REG_CONFIRMATION)
            .send({code: createdUser.data!.confirmationCode})
            .expect(HTTP_STATUS.NO_CONTENT);

        const agent = 'MyDevice01234'
        const res = await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .set('User-Agent', agent)
            .send({
                loginOrEmail: newUserData.login,
                password: newUserData.password,
            })
            .expect(HTTP_STATUS.OK);
        expect(res.body.accessToken).toBeDefined();

        const res1 = await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .set('User-Agent', agent)
            .send({
                loginOrEmail: newUserData.email,
                password: newUserData.password,
            })
            .expect(HTTP_STATUS.OK);
        expect(res1.body.accessToken).toBeDefined();

    });

    it('should not register a new user since such user already exists', async () => {
        const newUserBody = {
            login: "regUser",
            password: "string1234556",
            email: "itiincubator.training1312@gmail.com"
        };
        const newuser = await request(app)
            .post(AUTH_FULL_URLS.REGISTRATION)
            .send(newUserBody);
        expect(newuser.status).toBe(HTTP_STATUS.BAD_REQUEST);
    });

    it('should return data about active user', async () => {

        const newUserData = {
            login: "itiincub12",
            password: "string1234556",
            email: "exampl1234@example.com"
        }

        await request(app)
            .post(USER_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send(newUserData)
            .expect(HTTP_STATUS.CREATED);
        const agent = 'Device-4';

        const res = await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .set('User-Agent', agent)
            .send({
                loginOrEmail: newUserData.login,
                password: newUserData.password,
            });
        const accessToken = res.body.accessToken;

        const newuser = await request(app)
            .get(AUTH_FULL_URLS.GET_DATA_ABOUT_CURRENT_ACTIVE_USER)
            .set('Authorization', `Bearer ${accessToken}`)
        expect(newuser.status).toBe(HTTP_STATUS.OK);
        expect(newuser.body.login).toBe(newUserData.login);
        expect(newuser.body.email).toBe(newUserData.email);
        expect(newuser.body.userId).toBeDefined();

    });

    it('should confirm user registration', async () => {
        await request(app)
            .delete(FULL_TESTING_ENDPOINTS.DELETE_ALL_DATA)
            .expect(HTTP_STATUS.NO_CONTENT);
        const newUserBody = {
            login: "regUser",
            password: "string1234556",
            email: "itiincubator.training1312@gmail.com"
        };
        await request(app)
            .post(AUTH_FULL_URLS.REGISTRATION)
            .send(newUserBody)
            .expect(HTTP_STATUS.NO_CONTENT);

        const createdUser = await userServiceInstance.findByField({email: newUserBody.email});
        expect(createdUser.data).toBeDefined();
        expect(createdUser.data!.confirmationCode).toBeDefined();
        expect(createdUser.data!.isActivated).toBe(false);

        await request(app)
            .post(AUTH_FULL_URLS.REG_CONFIRMATION)
            .send({code: createdUser.data!.confirmationCode})
            .expect(HTTP_STATUS.NO_CONTENT);
        const userAfterConfirmation = await userServiceInstance.findByField({email: newUserBody.email});
        expect(createdUser.data).toBeDefined();
        expect(userAfterConfirmation.data!.confirmationCode).toBe(createdUser.data!.confirmationCode);
        expect(userAfterConfirmation.data!.isActivated).toBe(true);

        const res = await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .set('User-Agent', 'DEVICE 1')
            .send({
                loginOrEmail: newUserBody.login,
                password: newUserBody.password,
            });
        expect(res.status).toBe(HTTP_STATUS.OK);
        expect(res.body.accessToken).toBeDefined();

    });

    it('should not confirm user with incorrect confirmation code', async () => {
        await request(app)
            .delete(FULL_TESTING_ENDPOINTS.DELETE_ALL_DATA)
            .expect(HTTP_STATUS.NO_CONTENT);
        const newUserBody = {
            login: "regUser",
            password: "string1234556",
            email: "itiincubator.training1312@gmail.com"
        };
        await request(app)
            .post(AUTH_FULL_URLS.REGISTRATION)
            .send(newUserBody)
            .expect(HTTP_STATUS.NO_CONTENT);

        const createdUser = await userServiceInstance.findByField({email: newUserBody.email});
        expect(createdUser.data).toBeDefined();
        expect(createdUser.data!.confirmationCode).toBeDefined();

        await request(app)
            .post(AUTH_FULL_URLS.REG_CONFIRMATION)
            .send({code: 'this is my test confirmation code'})
            .expect(HTTP_STATUS.BAD_REQUEST);
        const userAfterConfirmation = await userServiceInstance.findByField({email: newUserBody.email});
        expect(createdUser.data).toBeDefined();
        expect(userAfterConfirmation.data!.confirmationCode).toBe(createdUser.data!.confirmationCode);
        expect(userAfterConfirmation.data!.isActivated).toBe(false);
    });

    it('should not confirm user who has already been confirmed', async () => {
        await request(app)
            .delete(FULL_TESTING_ENDPOINTS.DELETE_ALL_DATA)
            .expect(HTTP_STATUS.NO_CONTENT);
        const newUserBody = {
            login: "regUser",
            password: "string1234556",
            email: "itiincubator.training1312@gmail.com"
        };
        await request(app)
            .post(AUTH_FULL_URLS.REGISTRATION)
            .send(newUserBody)
            .expect(HTTP_STATUS.NO_CONTENT);

        const createdUser = await userServiceInstance.findByField({email: newUserBody.email});
        expect(createdUser.data).toBeDefined();
        expect(createdUser.data!.confirmationCode).toBeDefined();
        await request(app)
            .post(AUTH_FULL_URLS.REG_CONFIRMATION)
            .send({code: createdUser.data!.confirmationCode})
            .expect(HTTP_STATUS.NO_CONTENT);
        const userAfterConfirmation = await userServiceInstance.findByField({email: newUserBody.email});
        expect(createdUser.data).toBeDefined();
        expect(userAfterConfirmation.data!.confirmationCode).toBe(createdUser.data!.confirmationCode);
        expect(userAfterConfirmation.data!.isActivated).toBe(true);
        await request(app)
            .post(AUTH_FULL_URLS.REG_CONFIRMATION)
            .send({code: createdUser.data!.confirmationCode})
            .expect(HTTP_STATUS.BAD_REQUEST);

    });

    it('should not confirm with another user code', async () => {
        await request(app)
            .delete(FULL_TESTING_ENDPOINTS.DELETE_ALL_DATA)
            .expect(HTTP_STATUS.NO_CONTENT);
        const newUserBody = {
            login: "regUser",
            password: "string1234556",
            email: "itiincubator.training1312@gmail.com"
        };
        await request(app)
            .post(AUTH_FULL_URLS.REGISTRATION)
            .send(newUserBody)
            .expect(HTTP_STATUS.NO_CONTENT);

        const newUserBody2 = {
            login: "regUser1",
            password: "string1234556",
            email: "maksims.minkevics@gmail.com"
        };
        await request(app)
            .post(AUTH_FULL_URLS.REGISTRATION)
            .send(newUserBody2)
            .expect(HTTP_STATUS.NO_CONTENT);

        const createdUser1 = await userServiceInstance.findByField({email: newUserBody.email});
        expect(createdUser1.data).toBeDefined();
        expect(createdUser1.data!.confirmationCode).toBeDefined();
        expect(createdUser1.data!.isActivated).toBe(false);

        await request(app)
            .post(AUTH_FULL_URLS.REG_CONFIRMATION)
            .send({code: createdUser1.data!.confirmationCode})
            .expect(HTTP_STATUS.NO_CONTENT);

        await request(app)
            .post(AUTH_FULL_URLS.REG_CONFIRMATION)
            .send({code: createdUser1.data!.confirmationCode})
            .expect(HTTP_STATUS.BAD_REQUEST);

        const createdUser2 = await userServiceInstance.findByField({email: newUserBody2.email});
        expect(createdUser2.data).toBeDefined();
        expect(createdUser2.data!.confirmationCode).toBeDefined();
        expect(createdUser2.data!.isActivated).toBe(false);

    });

    it('should resend user registration confirmation code', async () => {

        await request(app)
            .delete(FULL_TESTING_ENDPOINTS.DELETE_ALL_DATA)
            .expect(HTTP_STATUS.NO_CONTENT);
        const newUserBody = {
            login: "regUser",
            password: "string1234556",
            email: "itiincubator.training1312@gmail.com"
        };
        await request(app)
            .post(AUTH_FULL_URLS.REGISTRATION)
            .send(newUserBody)
            .expect(HTTP_STATUS.NO_CONTENT);

        const createdUser1 = await userServiceInstance.findByField({email: newUserBody.email});
        expect(createdUser1.data).toBeDefined();
        expect(createdUser1.data!.confirmationCode).toBeDefined();
        expect(createdUser1.data!.isActivated).toBe(false);
        const oldConfiramtionCode = createdUser1.data!.confirmationCode;

        await request(app)
            .post(AUTH_FULL_URLS.RESEND_REG_CONF_EMAIL)
            .send({email: newUserBody.email})
            .expect(HTTP_STATUS.NO_CONTENT);

        const createdUser2 = await userServiceInstance.findByField({email: newUserBody.email});
        expect(createdUser2.data).toBeDefined();
        expect(createdUser2.data!.confirmationCode).toBeDefined();
        expect(createdUser2.data!.isActivated).toBe(false);
        expect(createdUser2.data!.confirmationCode).not.toEqual(oldConfiramtionCode);

        await request(app)
            .post(AUTH_FULL_URLS.REG_CONFIRMATION)
            .send({code: createdUser2.data!.confirmationCode})
            .expect(HTTP_STATUS.NO_CONTENT);

        const createdUser3 = await userServiceInstance.findByField({email: newUserBody.email});
        expect(createdUser3.data).toBeDefined();
        expect(createdUser3.data!.confirmationCode).toEqual(createdUser2.data!.confirmationCode);
        expect(createdUser3.data!.isActivated).toBe(true);

        await request(app)
            .post(AUTH_FULL_URLS.REG_CONFIRMATION)
            .send({code: oldConfiramtionCode})
            .expect(HTTP_STATUS.BAD_REQUEST);
    });

    it('should not resend user registration confirmation code for non existing user', async () => {
        await request(app)
            .post(AUTH_FULL_URLS.RESEND_REG_CONF_EMAIL)
            .send({email: "fake.email@gfake.com"})
            .expect(HTTP_STATUS.BAD_REQUEST);
    });

    it('should login user with correct data ', async () => {
        await request(app)
            .delete(FULL_TESTING_ENDPOINTS.DELETE_ALL_DATA)
            .expect(HTTP_STATUS.NO_CONTENT);
        const newUserData = {
            login: "regUser",
            password: "string1234556",
            email: "itiincubator.training1312@gmail.com"
        };
        await request(app)
            .post(AUTH_FULL_URLS.REGISTRATION)
            .send(newUserData)
            .expect(HTTP_STATUS.NO_CONTENT);
        const createdUser = await userServiceInstance.findByField({email: newUserData.email});
        expect(createdUser.data).toBeDefined();
        expect(createdUser.data!.isActivated).toBe(false);
        expect(createdUser.data!.confirmationCode).toBeDefined();

        await request(app)
            .post(AUTH_FULL_URLS.REG_CONFIRMATION)
            .send({code: createdUser.data!.confirmationCode})
            .expect(HTTP_STATUS.NO_CONTENT);

        const agent = 'MyDevice01234'
        const res = await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .set('User-Agent', agent)
            .send({
                loginOrEmail: newUserData.login,
                password: newUserData.password,
            })
            .expect(HTTP_STATUS.OK);
        expect(res.body.accessToken).toBeDefined();

        const res1 = await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .set('User-Agent', agent)
            .send({
                loginOrEmail: newUserData.email,
                password: newUserData.password,
            })
            .expect(HTTP_STATUS.OK);
        expect(res1.body.accessToken).toBeDefined();

    });

    it('should not login user with incorrect data ', async () => {
        await request(app)
            .delete(FULL_TESTING_ENDPOINTS.DELETE_ALL_DATA)
            .expect(HTTP_STATUS.NO_CONTENT);
        const newUserData = {
            login: "regUser",
            password: "string1234556",
            email: "itiincubator.training1312@gmail.com"
        };
        await request(app)
            .post(AUTH_FULL_URLS.REGISTRATION)
            .send(newUserData)
            .expect(HTTP_STATUS.NO_CONTENT);
        const createdUser = await userServiceInstance.findByField({email: newUserData.email});
        expect(createdUser.data).toBeDefined();
        expect(createdUser.data!.isActivated).toBe(false);
        expect(createdUser.data!.confirmationCode).toBeDefined();

        await request(app)
            .post(AUTH_FULL_URLS.REG_CONFIRMATION)
            .send({code: createdUser.data!.confirmationCode})
            .expect(HTTP_STATUS.NO_CONTENT);

        const agent = 'MyDevice01234'
        const res = await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .set('User-Agent', agent)
            .send({
                loginOrEmail: newUserData.login,
                password: newUserData.password,
            })
            .expect(HTTP_STATUS.OK);
        expect(res.body.accessToken).toBeDefined();

        const res1 = await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .set('User-Agent', agent)
            .send({
                loginOrEmail: newUserData.login,
                password: newUserData.password+'12121212',
            })
            .expect(HTTP_STATUS.UNAUTHORIZED);
        expect(res1.body.accessToken).toBeUndefined();

        await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .set('User-Agent', agent)
            .send({
                loginOrEmail: newUserData.email +'12121212',
                password: newUserData.password,
            })
            .expect(HTTP_STATUS.UNAUTHORIZED);
        expect(res1.body.accessToken).toBeUndefined();

        await request(app)
            .post(AUTH_FULL_URLS.LOGIN)
            .set('User-Agent', agent)
            .send({
                loginOrEmail: newUserData.login +'12121212',
                password: newUserData.password,
            })
            .expect(HTTP_STATUS.UNAUTHORIZED);
        expect(res1.body.accessToken).toBeUndefined();
    });
    describe('User Password Resset', () => {
        let basicAuth: string;
        const userCreationData = {
            login: "itiincub12",
            password: "string1234556",
            email: "exampl1234@example.com"
        };
        const newPswrd = "mySupperStrongP123"

        beforeAll(async () => {
            await request(app)
                .delete(FULL_TESTING_ENDPOINTS.DELETE_ALL_DATA)
                .expect(HTTP_STATUS.NO_CONTENT);

            basicAuth = await encodeToBase64ForBasicAuth(
                process.env.SUPER_SECRET_NAME || "",
                process.env.SUPER_SECRET_PSWRD || ""
            )

            await request(app)
                .post(USER_FULL_URLS.CREATE)
                .set('Authorization', `Basic ${basicAuth}`)
                .send(userCreationData)
                .expect(HTTP_STATUS.CREATED);
        });

        it('should send password recovery code for correct email', async () => {

            await request(app)
                .post(AUTH_FULL_URLS.RECOVER_PASSWORD)
                .send({email: userCreationData.email})
                .expect(HTTP_STATUS.NO_CONTENT);

            const createdUser = await userServiceInstance.findByField({email: userCreationData.email});
            expect(createdUser.data).toBeDefined();
            expect(createdUser.data!.pswrdRecoveryCode).toBeDefined();

        });

        it('should not send password recovery code for incorrect email', async () => {

            await request(app)
                .post(AUTH_FULL_URLS.RECOVER_PASSWORD)
                .send({email: userCreationData.email})
                .expect(HTTP_STATUS.NO_CONTENT);

            const createdUser = await userServiceInstance.findByField({email: "wrongemail@gmmmaalsfail.com"});
            expect(createdUser.data).toBe(null);

        });

        it('should not recover without confirmation code', async () => {
            const user = await userServiceInstance.findByField({email: userCreationData.email});
            await request(app)
                .post(AUTH_FULL_URLS.CONFIRM_NEW_PASSWORD)
                .send({newPassword: newPswrd , recoveryCode: ""})
                .expect(HTTP_STATUS.BAD_REQUEST);

            const createdUser = await userServiceInstance.findByField({email: userCreationData.email});
            expect(createdUser.data).toBeDefined();
            expect(createdUser.data!.password).toBe(user.data!.password);
        });


        it('should not recover without new password', async () => {
            const user = await userServiceInstance.findByField({email: userCreationData.email});
            await request(app)
                .post(AUTH_FULL_URLS.CONFIRM_NEW_PASSWORD)
                .send({newPassword: "", recoveryCode: user.data!.pswrdRecoveryCode})
                .expect(HTTP_STATUS.BAD_REQUEST);

            const createdUser = await userServiceInstance.findByField({email: userCreationData.email});
            expect(createdUser.data).toBeDefined();
            expect(createdUser.data!.password).toBe(user.data!.password);
        });

        it('should recover password and update user with new password data', async () => {
            await request(app)
                .post(AUTH_FULL_URLS.RECOVER_PASSWORD)
                .send({email: userCreationData.email})
                .expect(HTTP_STATUS.NO_CONTENT);

            const user = await userServiceInstance.findByField({email: userCreationData.email});

            expect(user.data).toBeDefined();
            expect(user.data!.pswrdRecoveryCode).toBeDefined();
            const pswrBeforeUpdate = user.data!.password;

            await request(app)
                .post(AUTH_FULL_URLS.CONFIRM_NEW_PASSWORD)
                .send({newPassword: newPswrd , recoveryCode: user.data!.pswrdRecoveryCode})
                .expect(HTTP_STATUS.NO_CONTENT);

            const userAfterPswrdUpdate = await userServiceInstance.findByField({email: userCreationData.email});
            expect(userAfterPswrdUpdate.data).toBeDefined();
            expect(userAfterPswrdUpdate.data!.pswrdRecoveryCode).toBe("");
            expect(userAfterPswrdUpdate.data!.password).not.toBe(pswrBeforeUpdate);
            expect((await passwordServiceInstance.compare(userAfterPswrdUpdate.data!.password, newPswrd)).status).toBe(true);
        });
        it('should login with a new password', async () => {
            const agent = 'MyDevice01234'
            const res = await request(app)
                .post(AUTH_FULL_URLS.LOGIN)
                .set('User-Agent', agent)
                .send({
                    loginOrEmail: userCreationData.login,
                    password: newPswrd,
                })
                .expect(HTTP_STATUS.OK);
            expect(res.body.accessToken).toBeDefined();
            const agent2 = 'MyDevice01235'
            const res2 = await request(app)
                .post(AUTH_FULL_URLS.LOGIN)
                .set('User-Agent', agent2)
                .send({
                    loginOrEmail: userCreationData.email,
                    password: newPswrd,
                })
                .expect(HTTP_STATUS.OK);
            expect(res2.body.accessToken).toBeDefined();
        });


        it('should not login with an old password', async () => {
            const agent = 'MyDevice01234'
            const res = await request(app)
                .post(AUTH_FULL_URLS.LOGIN)
                .set('User-Agent', agent)
                .send({
                    loginOrEmail: userCreationData.login,
                    password: userCreationData.password,
                })
                .expect(HTTP_STATUS.UNAUTHORIZED);
            expect(res.body.accessToken).toBeUndefined();
        });


    });
});