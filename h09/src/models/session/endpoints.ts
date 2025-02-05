export const SESSION_ENDPOINTS = {
    GENERAL: `${process.env.BASE_URL}/security/devices/`,
    GET_ACTIVE_DEVICES: `/security/devices`,
    DELETE: `/security/devices/`,
    DELETE_BY_ID: (id: string) => {console.log('id', id);return `/security/devices/${id}`},
}