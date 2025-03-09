import request from 'supertest';
import {app} from '../src/app';
import dotenv from "dotenv";
import {encodeToBase64ForBasicAuth} from "../src/general/utilities";
import {HTTP_STATUS} from "../src/general/global-consts";
import {FULL_TESTING_ENDPOINTS, TESTING_ENDPOINTS} from "../src/models/testing/endpoints";
import {USER_FULL_URLS} from "../src/models/user/endpoints";
import {AUTH_FULL_URLS} from "../src/models/auth/endpoints";
import {SESSION_FULL_URLS} from "../src/models/session/endpoints";
dotenv.config();
let accessToken1: string;
let refreshToken1: string;
let refreshToken2: string;
let refreshToken3: string;
let refreshToken4: string;


// Создание пользователя
beforeAll(async () => {
    await request(app)
        .delete(FULL_TESTING_ENDPOINTS.DELETE_ALL_DATA)
        .expect(HTTP_STATUS.NO_CONTENT);
});

describe('Device Management Tests', () => {

    beforeEach(async () => {
        await request(app)
            .delete(FULL_TESTING_ENDPOINTS.DELETE_ALL_DATA)
            .expect(HTTP_STATUS.NO_CONTENT);

        const basicAuth = await encodeToBase64ForBasicAuth(
            process.env.SUPER_SECRET_NAME || "",
            process.env.SUPER_SECRET_PSWRD || ""
        )
        const res = await request(app)
            .post(USER_FULL_URLS.CREATE)
            .set('Authorization', `Basic ${basicAuth}`)
            .send({
                login: "itiincub12",
                password: "string1234556",
                email: "exampl1234@example.com"
            })
            .expect(HTTP_STATUS.CREATED);

        const userAgents = ['Device-1', 'Device-2', 'Device-3', 'Device-4'];

        for (const agent of userAgents) {
            const res = await request(app)
                .post(AUTH_FULL_URLS.LOGIN)
                .set('User-Agent', agent)
                .send({
                    loginOrEmail: 'itiincub12',
                    password: 'string1234556',
                });
            if (agent === 'Device-1') {
                accessToken1 = res.body.accessToken;
                refreshToken1 = res.headers['set-cookie'];
            } else if (agent === 'Device-2') {
                refreshToken2 = res.headers['set-cookie'];
            } else if (agent === 'Device-3') {
                refreshToken3 = res.headers['set-cookie'];
            } else if (agent === 'Device-4') {
                refreshToken4 = res.headers['set-cookie'];
            }
        }

    })

    it('should update refreshToken of device 1 and verify device list', async () => {
        const initialResponse = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken1);
        expect(initialResponse.status).toBe(HTTP_STATUS.OK);

        const device1Before = initialResponse.body.find(
            (device: any) =>  device.title === 'Device-1'
        );
        expect(device1Before).toBeDefined();
        const initialLastActiveDate = device1Before.lastActiveDate;
        const initialdeviceId = device1Before.deviceId;

        const refreshResponse = await request(app)
            .post(AUTH_FULL_URLS.REFRESH_TOKEN)
            .set('Cookie', refreshToken1);
        expect(refreshResponse.status).toBe(HTTP_STATUS.OK);
        refreshToken1 = refreshResponse.headers['set-cookie'];

        const devicesResponse = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken1);

        expect(devicesResponse.status).toBe(HTTP_STATUS.OK);

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
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken1);
        const device2 = allActiveDevices.body.find((device: any) => device.title === 'Device-2')

        const deleteResponse = await request(app)
            .delete(SESSION_FULL_URLS.DELETE_BY_ID(device2.deviceId))
            .set('Cookie', refreshToken1);
        expect(deleteResponse.status).toBe(HTTP_STATUS.NO_CONTENT);
        const devicesResponse = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken1);

        expect(devicesResponse.status).toBe(HTTP_STATUS.OK);
        expect(
            devicesResponse.body.find((device: any) => device.title === 'Device-2')
        ).toBeUndefined();

        const devicesResponse2 = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken2);

        expect(devicesResponse2.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    it('should logout device 3 and verify it is removed from the list', async () => {
        const logoutResponse = await request(app)
            .post(AUTH_FULL_URLS.LOGOUT)
            .set('Cookie', refreshToken3);
        expect(logoutResponse.status).toBe(HTTP_STATUS.NO_CONTENT);

        const devicesResponse = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken1);

        expect(devicesResponse.status).toBe(HTTP_STATUS.OK);
        expect(
            devicesResponse.body.find((device: any) => device.title === 'Device-3')
        ).toBeUndefined();

        const devicesResponse3 = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken3);

        expect(devicesResponse3.status).toBe(HTTP_STATUS.UNAUTHORIZED);

        const devicesResponse1 = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken1);

        expect(devicesResponse1.status).toBe(HTTP_STATUS.OK);

        const devicesResponse2 = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken2);

        expect(devicesResponse2.status).toBe(HTTP_STATUS.OK);

        const devicesResponse4 = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken4);

        expect(devicesResponse4.status).toBe(HTTP_STATUS.OK);
    });

    it('should delete all devices except the current one', async () => {
        const deleteResponse = await request(app)
            .delete(SESSION_FULL_URLS.DELETE)
            .set('Cookie', refreshToken1);
        expect(deleteResponse.status).toBe(HTTP_STATUS.NO_CONTENT);

        const devicesResponse = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken1);

        expect(devicesResponse.status).toBe(HTTP_STATUS.OK);
        expect(devicesResponse.body).toHaveLength(1);

        const devicesResponse2 = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken2);

        expect(devicesResponse2.status).toBe(HTTP_STATUS.UNAUTHORIZED);

        const devicesResponse3 = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken2);

        expect(devicesResponse3.status).toBe(HTTP_STATUS.UNAUTHORIZED);

        const devicesResponse4 = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken4);

        expect(devicesResponse4.status).toBe(HTTP_STATUS.UNAUTHORIZED);

    });

    it("the 'refresh' token should become invalid after '/auth/refresh-token' request", async () => {

        const allActiveDevices = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken1);
        const device1 = allActiveDevices.body.find((device: any) => device.title === 'Device-1')

        const deleteResponse = await request(app)
            .delete(SESSION_FULL_URLS.DELETE_BY_ID(device1.deviceId))
            .set('Cookie', refreshToken1);

        expect(deleteResponse.status).toBe(HTTP_STATUS.NO_CONTENT);

        const refreshResponse: any = await request(app)
            .post(AUTH_FULL_URLS.REFRESH_TOKEN)
            .set('Cookie', refreshToken1);
        expect(refreshResponse.status).toBe(HTTP_STATUS.UNAUTHORIZED);

        const logoutResponse = await request(app)
            .post(AUTH_FULL_URLS.LOGOUT)
            .set('Cookie', refreshToken1);

        expect(logoutResponse.status).toBe(HTTP_STATUS.UNAUTHORIZED);
    });

    it("the 'refresh' token should become invalid after POST: /auth/logout request", async () => {
        const devicesResponse1 = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken1);

        expect(devicesResponse1.status).toBe(HTTP_STATUS.OK);

        const devicesResponse1AfterLogOut = await request(app)
            .post(AUTH_FULL_URLS.LOGOUT)
            .set('Cookie', refreshToken1);

        expect(devicesResponse1AfterLogOut.status).toBe(HTTP_STATUS.NO_CONTENT);
        HTTP_STATUS.NO_CONTENT
        const getDevicesResponse1AfterLogOut = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken1);

        expect(getDevicesResponse1AfterLogOut.status).toBe(HTTP_STATUS.UNAUTHORIZED);

        const devicesResponse2 = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken2);

        expect(devicesResponse2.status).toBe(HTTP_STATUS.OK);

        const devicesResponse3 = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken3);

        expect(devicesResponse3.status).toBe(HTTP_STATUS.OK);

        const devicesResponse4 = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken4);

        expect(devicesResponse4.status).toBe(HTTP_STATUS.OK);
    });

    it("/security/devices: should not change device id after call /auth/refresh-token. LastActiveDate should be changed; status 200; content: device list;", async () => {
        const devicesBeforeRefreshToken: any = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshToken1);
        expect(devicesBeforeRefreshToken.status).toBe(HTTP_STATUS.OK);
        expect(devicesBeforeRefreshToken.body).toHaveLength(4);

        const refreshResponse: any = await request(app)
            .post(AUTH_FULL_URLS.REFRESH_TOKEN)
            .set('Cookie', refreshToken1);
        expect(refreshResponse.status).toBe(HTTP_STATUS.OK);

        const devicesAfterRefreshToken: any = await request(app)
            .get(SESSION_FULL_URLS.GET)
            .set('Cookie', refreshResponse.headers['set-cookie']);
        expect(devicesAfterRefreshToken.status).toBe(HTTP_STATUS.OK);
        expect(devicesAfterRefreshToken.body).toHaveLength(4);
        for (const beforeDevice of devicesBeforeRefreshToken.body) {
            const afterDevice = devicesAfterRefreshToken.body.find(
                (device: any) => device.title === beforeDevice.title
            );
            expect(afterDevice).toBeDefined();
            expect(afterDevice.deviceId).toBe(beforeDevice.deviceId);
            if (beforeDevice.title === 'Device-1'){
                expect(new Date(afterDevice.lastActiveDate).getTime()).toBeGreaterThan(
                    new Date(beforeDevice.lastActiveDate).getTime()
                );
            }
            else {
                expect(new Date(afterDevice.lastActiveDate).getTime()).toEqual(
                    new Date(beforeDevice.lastActiveDate).getTime()
                );
            }
        }
    });

});
