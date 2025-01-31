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
let refreshToken4: string;
let deviceId1: string;


// Создание пользователя
beforeAll(async () => {
    await request(app)
        .delete(process.env.BASE_URL + consts.TESTING_BASE_END_POINT + consts.END_POINTS.TESTING.DELETE_ALL_DATA)
        .expect(settings.RESP_CODES.NO_CONTENT);
});




describe('Device Management Tests', () => {

    beforeEach(async () => {
        await request(app)
            .delete(process.env.BASE_URL + consts.TESTING_BASE_END_POINT + consts.END_POINTS.TESTING.DELETE_ALL_DATA)
            .expect(settings.RESP_CODES.NO_CONTENT);

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
            } else if (agent === 'Device-4') {
                refreshToken4 = res.headers['set-cookie'];
            }
        }

    })

    it('should update refreshToken of device 1 and verify device list', async () => {
        console.log(refreshToken1)
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

        const devicesResponse2 = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken2);

        expect(devicesResponse2.status).toBe(settings.RESP_CODES.UNAUTHORIZED);
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

        const devicesResponse3 = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken3);

        expect(devicesResponse3.status).toBe(settings.RESP_CODES.UNAUTHORIZED);

        const devicesResponse1 = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken1);

        expect(devicesResponse1.status).toBe(settings.RESP_CODES.OK);

        const devicesResponse2 = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken2);

        expect(devicesResponse2.status).toBe(settings.RESP_CODES.OK);

        const devicesResponse4 = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken4);

        expect(devicesResponse4.status).toBe(settings.RESP_CODES.OK);
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

        const devicesResponse2 = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken2);

        expect(devicesResponse2.status).toBe(settings.RESP_CODES.UNAUTHORIZED);

        const devicesResponse3 = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken2);

        expect(devicesResponse3.status).toBe(settings.RESP_CODES.UNAUTHORIZED);

        const devicesResponse4 = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken4);

        expect(devicesResponse4.status).toBe(settings.RESP_CODES.UNAUTHORIZED);

    });

    it("the 'refresh' token should become invalid after '/auth/refresh-token' request", async () => {

        const allActiveDevices = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken1);
        const device1 = allActiveDevices.body.find((device: any) => device.title === 'Device-1')

        const deleteResponse = await request(app)
            .delete(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + `/${device1.deviceId}`)
            .set('Cookie', refreshToken1);

        expect(deleteResponse.status).toBe(settings.RESP_CODES.NO_CONTENT);

        const refreshResponse: any = await request(app)
            .post(process.env.BASE_URL + consts.AUTH_BASE_END_POINT + consts.END_POINTS.AUTH.REFRESH_TOKEN)
            .set('Cookie', refreshToken1);
        expect(refreshResponse.status).toBe(settings.RESP_CODES.UNAUTHORIZED);

        const logoutResponse = await request(app)
            .post(process.env.BASE_URL + consts.AUTH_BASE_END_POINT + consts.END_POINTS.AUTH.LOGOUT)
            .set('Cookie', refreshToken1);

        expect(logoutResponse.status).toBe(settings.RESP_CODES.UNAUTHORIZED);
    });

    it("the 'refresh' token should become invalid after POST: /auth/logout request", async () => {
        const devicesResponse1 = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken1);

        expect(devicesResponse1.status).toBe(settings.RESP_CODES.OK);

        const devicesResponse1AfterLogOut = await request(app)
            .post(process.env.BASE_URL + consts.AUTH_BASE_END_POINT + consts.END_POINTS.AUTH.LOGOUT)
            .set('Cookie', refreshToken1);

        expect(devicesResponse1AfterLogOut.status).toBe(settings.RESP_CODES.NO_CONTENT);

        const getDevicesResponse1AfterLogOut = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken1);

        expect(getDevicesResponse1AfterLogOut.status).toBe(settings.RESP_CODES.UNAUTHORIZED);

        const devicesResponse2 = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken2);

        expect(devicesResponse2.status).toBe(settings.RESP_CODES.OK);

        const devicesResponse3 = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken3);

        expect(devicesResponse3.status).toBe(settings.RESP_CODES.OK);

        const devicesResponse4 = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken4);

        expect(devicesResponse4.status).toBe(settings.RESP_CODES.OK);
    });

    it("/security/devices: should not change device id after call /auth/refresh-token. LastActiveDate should be changed; status 200; content: device list;", async () => {
        const devicesBeforeRefreshToken: any = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshToken1);
        expect(devicesBeforeRefreshToken.status).toBe(settings.RESP_CODES.OK);
        expect(devicesBeforeRefreshToken.body).toHaveLength(4);

        const refreshResponse: any = await request(app)
            .post(process.env.BASE_URL + consts.AUTH_BASE_END_POINT + consts.END_POINTS.AUTH.REFRESH_TOKEN)
            .set('Cookie', refreshToken1);
        expect(refreshResponse.status).toBe(settings.RESP_CODES.OK);

        const devicesAfterRefreshToken: any = await request(app)
            .get(process.env.BASE_URL + consts.SECURITY_DEVICES_BASE_END_POINT + consts.END_POINTS.SESSION.GET_ACTIVE_DEVICES)
            .set('Cookie', refreshResponse.headers['set-cookie']);
        expect(devicesAfterRefreshToken.status).toBe(settings.RESP_CODES.OK);
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
