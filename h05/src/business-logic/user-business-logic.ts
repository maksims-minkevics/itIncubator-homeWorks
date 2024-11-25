const bcrypt = require('bcrypt');
export const UserHelper = {
    hashPwrd: async (pswrd: string): Promise<string | undefined> => {
        try {
            const SALT_ROUNDS = 10;
            return await bcrypt.hash(pswrd, SALT_ROUNDS)            
        }
        catch (e) {
            console.log("Password hash failed", e);
            return
        }


    },

    compare: (pswrdHash: string, pawrd: string): boolean => {
        try {
            return bcrypt.compare(pswrdHash, pawrd)
        }
        catch (e) {
            console.log("Password compare failed", e);
            return false
        }
    }

}