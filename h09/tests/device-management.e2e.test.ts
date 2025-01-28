import request from 'supertest';
import {app} from '../src/app';
import {SessionViewModel} from '../src/app/index';
import {settings} from "../src/settings";
import dotenv from "dotenv";
import {encodeToBase64ForBasicAuth} from "../src/app/utilities";
import {consts} from "../src/app/global-consts";
dotenv.config();
let accessToken1: string;
let refreshToken1: string;
let refreshToken2: string;
let refreshToken3: string;
let userId: string;
let deviceId1: string;
let deviceId2: string;
let deviceId3: string;
let deviceId4: string;

// Создание пользователя
beforeAll(async () => {
    await request(app)
        .delete(process.env.BASE_URL + consts.TESTING_BASE_END_POINT + consts.END_POINTS.TESTING.DELETE_ALL_DATA)
        .expect(settings.RESP_CODES.NO_CONTENT);
});


describe('Device Management Tests', () => {

    beforeAll(async () => {
        const basicAuth = await encodeToBase64ForBasicAuth(
            process.env.SUPER_SECRET_NAME || "",
            process.env.SUPER_SECRET_PSWRD || ""
        )
        const res = await request(app)
            .post(process.env.BASE_URL + consts.USERS_BASE_END_POINT + consts.END_POINTS.USER.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send({
                login: "itiincub12",
                password: "string1234556",
                email: "exampl1234@example.com"
        })
        .expect(settings.RESP_CODES.CREATED);
    });

    it('should login user 4 times with different user-agents', async () => {
        const userAgents = ['Device-1', 'Device-2', 'Device-3', 'Device-4'];

        for (const agent of userAgents) {
            const res = await request(app)
                .post(process.env.BASE_URL + consts.AUTH_BASE_END_POINT + consts.END_POINTS.AUTH.LOGIN)
                .set('User-Agent', agent)
                .send({
                    loginOrEmail: 'itiincub12',
                    password: 'string1234556',
                });
            expect(res.status).toBe(settings.RESP_CODES.OK);
            expect(res.headers['set-cookie']).toBeDefined();
            if (agent === 'Device-1') {
                accessToken1 = res.body.accessToken;
                refreshToken1 = res.headers['set-cookie'];
            } else if (agent === 'Device-2') {
                refreshToken2 = res.headers['set-cookie'];
            } else if (agent === 'Device-3') {
                refreshToken3 = res.headers['set-cookie'];
            }
        }
    });
    it('should update refreshToken of device 1 and verify device list', async () => {
        const initialResponse = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken1);
        expect(initialResponse.status).toBe(settings.RESP_CODES.OK);

        const device1Before = initialResponse.body.find(
            (device: any) =>  device.title === 'Device-1'
        );
        expect(device1Before).toBeDefined();
        const initialLastActiveDate = device1Before.lastActiveDate;
        const initialdeviceId = device1Before.deviceId;

        const refreshResponse = await request(app)
            .post(process.env.BASE_URL + consts.AUTH_BASE_END_POINT + consts.END_POINTS.AUTH.REFRESH_TOKEN)
            .set('Cookie', refreshToken1);
        expect(refreshResponse.status).toBe(settings.RESP_CODES.OK);
        refreshToken1 = refreshResponse.headers['set-cookie'];

        const devicesResponse = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken1);

        expect(devicesResponse.status).toBe(settings.RESP_CODES.OK);

        const device1After = devicesResponse.body.find(
            (device: any) => device.title === 'Device-1'
        );
        expect(device1After).toBeDefined();
        expect(new Date(device1After.lastActiveDate).getTime()).toBeGreaterThan(
            new Date(initialLastActiveDate).getTime()
        );
        expect(initialdeviceId === device1After.deviceId)
    });
    it('should delete device 2 and verify it is removed from the list', async () => {
        const allActiveDevices = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken1);
        const device2 = allActiveDevices.body.find((device: any) => device.title === 'Device-2')

        const deleteResponse = await request(app)
            .delete(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + `/${device2.deviceId}`)
            .set('Cookie', refreshToken1);
        expect(deleteResponse.status).toBe(settings.RESP_CODES.NO_CONTENT);

        const devicesResponse = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken1);

        expect(devicesResponse.status).toBe(settings.RESP_CODES.OK);
        expect(
            devicesResponse.body.find((device: any) => device.title === 'Device-2')
        ).toBeUndefined();
    });
    it('should logout device 3 and verify it is removed from the list', async () => {
        const logoutResponse = await request(app)
            .post(process.env.BASE_URL + consts.AUTH_BASE_END_POINT + consts.END_POINTS.AUTH.LOGOUT)
            .set('Cookie', refreshToken3);
        expect(logoutResponse.status).toBe(settings.RESP_CODES.NO_CONTENT);

        const devicesResponse = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken1);

        expect(devicesResponse.status).toBe(settings.RESP_CODES.OK);
        expect(
            devicesResponse.body.find((device: any) => device.title === 'Device-3')
        ).toBeUndefined();
    });

    it('should delete all devices except the current one', async () => {
        const deleteResponse = await request(app)
            .delete(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.DELETE)
            .set('Cookie', refreshToken1);
        expect(deleteResponse.status).toBe(settings.RESP_CODES.NO_CONTENT);

        const devicesResponse = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken1);

        expect(devicesResponse.status).toBe(settings.RESP_CODES.OK);
        expect(devicesResponse.body).toHaveLength(1);
    });

    it("the 'refresh' token should become invalid after '/auth/refresh-token' request", async () => {
        const refreshResponse = await request(app)
            .post(process.env.BASE_URL + consts.AUTH_BASE_END_POINT + consts.END_POINTS.AUTH.REFRESH_TOKEN)
            .set('Cookie', refreshToken1);
        expect(refreshResponse.status).toBe(settings.RESP_CODES.OK);
        const logoutResponse = await request(app)
            .post(process.env.BASE_URL + consts.AUTH_BASE_END_POINT + consts.END_POINTS.AUTH.LOGOUT)
            .set('Cookie', refreshToken1);
        expect(logoutResponse.status).toBe(settings.RESP_CODES.UNAUTHORIZED);
    });

});
